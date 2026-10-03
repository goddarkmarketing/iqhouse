(() => {
  const REVEAL_AFTER_MS = 8000;
  /* Night must start with text — keep fade short so copy never floats on bright video */
  const NIGHT_FADE_MS = 700;
  const SHINE_AT_MS = 750;
  /* Match --iq-hero-pin / --iq-hero-hold in CSS */
  const HOLD_VH = 55;

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  const boot = () => {
    const scene = document.getElementById("iqHeroScene");
    const section = document.getElementById("iqHeroVideo");
    if (!scene || !section) return;

    const track = scene.querySelector(".iqHeroScene__track");
    const sticky = scene.querySelector(".iqHeroScene__sticky");
    const video = section.querySelector(".iqHeroVideo__media");
    if (!track || !sticky || !video) return;

    let revealed = false;
    let scrollReady = false;
    let timerId = 0;
    let shineTimerId = 0;
    let ticking = false;
    let userFastForwarded = false;

    const setProgress = (p) => {
      const value = clamp(p, 0, 1);
      section.style.setProperty("--iq-hero-p", value.toFixed(4));
      section.classList.toggle("is-split", value > 0.04);
      section.classList.toggle("is-splitDone", value >= 0.995);
      scene.classList.toggle("is-heroComplete", value >= 0.995);
    };

    const updateScrollProgress = () => {
      ticking = false;
      if (!scrollReady) {
        setProgress(0);
        return;
      }

      const navH =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--iq-nav-h"
          )
        ) || 78;
      const trackRect = track.getBoundingClientRect();
      const stickyH = sticky.offsetHeight;
      const totalRange = Math.max(1, track.offsetHeight - stickyH);
      const holdPx = (HOLD_VH / 100) * window.innerHeight;
      const animRange = Math.max(1, totalRange - holdPx);
      const scrolled = clamp(-trackRect.top + navH, 0, totalRange);

      const p = scrolled <= animRange ? scrolled / animRange : 1;
      setProgress(p);
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateScrollProgress);
    };

    const enableScrollStory = () => {
      if (scrollReady) return;
      scrollReady = true;
      scene.classList.add("is-scrollReady");
      requestUpdate();
    };

    const goShine = () => {
      if (shineTimerId) {
        window.clearTimeout(shineTimerId);
        shineTimerId = 0;
      }
      section.classList.add("is-shine");
      enableScrollStory();
    };

    /** Text + dark always together */
    const reveal = (opts = {}) => {
      const { snap = false, enableScroll = false } = opts;

      if (timerId) {
        window.clearTimeout(timerId);
        timerId = 0;
      }
      if (shineTimerId) {
        window.clearTimeout(shineTimerId);
        shineTimerId = 0;
      }

      if (snap) {
        section.classList.add("is-nightSnap");
      }

      section.classList.add("is-reveal");
      section.classList.add("is-night");
      revealed = true;

      const shineDelay = snap ? 160 : SHINE_AT_MS;
      shineTimerId = window.setTimeout(goShine, shineDelay);

      if (enableScroll) {
        enableScrollStory();
        setProgress(0.08);
      }
    };

    const fastForwardHero = () => {
      if (userFastForwarded && section.classList.contains("is-night")) {
        enableScrollStory();
        return;
      }
      userFastForwarded = true;
      reveal({ snap: true, enableScroll: true });
    };

    const armTimer = () => {
      if (revealed || timerId) return;
      timerId = window.setTimeout(() => reveal(), REVEAL_AFTER_MS);
    };

    const tryPlay = () => {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.catch(() => {});
      }
    };

    video.addEventListener("playing", armTimer, { once: true });

    if (!video.paused && video.readyState >= 2) {
      armTimer();
    } else {
      tryPlay();
    }

    window.setTimeout(() => {
      if (!revealed) reveal();
    }, REVEAL_AFTER_MS + 4000);

    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 4) fastForwardHero();
        requestUpdate();
      },
      { passive: true }
    );
    window.addEventListener(
      "wheel",
      (e) => {
        if (e.deltaY > 0) fastForwardHero();
      },
      { passive: true }
    );
    window.addEventListener(
      "touchmove",
      () => {
        fastForwardHero();
      },
      { passive: true }
    );
    window.addEventListener(
      "keydown",
      (e) => {
        if (
          e.key === "PageDown" ||
          e.key === "ArrowDown" ||
          e.key === " " ||
          e.key === "Spacebar"
        ) {
          fastForwardHero();
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", requestUpdate, { passive: true });
    requestUpdate();

    document.addEventListener(
      "visibilitychange",
      () => {
        if (!document.hidden && video.paused) tryPlay();
      },
      { passive: true }
    );
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
