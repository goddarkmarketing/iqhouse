(() => {
  const main = document.getElementById("iqDetailMain");
  const thumbs = document.querySelectorAll(".iqDetail__thumb");

  if (main && thumbs.length) {
    thumbs.forEach((btn) => {
      btn.addEventListener("click", () => {
        const src = btn.getAttribute("data-src");
        if (!src) return;
        main.src = src;
        thumbs.forEach((t) => t.classList.remove("is-active"));
        btn.classList.add("is-active");
      });
    });
  }

  const copyText = async (url) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
      return;
    }
    const input = document.createElement("input");
    input.value = url;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
  };

  const copyBtn = document.querySelector(".iqShare__copy");
  if (copyBtn) {
    const label = copyBtn.querySelector(".iqShare__copyText");
    const defaultText = label ? label.textContent : "Copy link";

    copyBtn.addEventListener("click", async () => {
      const url = copyBtn.getAttribute("data-share-url") || window.location.href;
      try {
        await copyText(url);
        copyBtn.classList.add("is-copied");
        if (label) label.textContent = "Copied!";
        window.setTimeout(() => {
          copyBtn.classList.remove("is-copied");
          if (label) label.textContent = defaultText;
        }, 1800);
      } catch (err) {
        window.prompt("คัดลอกลิงก์นี้:", url);
      }
    });
  }

  // TikTok has no web share URL — use system share, else copy link then open TikTok
  const tiktokBtn = document.querySelector(".iqShare__btn--tiktok");
  if (tiktokBtn) {
    tiktokBtn.addEventListener("click", async (e) => {
      const url = tiktokBtn.getAttribute("data-share-url") || window.location.href;
      const title = tiktokBtn.getAttribute("data-share-title") || document.title;
      if (navigator.share) {
        e.preventDefault();
        try {
          await navigator.share({ title, text: title, url });
        } catch (err) {
          /* user cancelled */
        }
        return;
      }
      try {
        await copyText(url);
      } catch (err) {
        /* ignore */
      }
    });
  }
})();
