const fs = require("fs");
const { execFileSync } = require("child_process");
const path = require("path");

const fetched = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "works", "fetched.json"), "utf8")
);

function curl(args) {
  return execFileSync("curl.exe", args, {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
    timeout: 60000,
  });
}

function decodeHtml(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) =>
      String.fromCodePoint(parseInt(h, 16))
    )
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
}

function stripTags(html) {
  return decodeHtml(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/[ \t]+/g, " ")
    .replace(/\n+/g, "\n")
    .trim();
}

function extractText(html) {
  // Prefer text_exposed_root block
  let m = html.match(
    /id="[^"]+"[^>]*class="[^"]*text_exposed_root[^"]*"[^>]*>([\s\S]*?)<\/div>/i
  );
  if (!m) {
    m = html.match(/class="[^"]*text_exposed_root[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  }
  if (m) {
    return stripTags(m[1])
      .replace(/\s*ดูเพิ่มเติม[\s\S]*$/i, "")
      .trim();
  }

  // Fallback: first substantial Thai paragraph-ish chunk near gift emoji / ส่งมอบ
  m = html.match(/>([^<]*(?:ส่งมอบ|บ้าน|Owner|Location|เชียงราย|พะเยา)[^<]{8,200})</);
  if (m) return stripTags(m[1]);

  return "";
}

function pickTitle(text, n) {
  if (!text) return `ผลงานไอคิวเฮ้าส์ ${n}`;
  const lines = text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => !s.startsWith("#") && s.length > 4);
  let t = lines[0] || text;
  t = t.replace(/\s+/g, " ").trim();
  t = t.replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\s]+/u, "").trim();
  // Prefer line with ส่งมอบ / บ้าน
  const prefer = lines.find((s) => /ส่งมอบ|บ้าน|รีวิว|Owner/.test(s));
  if (prefer) t = prefer.replace(/\s+/g, " ").trim().replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\s]+/u, "").trim();
  if (t.length > 48) t = t.slice(0, 46).trim() + "…";
  return t || `ผลงานไอคิวเฮ้าส์ ${n}`;
}

function pickMeta(text) {
  const loc = text.match(/Location\s*:\s*([^\n#]+)/i);
  if (loc) return loc[1].replace(/\s+/g, " ").trim().slice(0, 60);
  const bits = [];
  if (/ส่งมอบ/.test(text)) bits.push("ส่งมอบแล้ว");
  if (/เชียงราย/.test(text)) bits.push("เชียงราย");
  if (/พะเยา/.test(text) && !bits.includes("เชียงราย")) bits.push("พะเยา");
  return bits.length ? bits.join(" · ") : "ไอคิวเฮ้าส์";
}

for (const item of fetched) {
  const embedUrl =
    "https://www.facebook.com/plugins/post.php?href=" +
    encodeURIComponent(item.canonical) +
    "&show_text=true&width=500";
  const html = curl([
    "-sL",
    "-A",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0.0.0",
    "--max-time",
    "35",
    embedUrl,
  ]);
  const text = extractText(html);
  item.summary = text.slice(0, 320);
  item.title = pickTitle(text, item.id);
  item.meta = pickMeta(text);
  console.log(item.id, item.title, "|", item.meta, "| textLen", text.length);
  // save first post chunk for debug
  if (item.id === 1) {
    const idx = html.indexOf("text_exposed");
    fs.writeFileSync(
      path.join(__dirname, "..", "works", "debug-text.html"),
      idx >= 0 ? html.slice(idx, idx + 3000) : html.slice(0, 2000)
    );
  }
}

fs.writeFileSync(
  path.join(__dirname, "..", "works", "fetched.json"),
  JSON.stringify(fetched, null, 2),
  "utf8"
);
console.log("updated fetched.json");
