(() => {
  const boot = () => {
    const el = document.getElementById("iqPromiseSlider");
    if (!el || typeof Swiper === "undefined") return;

    const section = document.getElementById("iqPromise");
    const paginationEl = section
      ? section.querySelector(".iqPromise__pagination")
      : null;

    const swiper = new Swiper(el, {
      // Whole cards only — no half-card peek that clips shadow on the right
      slidesPerView: 1,
      spaceBetween: 0,
      grabCursor: true,
      speed: 650,
      watchOverflow: true,
      roundLengths: true,
      pagination: paginationEl
        ? {
            el: paginationEl,
            clickable: true,
          }
        : undefined,
      breakpoints: {
        520: { slidesPerView: 2, spaceBetween: 0 },
        768: { slidesPerView: 3, spaceBetween: 0 },
        1100: { slidesPerView: 4, spaceBetween: 0 },
      },
    });

    window.requestAnimationFrame(() => swiper.update());
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
