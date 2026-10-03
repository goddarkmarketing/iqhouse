(function () {
  var root = document.querySelector("[data-iq-design-board]");
  if (!root) return;

  var form = root.querySelector("form");
  var query = root.querySelector("[data-iq-design-query]");
  var cards = Array.from(root.querySelectorAll("[data-iq-design]"));
  var catButtons = Array.from(root.querySelectorAll("[data-iq-design-cat]"));
  var clearBtn = root.querySelector("[data-iq-design-clear]");
  var count = root.querySelector("[data-iq-design-count]");
  var empty = root.querySelector("[data-iq-design-empty]");
  var category = "";

  function setCounts() {
    var totals = { "": cards.length };
    cards.forEach(function (card) {
      var cat = card.getAttribute("data-cat") || "";
      totals[cat] = (totals[cat] || 0) + 1;
    });
    catButtons.forEach(function (button) {
      var key = button.getAttribute("data-iq-design-cat") || "";
      var badge = button.querySelector("span");
      if (badge) badge.textContent = String(totals[key] || 0);
    });
  }

  function active() {
    return query.value.trim() !== "" || category !== "";
  }

  function apply() {
    var q = query.value.trim().toLowerCase();
    var shown = 0;
    cards.forEach(function (card) {
      var text = (card.getAttribute("data-iq-text") || "").toLowerCase();
      var matchQuery = !q || text.indexOf(q) !== -1;
      var matchCat = !category || card.getAttribute("data-cat") === category;
      var show = matchQuery && matchCat;
      card.hidden = !show;
      if (show) shown += 1;
    });
    count.textContent = active()
      ? "พบ " + shown + " แบบ"
      : "แบบบ้านทั้งหมด " + cards.length + " แบบ";
    empty.hidden = shown !== 0;
    clearBtn.disabled = !active();
    catButtons.forEach(function (button) {
      var on = (button.getAttribute("data-iq-design-cat") || "") === category;
      button.classList.toggle("is-on", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });
  query.addEventListener("input", apply);
  catButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      category = button.getAttribute("data-iq-design-cat") || "";
      apply();
    });
  });
  clearBtn.addEventListener("click", function () {
    query.value = "";
    category = "";
    apply();
  });

  setCounts();
  apply();
})();
