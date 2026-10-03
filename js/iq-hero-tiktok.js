(() => {
  const VIDEO_URL =
    "https://www.tiktok.com/@iqhouse.official/video/7647823900125973781";
  const VIDEO_ID = "7647823900125973781";
  const COVER_URL = "works/tiktok/hero-cover.jpg?v=2";

  const modal = document.getElementById("iqHeroTikTokModal");
  const mount = document.getElementById("iqHeroTikTokMount");
  if (!modal || !mount) return;

  let isOpen = false;

  const renderPlayer = () => {
    mount.innerHTML = `
      <div class="iqHeroTikTokModal__poster" style="background-image:url('${COVER_URL}')" aria-hidden="true"></div>
      <iframe
        class="iqHeroTikTokModal__iframe"
        src="https://www.tiktok.com/embed/v2/${VIDEO_ID}?lang=th&autoplay=1"
        title="TikTok video IQ HOUSE"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        loading="eager"
        referrerpolicy="strict-origin-when-cross-origin"
      ></iframe>
      <div class="iqHeroTikTokModal__actions">
        <a class="iqHeroTikTokModal__openTiktok" href="${VIDEO_URL}" target="_blank" rel="noopener">
          เปิดใน TikTok
        </a>
      </div>
    `;
  };

  const setOpen = (next) => {
    if (next === isOpen) return;
    isOpen = next;

    modal.classList.toggle("is-open", next);
    modal.setAttribute("aria-hidden", next ? "false" : "true");
    document.documentElement.classList.toggle("iq-tiktok-open", next);
    document.body.classList.toggle("iq-tiktok-open", next);

    if (next) {
      renderPlayer();
      const closeBtn = modal.querySelector("[data-hero-tiktok-close]");
      if (closeBtn) closeBtn.focus();
    } else {
      mount.innerHTML = "";
    }
  };

  const isPlayTrigger = (target) => {
    const el = target && target.closest
      ? target.closest("[data-hero-tiktok-play], .iqHeroCollage__item--tiktok")
      : null;
    return Boolean(el && !el.closest("#iqHeroTikTokModal"));
  };

  // Capture phase so overlays cannot swallow the click
  document.addEventListener(
    "click",
    (e) => {
      if (isPlayTrigger(e.target)) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(true);
        return;
      }

      const closeEl = e.target.closest
        ? e.target.closest("[data-hero-tiktok-close]")
        : null;
      if (closeEl) {
        e.preventDefault();
        setOpen(false);
      }
    },
    true
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) setOpen(false);
    if (
      (e.key === "Enter" || e.key === " ") &&
      isPlayTrigger(e.target)
    ) {
      e.preventDefault();
      setOpen(true);
    }
  });
})();
