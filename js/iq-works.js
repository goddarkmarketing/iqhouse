(() => {
  const boot = () => {
    const el = document.getElementById("iqWorksSlider");
    if (!el || typeof Swiper === "undefined") return;

    const swiper = new Swiper(el, {
      slidesPerView: 5.4,
      spaceBetween: 16,
      loop: true,
      speed: 8000,
      allowTouchMove: true,
      grabCursor: true,
      freeMode: {
        enabled: true,
        momentum: false,
      },
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      navigation: {
        nextEl: el.querySelector(".iqWorks__next"),
        prevEl: el.querySelector(".iqWorks__prev"),
      },
      breakpoints: {
        0: { slidesPerView: 1.2, spaceBetween: 12 },
        700: { slidesPerView: 2.15, spaceBetween: 14 },
        1100: { slidesPerView: 3.2, spaceBetween: 16 },
        1400: { slidesPerView: 4.4, spaceBetween: 16 },
      },
    });

    el.addEventListener("mouseenter", () => {
      if (swiper.autoplay) swiper.autoplay.stop();
    });
    el.addEventListener("mouseleave", () => {
      if (swiper.autoplay) swiper.autoplay.start();
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
