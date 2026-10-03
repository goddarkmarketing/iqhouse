(() => {
  const boot = () => {
    const el = document.getElementById("iqCoverSlider");
    if (!el || typeof Swiper === "undefined") return;

    const paginationEl = document.querySelector("#iqCover .iqCover__pagination");

    new Swiper(el, {
      effect: "fade",
      fadeEffect: { crossFade: true },
      loop: true,
      speed: 1200,
      allowTouchMove: true,
      autoplay: {
        delay: 4200,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: paginationEl
        ? {
            el: paginationEl,
            clickable: true,
          }
        : undefined,
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
