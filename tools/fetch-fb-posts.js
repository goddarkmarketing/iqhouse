const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const https = require("https");
const { URL } = require("url");

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "works", "images");
const DATA_OUT = path.join(ROOT, "works", "fetched.json");

const posts = [
  "https://www.facebook.com/share/p/17vKWnsFXX/",
  "https://www.facebook.com/share/p/18tv1DNgC1/",
  "https://www.facebook.com/share/p/1Ez2qE8Tuj/",
  "https://www.facebook.com/share/p/18J83SGsG7/",
  "https://www.facebook.com/share/p/1EJpdxPENQ/",
  "https://www.facebook.com/share/p/184MXASKm6/",
  "https://www.facebook.com/share/p/1Cf2HmwYf6/",
  "https://www.facebook.com/share/p/1DMCkrYjKn/",
  "https://www.facebook.com/share/p/1CACQsSypw/",
  "https://www.facebook.com/share/p/1D1ZYE7mvm/",
  "https://www.facebook.com/share/p/19jwNnsm6o/",
  "https://www.facebook.com/share/p/1cKAtV2JGV/",
];

function curl(args) {
  return execFileSync("curl.exe", args, {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
    timeout: 60000,
  });
}

function curlBinary(args) {
  return execFileSync("curl.exe", args, {
    maxBuffer: 20 * 1024 * 1024,
    timeout: 60000,
  });
}

function resolveCanonical(shareUrl) {
  const out = curl([
    "-sI",
    "-A",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0.0.0",
    "--max-time",
    "25",
    shareUrl,
  ]);
  const m = out.match(/location:\s*(.+)/i);
  if (!m) return shareUrl;
  let loc = m[1].trim();
  const u = new URL(loc, shareUrl);
  // strip tracking params
  u.searchParams.delete("__cft__[0]");
  u.searchParams.delete("__tn__");
  u.searchParams.delete("rdid");
  u.searchParams.delete("share_url");
  return u.href;
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
      .replace(/<[^>]+>/g, "")
  )
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function pickTitle(text) {
  if (!text) return "ผลงานไอคิวเฮ้าส์";
  const lines = text
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 6 && !s.startsWith("#") && !/^https?:/.test(s));
  let t = (lines[0] || text).replace(/\s+/g, " ").trim();
  t = t.replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\s]+/u, "").trim();
  if (t.length > 46) t = t.slice(0, 44).trim() + "…";
  return t || "ผลงานไอคิวเฮ้าส์";
}

function pickMeta(text) {
  const loc = text.match(/Location\s*:\s*([^\n]+)/i);
  if (loc) return loc[1].replace(/\s+/g, " ").trim();
  const bits = [];
  if (/ส่งมอบ/.test(text)) bits.push("ส่งมอบแล้ว");
  if (/เชียงราย/.test(text)) bits.push("เชียงราย");
  else if (/พะเยา/.test(text)) bits.push("พะเยา");
  if (bits.length) return bits.join(" · ");
  return "ไอคิวเฮ้าส์";
}

function extractImages(html) {
  let imgs = [...html.matchAll(/https:\\\/\\\/scontent\.[^"]+?p960x960[^"]+"/g)].map(
    (m) => m[0].replace(/\\\//g, "/").replace(/"$/, "").replace(/&amp;/g, "&")
  );
  if (!imgs.length) {
    imgs = [...html.matchAll(/https:\\\/\\\/scontent\.[^"]+_n\.jpg[^"]+"/g)]
      .map((m) =>
        m[0].replace(/\\\//g, "/").replace(/"$/, "").replace(/&amp;/g, "&")
      )
      .filter((u) => /t39\.30808-6/.test(u));
  }
  const seen = new Set();
  const unique = [];
  for (const u of imgs) {
    const id = (u.match(/\/(\d+_\d+_\d+_n\.jpg)/) || [])[1] || u;
    if (seen.has(id)) continue;
    seen.add(id);
    unique.push(u);
  }
  return unique;
}

function extractText(html) {
  const tm = html.match(
    /class="text_exposed_root"[\s\S]{0,120}?>([\s\S]{20,5000}?)(?:<\/div>\s*<div class="_3x-2"|<\/div><\/div><div class="_3x-2")/
  );
  if (tm) {
    return stripTags(tm[1])
      .replace(/ดูเพิ่มเติม[\s\S]*$/m, "")
      .trim();
  }
  const tm2 = html.match(/text_exposed_root[\s\S]{0,80}?>([\s\S]{20,3000}?)<\/div>/);
  if (tm2) {
    return stripTags(tm2[1])
      .replace(/ดูเพิ่มเติม[\s\S]*$/m, "")
      .trim();
  }
  return "";
}

function downloadCover(url, outPath) {
  const buf = curlBinary([
    "-sL",
    "-A",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0.0.0",
    "-H",
    "Referer: https://www.facebook.com/",
    "--max-time",
    "45",
    url,
  ]);
  if (buf.length > 2000 && buf[0] === 0xff && buf[1] === 0xd8) {
    fs.writeFileSync(outPath, buf);
    return buf.length;
  }
  return 0;
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const results = [];

  for (let i = 0; i < posts.length; i++) {
    const n = i + 1;
    const shareUrl = posts[i];
    console.log(`\n[${n}/12] ${shareUrl}`);
    try {
      const canonical = resolveCanonical(shareUrl);
      console.log("  canonical:", canonical.slice(0, 90) + "…");

      const embedUrl =
        "https://www.facebook.com/plugins/post.php?href=" +
        encodeURIComponent(canonical) +
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
      const imageUrls = extractImages(html);
      const title = pickTitle(text);
      const meta = pickMeta(text);
      console.log("  title:", title);
      console.log("  images:", imageUrls.length, "html:", html.length);

      const dir = path.join(OUT_DIR, String(n));
      fs.mkdirSync(dir, { recursive: true });
      const localImages = [];

      if (imageUrls[0]) {
        const out = path.join(dir, "cover.jpg");
        const size = downloadCover(imageUrls[0], out);
        if (size) {
          localImages.push(`images/${n}/cover.jpg`);
          console.log("  cover:", size, "bytes");
        } else {
          console.log("  cover download failed");
        }
      }

      // fallback reuse known local images for post we already had
      if (!localImages.length && shareUrl.includes("1Ez2qE8Tuj")) {
        const fb = path.join(OUT_DIR, "2", "img-01.jpg");
        if (fs.existsSync(fb)) {
          fs.copyFileSync(fb, path.join(dir, "cover.jpg"));
          localImages.push(`images/${n}/cover.jpg`);
          console.log("  reused previous cover");
        }
      }

      results.push({
        id: n,
        title,
        meta,
        summary: text.slice(0, 320),
        facebook: shareUrl,
        canonical,
        images: localImages,
      });
    } catch (e) {
      console.log("  FAIL", e.message);
      results.push({
        id: n,
        title: `ผลงานไอคิวเฮ้าส์ ${n}`,
        meta: "ไอคิวเฮ้าส์",
        summary: "",
        facebook: shareUrl,
        canonical: shareUrl,
        images: [],
        error: String(e.message || e),
      });
    }
  }

  fs.writeFileSync(DATA_OUT, JSON.stringify(results, null, 2), "utf8");
  console.log("\nWrote", DATA_OUT);
}

main();
