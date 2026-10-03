(() => {
  /* Always open at the top on refresh / F5 */
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  const jumpTop = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  jumpTop();
  document.addEventListener("DOMContentLoaded", jumpTop);
  window.addEventListener("load", jumpTop);
  window.addEventListener("pageshow", (e) => {
    jumpTop();
    if (e.persisted) jumpTop();
  });

  const nav = document.getElementById("iqNav");
  if (!nav) return;

  const toggle = nav.querySelector(".iqNav__toggle");
  const menu = nav.querySelector(".iqNav__menu");

  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  const closeMenu = () => {
    nav.classList.remove("is-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  };

  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  if (menu) {
    menu.addEventListener("click", (e) => {
      if (e.target.closest(".iqNav__link")) closeMenu();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target)) closeMenu();
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
