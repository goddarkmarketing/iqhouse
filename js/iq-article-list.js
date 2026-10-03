(function () {
  var root = document.querySelector("[data-iq-article-board]");
  if (!root) return;

  var form = root.querySelector("form");
  var query = root.querySelector("[data-iq-article-query]");
  var category = root.querySelector("[data-iq-article-cat]");
  var cards = Array.from(root.querySelectorAll("[data-iq-card]"));
  var filters = Array.from(root.querySelectorAll("[data-iq-article-filter]"));
  var clearBtn = root.querySelector("[data-iq-article-clear]");
  var count = root.querySelector("[data-iq-article-count]");
  var empty = root.querySelector("[data-iq-article-empty]");
  var selected = new Set();

  function active() {
    return query.value.trim() !== "" || category.value !== "" || selected.size > 0;
  }

  function apply() {
    var q = query.value.trim().toLowerCase();
    var cat = category.value;
    var shown = 0;

    cards.forEach(function (card) {
      var text = (card.getAttribute("data-iq-text") || "").toLowerCase();
      var tags = (card.getAttribute("data-iq-tags") || "").split("|");
      var matchQuery = !q || text.indexOf(q) !== -1;
      var matchCat = !cat || card.getAttribute("data-iq-cat") === cat;
      var matchTag = selected.size === 0 || tags.some(function (tag) {
        return selected.has(tag);
      });
      var show = matchQuery && matchCat && matchTag;
      card.hidden = !show;
      if (show) shown += 1;
    });

    if (!active()) {
      count.textContent = "บทความทั้งหมด " + cards.length + " เรื่อง";
    } else {
      count.textContent = "พบ " + shown + " บทความ";
    }
    empty.hidden = shown !== 0;
    clearBtn.disabled = !active();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });
  query.addEventListener("input", apply);
  category.addEventListener("change", apply);
  filters.forEach(function (button) {
    button.addEventListener("click", function () {
      var key = button.getAttribute("data-iq-article-filter");
      if (selected.has(key)) selected.delete(key);
      else selected.add(key);
      var on = selected.has(key);
      button.classList.toggle("is-on", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
      apply();
    });
  });
  clearBtn.addEventListener("click", function () {
    query.value = "";
    category.value = "";
    selected.clear();
    filters.forEach(function (button) {
      button.classList.remove("is-on");
      button.setAttribute("aria-pressed", "false");
    });
    apply();
  });
})();
