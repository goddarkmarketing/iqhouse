const fs = require("fs");
const path = require("path");

const fetched = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "works", "fetched.json"), "utf8")
);

function cleanTitle(t) {
  return t
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .replace(/\s+/g, " ")
    .replace(/\s*[…]\s*$/, "")
    .trim()
    .replace(/ค่ะ!?$/, "")
    .replace(/กันค่ะ$/, "")
    .replace(/️/g, "")
    .trim();
}

const works = {};
for (const item of fetched) {
  const title = cleanTitle(item.title) || `ผลงานไอคิวเฮ้าส์ ${item.id}`;
  const cover = item.images[0] || "";
  works[item.id] = {
    title,
    location: item.meta || "ไอคิวเฮ้าส์",
    status: /ส่งมอบ/.test(item.title + item.summary) ? "ส่งมอบแล้ว" : "อัปเดตงาน",
    type: /2 ชั้น|สองชั้น/.test(item.title + item.summary)
      ? "บ้านสองชั้น"
      : "บ้านชั้นเดียว",
    area: "ตามแบบ",
    style: "ไอคิวเฮ้าส์",
    summary: (item.summary || "").slice(0, 280),
    details: [],
    tags: ["ไอคิวเฮ้าส์", "รับสร้างบ้านเชียงราย"],
    images: cover ? [cover] : [],
    facebook: item.facebook,
  };
}

function phpString(s) {
  return "'" + String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
}

let php = "<?php\n/**\n * ผลงานจากโพสต์ Facebook — กดการ์ดแล้วเด้งไปโพสต์ต้นฉบับ\n */\n$works = [\n";
for (const id of Object.keys(works)) {
  const w = works[id];
  php += `  ${id} => [\n`;
  php += `    'title' => ${phpString(w.title)},\n`;
  php += `    'location' => ${phpString(w.location)},\n`;
  php += `    'status' => ${phpString(w.status)},\n`;
  php += `    'type' => ${phpString(w.type)},\n`;
  php += `    'area' => ${phpString(w.area)},\n`;
  php += `    'style' => ${phpString(w.style)},\n`;
  php += `    'summary' => ${phpString(w.summary)},\n`;
  php += `    'details' => [],\n`;
  php += `    'tags' => ['ไอคิวเฮ้าส์', 'รับสร้างบ้านเชียงราย'],\n`;
  php += `    'images' => [${w.images.map(phpString).join(", ")}],\n`;
  php += `    'facebook' => ${phpString(w.facebook)},\n`;
  php += `  ],\n`;
}
php += "];\n";

fs.writeFileSync(path.join(__dirname, "..", "works", "data.php"), php, "utf8");

// Build HTML cards fragment
let cards = "";
for (const id of Object.keys(works)) {
  const w = works[id];
  const img = w.images[0]
    ? `works/${w.images[0]}`
    : "images/iqhouse-logo.png";
  const meta = [w.location, w.status].filter(Boolean).join(" · ");
  cards += `      <article class="iqWorks__card swiper-slide">
        <a class="iqWorks__link fnFade" href="${w.facebook.replace(/"/g, "&quot;")}" target="_blank" rel="noopener">
          <div class="iqWorks__media">
            <img class="fnChangeImg" src="${img}" alt="${w.title.replace(/"/g, "&quot;")} ไอคิวเฮ้าส์" loading="lazy">
            <div class="iqWorks__caption">
              <h3 class="iqWorks__name">${w.title.replace(/</g, "&lt;")}</h3>
              <p class="iqWorks__meta">${meta.replace(/</g, "&lt;")}</p>
            </div>
          </div>
        </a>
      </article>\n\n`;
}

fs.writeFileSync(
  path.join(__dirname, "..", "works", "cards.fragment.html"),
  cards,
  "utf8"
);
console.log("Wrote data.php and cards.fragment.html");
for (const id of Object.keys(works)) {
  console.log(id, works[id].title, "->", works[id].images[0] || "(no img)");
}
