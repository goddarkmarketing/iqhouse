(() => {
  document.querySelectorAll("[data-iq-share]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const kind = btn.getAttribute("data-iq-share");
      const url = encodeURIComponent(location.href);
      const links = {
        line: `https://social-plugins.line.me/lineit/share?url=${url}`,
        tiktok: "https://www.tiktok.com/@iqhouse.official",
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      };
      if (kind === "copy") {
        try {
          await navigator.clipboard.writeText(location.href);
        } catch {
          const field = document.createElement("textarea");
          field.value = location.href;
          document.body.appendChild(field);
          field.select();
          document.execCommand("copy");
          field.remove();
        }
        const label = btn.querySelector("span");
        if (label) label.textContent = "Copied";
        btn.classList.add("is-done");
        window.setTimeout(() => {
          if (label) label.textContent = "Copy link";
          btn.classList.remove("is-done");
        }, 1600);
        return;
      }
      if (links[kind]) window.open(links[kind], "_blank", "noopener,noreferrer,width=640,height=560");
    });
  });

  const input = document.querySelector("[data-iq-article-search]");
  const items = Array.from(document.querySelectorAll("[data-iq-article-item]"));
  const list = document.querySelector("[data-iq-article-list]");
  if (!input || !list || !items.length) return;

  let empty = list.querySelector(".iqArticleCats__empty");
  if (!empty) {
    empty = document.createElement("p");
    empty.className = "iqArticleCats__empty";
    empty.hidden = true;
    empty.textContent = "ไม่พบบทความ";
    list.appendChild(empty);
  }

  const apply = () => {
    const q = input.value.trim().toLowerCase();
    let shown = 0;
    items.forEach((item) => {
      const text = (item.getAttribute("data-iq-article-text") || item.textContent || "").toLowerCase();
      const match = !q || text.includes(q);
      const node = item.closest("li") || item;
      node.hidden = !match;
      if (match) shown += 1;
    });
    empty.hidden = shown > 0;
  };

  input.addEventListener("input", apply);
  input.form?.addEventListener("submit", (event) => {
    event.preventDefault();
    apply();
  });

  document.querySelectorAll("[data-iq-article-tag]").forEach((tag) => {
    tag.addEventListener("click", () => {
      const word = (tag.getAttribute("data-iq-article-tag") || tag.textContent || "").replace(/^#/, "").trim();
      const on = input.value.trim() === word;
      input.value = on ? "" : word;
      document.querySelectorAll("[data-iq-article-tag]").forEach((el) => {
        el.classList.toggle("is-on", el === tag && !on);
      });
      apply();
    });
  });
})();
