import { test, expect } from "@playwright/test";

test.describe("Accessibility", () => {
  test("skip link is the first focusable element and targets main", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName !== "chromium",
      "Tab-to-focus on links is Chromium-default only",
    );
    await page.goto("/", { waitUntil: "networkidle" });
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toHaveAttribute(
      "href",
      "#main-content",
    );
    await expect(page.locator("main#main-content")).toHaveCount(1);
  });

  for (const projectUrl of [
    "/projects/archipelago-platform",
    "/projects/archipelago-tooling",
    "/projects/kidfund",
  ]) {
    test(`content images on ${projectUrl} have alt text`, async ({ page }) => {
      await page.goto(projectUrl, { waitUntil: "networkidle" });
      // Scope to the first section (the project itself) — the
      // "other projects" tiles intentionally use empty alt.
      const images = page.locator("main .section").first().locator("img");
      const count = await images.count();
      expect(count).toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        await expect(images.nth(i)).not.toHaveAttribute("alt", "");
      }
    });
  }

  test("carousel trigger has an accessible label", async ({ page }) => {
    await page.goto("/projects/kidfund", { waitUntil: "networkidle" });
    await expect(
      page.locator('a[aria-label="View image gallery"]'),
    ).toBeAttached();
  });

  test("outbound links open safely in new tabs", async ({ page }) => {
    await page.goto("/timeline", { waitUntil: "networkidle" });
    const pdfLink = page.getByRole("link", { name: /as a PDF/ });
    await expect(pdfLink).toHaveAttribute("target", "_blank");
    await expect(pdfLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("CSS transitions are disabled under reduced motion", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName !== "chromium",
      "pseudo-element computed styles vary by engine",
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "networkidle" });
    const duration = await page
      .locator("h2")
      .first()
      .evaluate((el) => getComputedStyle(el, "::after").transitionDuration);
    expect(parseFloat(duration)).toBeLessThan(0.001);
  });

  test("section ids are slug-safe (no spaces, colons, or empty strings)", async ({
    page,
  }) => {
    await page.goto("/timeline", { waitUntil: "networkidle" });
    const sections = page.locator(".section[id]");
    const count = await sections.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const id = await sections.nth(i).getAttribute("id");
      expect(id).toBeTruthy(); // no empty strings
      expect(id).toMatch(/^[a-z0-9-]+$/); // only slug-safe chars
    }
  });

  test("nav dropdown has no unnamed region landmark", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    // role="region" without aria-label creates an unnamed landmark — should not exist
    const unnamedRegions = page.locator(
      '[role="region"]:not([aria-label]):not([aria-labelledby])',
    );
    await expect(unnamedRegions).toHaveCount(0);
  });

  test("CTA button has a visible focus ring", async ({ page, browserName }) => {
    test.skip(
      browserName !== "chromium",
      "focus-visible computed styles vary by engine",
    );
    await page.goto("/", { waitUntil: "networkidle" });
    const button = page.locator("a.button, button.button").first();
    await button.focus();
    const outlineWidth = await button.evaluate(
      (el) => getComputedStyle(el).outlineWidth,
    );
    expect(parseFloat(outlineWidth)).toBeGreaterThan(0);
  });
});
