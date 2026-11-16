(function () {
  function boot() {
    var el = document.getElementById("iqHandoverSlider");
    if (!el || typeof Swiper === "undefined") return;

    var swiper = new Swiper(el, {
      slidesPerView: 6.4,
      spaceBetween: 12,
      loop: true,
      speed: 9000,
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
      breakpoints: {
        0: { slidesPerView: 2.15, spaceBetween: 8 },
        700: { slidesPerView: 3.6, spaceBetween: 10 },
        1100: { slidesPerView: 5.2, spaceBetween: 12 },
        1400: { slidesPerView: 6.4, spaceBetween: 12 },
      },
    });

    el.addEventListener("mouseenter", function () {
      if (swiper.autoplay) swiper.autoplay.stop();
    });
    el.addEventListener("mouseleave", function () {
      if (swiper.autoplay) swiper.autoplay.start();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
