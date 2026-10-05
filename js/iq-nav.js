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

  const mobileNav = window.matchMedia("(max-width: 1100px)");

  const syncNavHeight = () => {
    document.documentElement.style.setProperty("--iq-nav-live", nav.getBoundingClientRect().height + "px");
  };

  const closeMenu = () => {
    nav.classList.remove("is-open");
    document.documentElement.classList.remove("iq-nav-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "เปิดเมนู");
    }
  };

  if (toggle) {
    toggle.addEventListener("click", () => {
      syncNavHeight();
      const open = nav.classList.toggle("is-open");
      document.documentElement.classList.toggle("iq-nav-open", open && mobileNav.matches);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "ปิดเมนู" : "เปิดเมนู");
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
  window.addEventListener("resize", () => {
    syncNavHeight();
    if (!mobileNav.matches) closeMenu();
  });
  syncNavHeight();
  onScroll();
})();
