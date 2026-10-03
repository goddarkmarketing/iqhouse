(function () {
  function prefix() {
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].src || "";
      if (src.indexOf("iq-footer.js") !== -1) {
        return src.replace(/js\/iq-footer\.js.*$/, "");
      }
    }
    return "";
  }

  var base = prefix();
  var html =
    '<footer class="iqFooter" id="iqFooter">' +
    '<div class="iqFooter__wrap">' +
    '<div class="iqFooter__grid">' +
    '<div class="iqFooter__col">' +
    '<div class="iqFooter__brand">' +
    '<img src="' + base + 'images/iqhouse-logo.png" alt="IQ HOUSE" width="52" height="52">' +
    "<div><strong>ไอคิวเฮ้าส์</strong><span>รับสร้างบ้านคุณภาพ เชียงราย พะเยา</span></div>" +
    "</div>" +
    '<p class="iqFooter__text">บริษัท ไอคิว เฮ้าส์ จำกัด ดูแลครบวงจรตั้งแต่ออกแบบ ก่อสร้าง ควบคุมงาน จนส่งมอบบ้าน</p>' +
    "</div>" +
    '<div class="iqFooter__col">' +
    "<h3>เมนูหลัก</h3>" +
    "<ul>" +
    '<li><a href="' + base + 'index.html">หน้าแรก</a></li>' +
    '<li><a href="' + base + 'portfolio.html">ผลงาน</a></li>' +
    '<li><a href="' + base + 'designs.html">แบบบ้าน</a></li>' +
    '<li><a href="' + base + 'articles.html">บทความ</a></li>' +
    "</ul>" +
    "</div>" +
    '<div class="iqFooter__col">' +
    "<h3>ข้อมูลบริษัท</h3>" +
    "<ul>" +
    '<li><a href="' + base + 'about.html">เกี่ยวกับเรา</a></li>' +
    '<li><a href="' + base + 'reviews.html">รีวิวลูกค้า</a></li>' +
    '<li><a href="' + base + 'contact.html">ติดต่อเรา</a></li>' +
    "</ul>" +
    "</div>" +
    '<div class="iqFooter__col iqFooter__contact">' +
    "<h3>ติดต่อเรา</h3>" +
    "<ul>" +
    '<li><a href="tel:0614086999">โทร 061-408-6999</a></li>' +
    "<li>207 หมู่ 19 ถ.บายพาสทิศตะวันออก (สนามบิน)<br>ต.บ้านดู่ อ.เมืองเชียงราย จ.เชียงราย 57100</li>" +
    '<li><a class="iqFooter__iconLink" href="https://www.facebook.com/profile.php?id=100057537335184" target="_blank" rel="noopener"><img src="' + base + 'images/site/icons/facebook.svg" alt="" width="16" height="16">Facebook IQ HOUSE</a></li>' +
    '<li><a class="iqFooter__iconLink" href="https://www.tiktok.com/@iqhouse.official" target="_blank" rel="noopener"><img src="' + base + 'images/site/icons/tiktok.svg" alt="" width="16" height="16">TikTok @iqhouse.official</a></li>' +
    "</ul>" +
    "</div>" +
    "</div>" +
    '<div class="iqFooter__bottom">' +
    '<address class="iqFooter__copy">Copyright &copy; IQ HOUSE. All rights reserved.</address>' +
    "</div>" +
    "</div>" +
    "</footer>";

  var icon = function (name) {
    return '<img src="' + base + "images/site/icons/" + name + '.svg" alt="" width="18" height="18">';
  };
  var floatHtml =
    '<div class="iqFloat">' +
    '<div class="iqFloat__menu">' +
    '<a class="iqFloat__btn iqFloat__btn--facebook" href="https://www.facebook.com/profile.php?id=100057537335184" target="_blank" rel="noopener" aria-label="Facebook">' + icon("facebook") + "</a>" +
    '<a class="iqFloat__btn iqFloat__btn--tiktok" href="https://www.tiktok.com/@iqhouse.official" target="_blank" rel="noopener" aria-label="TikTok">' + icon("tiktok") + "</a>" +
    '<a class="iqFloat__btn iqFloat__btn--line" href="' + base + 'contact.html" aria-label="LINE">' + icon("line") + "</a>" +
    '<a class="iqFloat__btn iqFloat__btn--tel" href="tel:0614086999" aria-label="โทร 061-408-6999">' + icon("phone") + "</a>" +
    '<a class="iqFloat__btn iqFloat__btn--email" href="' + base + 'contact.html" aria-label="อีเมล">' + icon("email") + "</a>" +
    "</div>" +
    '<button type="button" class="iqFloat__toggle" aria-expanded="false" aria-label="เปิดช่องทางติดต่อ">' +
    '<svg class="iqFloat__open" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>' +
    '<svg class="iqFloat__close" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
    "</button></div>";

  function bindFloat() {
    var float = document.querySelector(".iqFloat");
    if (!float) return;
    var toggle = float.querySelector(".iqFloat__toggle");
    function setOpen(open) {
      float.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "ปิดช่องทางติดต่อ" : "เปิดช่องทางติดต่อ");
    }
    toggle.addEventListener("click", function () {
      setOpen(!float.classList.contains("is-open"));
    });
    if (!document.documentElement.getAttribute("data-iq-float")) {
      document.documentElement.setAttribute("data-iq-float", "1");
      document.addEventListener("click", function (event) {
        var current = document.querySelector(".iqFloat");
        if (!current || current.contains(event.target)) return;
        current.classList.remove("is-open");
        var button = current.querySelector(".iqFloat__toggle");
        if (!button) return;
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "เปิดช่องทางติดต่อ");
      });
      document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") return;
        var current = document.querySelector(".iqFloat");
        if (!current) return;
        current.classList.remove("is-open");
        var button = current.querySelector(".iqFloat__toggle");
        if (!button) return;
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "เปิดช่องทางติดต่อ");
      });
    }
  }

  function mount() {
    var old = document.getElementById("nFooter");
    if (old) old.remove();
    var existing = document.getElementById("iqFooter");
    if (existing) existing.remove();
    var slot = document.querySelector("[data-iq-footer]");
    if (slot) slot.outerHTML = html;
    else document.body.insertAdjacentHTML("beforeend", html);

    var oldFloat = document.querySelector(".iqFloat");
    if (oldFloat) oldFloat.remove();
    document.body.insertAdjacentHTML("beforeend", floatHtml);
    bindFloat();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
