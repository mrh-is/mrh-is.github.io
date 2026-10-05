import { test, expect, type Page } from "@playwright/test";

/** Every page listed in the live sitemap, as paths. */
async function sitemapPaths(page: Page): Promise<string[]> {
  const response = await page.request.get("/sitemap.xml");
  expect(response.ok()).toBe(true);
  const xml = await response.text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => new URL(match[1]).pathname,
  );
  expect(paths.length).toBeGreaterThan(0);
  return paths;
}

test("every page loads & hydrates without errors", async ({ page }) => {
  test.setTimeout(120_000);
  const paths = await sitemapPaths(page);

  for (const path of paths) {
    const errors: string[] = [];
    const onConsole = (msg: { type(): string; text(): string }) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    };
    const onPageError = (err: Error) => errors.push(err.message);
    page.on("console", onConsole);
    page.on("pageerror", onPageError);

    await test.step(path, async () => {
      const response = await page.goto(path, { waitUntil: "networkidle" });
      expect(response?.status(), `${path} status`).toBeLessThan(400);
      // The footer email link is filled in after mount, so an href proves
      // hydration finished.
      await expect(page.locator('a[href^="mailto:"]').first()).toBeAttached();
      expect(errors, `console errors on ${path}`).toEqual([]);
    });

    page.off("console", onConsole);
    page.off("pageerror", onPageError);
  }
});
