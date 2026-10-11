import { mkdir } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

// QA-only script: preview URL and browser path never enter deployable source.
const { chromium } = await import(pathToFileURL(process.argv[3]).href);
const browser = await chromium.launch({ executablePath: process.argv[4], headless: true });
await mkdir(new URL("./review/", import.meta.url), { recursive: true });
try {
  for (const [name, width, height] of [["desktop", 1440, 900], ["mobile", 390, 844], ["review-window", 610, 604], ["short-desktop", 936, 604], ["small-mobile", 360, 640]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(process.argv[2], { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const layout = await page.evaluate(() => {
      const folder = document.querySelector(".main-folder").getBoundingClientRect();
      const caption = document.querySelector(".folder-caption").getBoundingClientRect();
      const hint = document.querySelector(".swipe-note").getBoundingClientRect();
      const footer = document.querySelector(".canvas-footer").getBoundingClientRect();
      return {
      folders: document.querySelectorAll(".folder-illustration").length,
      overflow: document.documentElement.scrollWidth > innerWidth,
      title: document.querySelector("h1").innerText,
      identityFont: getComputedStyle(document.querySelector(".identity")).fontFamily,
      captionFont: getComputedStyle(document.querySelector(".folder-caption")).fontFamily,
      stickerFontLoaded: document.fonts.check('800 36px "Bricolage Grotesque"', "my cv"),
      fonts: Object.fromEntries(["Space Mono", "Space Grotesk", "Bricolage Grotesque"].map((family) => [family, [...document.fonts].filter((face) => face.family.replaceAll('"', "") === family && face.status === "loaded").length])),
      monoApplied: getComputedStyle(document.querySelector(".identity")).fontFamily.includes("Space Mono") && getComputedStyle(document.querySelector(".folder-caption > span")).fontFamily.includes("Space Mono"),
      groteskApplied: getComputedStyle(document.querySelector(".folder-caption p")).fontFamily.includes("Space Grotesk"),
      stickerFont: getComputedStyle(document.querySelector(".title-sticker")).fontFamily,
      captionClear: caption.top >= folder.bottom,
      hintClear: hint.top >= caption.bottom,
      bottomVisible: hint.bottom <= innerHeight && footer.bottom <= innerHeight,
      gapToHint: Math.round(hint.top - caption.bottom),
    }; });
    if (errors.length || layout.overflow || layout.folders !== 6 || !layout.captionClear || !layout.hintClear || !layout.bottomVisible || !layout.monoApplied || !layout.groteskApplied || !layout.stickerFontLoaded || Object.values(layout.fonts).some((count) => count === 0)) throw new Error(JSON.stringify({ errors, layout }));
    await page.screenshot({ path: fileURLToPath(new URL(`./review/${name}.png`, import.meta.url)), fullPage: true });
    console.log(JSON.stringify({ name, ...layout, errors }));
    await page.close();
  }
} finally { await browser.close(); }
