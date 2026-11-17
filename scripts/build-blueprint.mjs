// Builds the free guide from scripts/blueprint/pages.mjs:
//   public/the-business-growth-blueprint.pdf   the file people download
//   public/blueprint/*.jpg                     real pages, shown on the opt-in page
//
// Run:  node scripts/build-blueprint.mjs
// Needs Playwright with Chromium (npx playwright install chromium) and a
// network connection the first time, for the fonts.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { pages } from "./blueprint/pages.mjs";

const { chromium } = createRequire(import.meta.url)("playwright");
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(join(root, "scripts/blueprint/guide.css"), "utf8");
const logo = "data:image/png;base64," + readFileSync(join(root, "public/logo.png")).toString("base64");
const total = pages.length;
const pad = (n) => String(n).padStart(2, "0");

const body = pages
  .map((p, i) => {
    const chrome = p.bare || p.cls === "opener"
      ? p.cls === "opener"
        ? `<div class="folio"><span>The Business Growth Blueprint</span><b>${pad(i + 1)} / ${pad(total)}</b></div>`
        : ""
      : `<div class="run"><span>The Business Growth Blueprint</span><span>SYNERGOX</span></div>
         <div class="folio"><span>synergox.co</span><b>${pad(i + 1)} / ${pad(total)}</b></div>`;
    return `<section class="page ${p.cls ?? ""}" id="p${i + 1}">${p.html.replaceAll("LOGO_SRC", logo)}${chrome}</section>`;
  })
  .join("\n");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>The Business Growth Blueprint — SYNERGOX</title>
<meta name="author" content="SYNERGOX">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:ital,wght@0,400..600;1,400&family=Instrument+Serif:ital@1&display=block" rel="stylesheet">
<style>${css}</style></head><body>${body}</body></html>`;

const out = join(root, "public");
mkdirSync(join(out, "blueprint"), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 1.5 });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

// Any page whose content runs past its edge is a layout bug: fail loudly.
const overflow = await page.evaluate(() =>
  [...document.querySelectorAll(".page")]
    .map((el, i) => {
      const limit = el.getBoundingClientRect().bottom - (el.querySelector(".folio") ? 62 : 0);
      const last = [...el.children].filter((c) => !c.matches(".run,.folio,.no,svg.sys")).pop();
      return last && last.getBoundingClientRect().bottom > limit + 1 ? i + 1 : null;
    })
    .filter(Boolean)
);
if (overflow.length) console.warn("⚠ content overflows on page(s):", overflow.join(", "));

await page.pdf({ path: join(out, "the-business-growth-blueprint.pdf"), format: "A4", printBackground: true, preferCSSPageSize: true });

// Pages shown as previews on the site.
const previews = { cover: 1, "page-05": 5, "page-09": 9, "page-12": 12, "page-15": 15, "page-18": 18, "page-20": 20 };
for (const [name, n] of Object.entries(previews)) {
  await page.locator(`#p${n}`).screenshot({ path: join(out, "blueprint", `${name}.jpg`), type: "jpeg", quality: 82 });
}
if (process.argv.includes("--all")) {
  mkdirSync(join(root, ".blueprint-proof"), { recursive: true });
  for (let i = 1; i <= total; i++) await page.locator(`#p${i}`).screenshot({ path: join(root, ".blueprint-proof", `p${pad(i)}.jpg`), type: "jpeg", quality: 60 });
}
await browser.close();
writeFileSync(join(out, "blueprint", "meta.json"), JSON.stringify({ pages: total }, null, 2) + "\n");
console.log(`Built ${total} pages.`);
