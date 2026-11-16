(function () {
  function boot() {
    var el = document.getElementById("iqHandoverSlider");
    if (!el || typeof Swiper === "undefined") return;

    var desktop = window.matchMedia("(min-width: 700px)");
    var swiper;

    function mount() {
      if (swiper) {
        swiper.destroy(true, true);
        swiper = null;
      }

      if (desktop.matches) {
        swiper = new Swiper(el, {
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
            700: { slidesPerView: 3.6, spaceBetween: 10 },
            1100: { slidesPerView: 5.2, spaceBetween: 12 },
            1400: { slidesPerView: 6.4, spaceBetween: 12 },
          },
        });
        return;
      }

      swiper = new Swiper(el, {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        speed: 650,
        allowTouchMove: true,
        grabCursor: true,
        autoplay: {
          delay: 2800,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        pagination: {
          el: el.querySelector(".iqHandover__dots"),
          clickable: true,
        },
      });
    }

    mount();
    desktop.addEventListener("change", mount);

    el.addEventListener("mouseenter", function () {
      if (swiper && swiper.autoplay) swiper.autoplay.stop();
    });
    el.addEventListener("mouseleave", function () {
      if (swiper && swiper.autoplay) swiper.autoplay.start();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
