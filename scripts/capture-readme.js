const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright");

async function screenshotTopSection(page, selector, outputPath, maxHeight) {
  const locator = page.locator(selector);
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();

  if (!box) {
    throw new Error(`Missing bounding box for ${selector}`);
  }

  await page.screenshot({
    path: outputPath,
    clip: {
      x: Math.max(0, Math.floor(box.x)),
      y: Math.max(0, Math.floor(box.y)),
      width: Math.floor(box.width),
      height: Math.floor(Math.min(box.height, maxHeight)),
    },
  });
}

async function capture() {
  const rootDir = path.resolve(__dirname, "..");
  const outputDir = path.join(rootDir, "assets", "readme");
  fs.mkdirSync(outputDir, { recursive: true });

  console.log("launch browser");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1800 },
    deviceScaleFactor: 2,
  });
  page.setDefaultTimeout(15000);

  const appUrl = `file://${path.join(rootDir, "index.html")}`;
  console.log(`goto ${appUrl}`);
  await page.goto(appUrl, { waitUntil: "load" });
  await page.waitForSelector("#menu-input-panel");
  console.log("page ready");

  await page.evaluate(() => {
    const setValue = (id, value) => {
      const element = document.getElementById(id);
      if (!element) {
        throw new Error(`Missing element: ${id}`);
      }
      element.value = value;
      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.dispatchEvent(new Event("change", { bubbles: true }));
    };

    setValue("pyeong-input", "33");
    setValue("quote-total", "8470");
    setValue("unit-price-창호", "185000");
    setValue("unit-price-도배", "65000");
    setValue("unit-price-마루/장판", "115000");
  });
  console.log("calculator values filled");

  await screenshotTopSection(
    page,
    "#menu-input-panel",
    path.join(outputDir, "screen-calculator.png"),
    2600
  );
  console.log("saved calculator");

  await page.click("#menu-omission-tab");
  await page.locator("#menu-omission-panel").waitFor({ state: "visible" });
  await screenshotTopSection(
    page,
    "#menu-omission-panel",
    path.join(outputDir, "screen-checklist.png"),
    2400
  );
  console.log("saved checklist");

  await page.click("#menu-ai-tab");
  await page.locator("#menu-ai-panel").waitFor({ state: "visible" });
  await page.click("#demo-btn");
  await page.waitForTimeout(8000);
  await screenshotTopSection(
    page,
    "#menu-ai-panel",
    path.join(outputDir, "screen-ai.png"),
    2200
  );
  console.log("saved ai");

  await browser.close();
  console.log("done");
}

capture().catch((error) => {
  console.error(error);
  process.exit(1);
});
