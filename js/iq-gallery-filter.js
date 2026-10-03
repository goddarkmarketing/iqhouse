(function () {
  var root = document.querySelector(".iqFilters");
  if (!root) return;

  var buttons = root.querySelectorAll("[data-filter]");
  var items = document.querySelectorAll(".iqGallery__item[data-cat]");
  if (!buttons.length || !items.length) return;

  function apply(filter) {
    items.forEach(function (item) {
      var show = filter === "all" || item.getAttribute("data-cat") === filter;
      item.hidden = !show;
    });
    buttons.forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-filter") === filter);
    });
  }

  root.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-filter]");
    if (!btn || !root.contains(btn)) return;
    apply(btn.getAttribute("data-filter"));
  });
})();
