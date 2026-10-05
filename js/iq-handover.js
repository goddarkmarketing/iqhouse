(function () {
  function boot() {
    var el = document.getElementById("iqHandoverSlider");
    if (!el || typeof Swiper === "undefined") return;

    var swiper = new Swiper(el, {
      slidesPerView: 3.2,
      spaceBetween: 16,
      loop: true,
      speed: 7000,
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
        0: { slidesPerView: 2, spaceBetween: 10 },
        700: { slidesPerView: 2.05, spaceBetween: 14 },
        1100: { slidesPerView: 3.05, spaceBetween: 16 },
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
