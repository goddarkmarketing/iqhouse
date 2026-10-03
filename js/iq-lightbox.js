(function () {
  var items = Array.prototype.slice.call(
    document.querySelectorAll(".iqGallery__item img, .iqReviewCard img, .iqDesignCard__media img")
  );
  if (!items.length) return;

  var overlay = document.createElement("div");
  overlay.className = "iqLightbox";
  overlay.hidden = true;
  overlay.innerHTML =
    '<button type="button" class="iqLightbox__close" aria-label="ปิด">×</button>' +
    '<button type="button" class="iqLightbox__nav iqLightbox__prev" aria-label="ก่อนหน้า">‹</button>' +
    '<img class="iqLightbox__img" alt="">' +
    '<button type="button" class="iqLightbox__nav iqLightbox__next" aria-label="ถัดไป">›</button>';
  document.body.appendChild(overlay);

  var imgEl = overlay.querySelector(".iqLightbox__img");
  var index = 0;

  function visibleItems() {
    return items.filter(function (img) {
      return !img.closest("[hidden]");
    });
  }

  function show(i) {
    var list = visibleItems();
    if (!list.length) return;
    index = (i + list.length) % list.length;
    var src = list[index].currentSrc || list[index].src;
    imgEl.src = src;
    imgEl.alt = list[index].alt || "";
    overlay.hidden = false;
    document.body.classList.add("iqLightbox-open");
  }

  function hide() {
    overlay.hidden = true;
    document.body.classList.remove("iqLightbox-open");
    imgEl.removeAttribute("src");
  }

  items.forEach(function (img, i) {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", function () {
      var list = visibleItems();
      var pos = list.indexOf(img);
      show(pos < 0 ? i : pos);
    });
  });

  overlay.querySelector(".iqLightbox__close").addEventListener("click", hide);
  overlay.querySelector(".iqLightbox__prev").addEventListener("click", function (e) {
    e.stopPropagation();
    show(index - 1);
  });
  overlay.querySelector(".iqLightbox__next").addEventListener("click", function (e) {
    e.stopPropagation();
    show(index + 1);
  });
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) hide();
  });
  document.addEventListener("keydown", function (e) {
    if (overlay.hidden) return;
    if (e.key === "Escape") hide();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
})();
