import { test, expect } from "@playwright/test";

test.describe("Image loading", () => {
  test("hero image keeps fetchpriority after client-side navigation", async ({
    page,
  }) => {
    await page.goto("/projects/archipelago-platform", {
      waitUntil: "networkidle",
    });
    await expect(page.locator("main .section img").first()).toHaveAttribute(
      "fetchpriority",
      "high",
    );

    // Navigate client-side to another project via its tile
    await page.locator('main a[href="/projects/kidfund"]').first().click();
    await expect(page).toHaveURL("/projects/kidfund");
    await expect(page.locator("main .section img").first()).toHaveAttribute(
      "fetchpriority",
      "high",
    );
  });

  test("below-fold project images lazy-load", async ({ page }) => {
    await page.goto("/projects/archipelago-platform", {
      waitUntil: "networkidle",
    });
    const images = page.locator("main .section").first().locator("img");
    await expect(images.first()).not.toHaveAttribute("loading", "lazy");
    expect(
      await page.locator('main .section img[loading="lazy"]').count(),
    ).toBeGreaterThan(0);
  });

  test("profile photo is served responsively", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    // enhanced:img renders a <picture> with multiple sources
    await expect(page.locator(".main-stack picture")).toHaveCount(1);
    await expect(page.locator(".main-stack img")).toHaveAttribute(
      "fetchpriority",
      "high",
    );
  });
});
