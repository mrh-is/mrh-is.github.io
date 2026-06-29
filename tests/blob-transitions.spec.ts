import { test, expect } from "@playwright/test";

test.describe("Blob transitions", () => {
  test("blobs render on the home page", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const blobs = page.locator(".blob-layer svg");
    await expect(blobs).toHaveCount(7);
  });

  test("blobs transition when navigating to a project", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const initialBlobCount = await page.locator(".blob-layer svg").count();
    expect(initialBlobCount).toBe(7);

    // Navigate to a project page via a visible project tile on the home page
    // (Nav project links are in a hidden dropdown; project tiles have class "hover-effect")
    await page.locator("a.hover-effect").first().click();
    await page.waitForURL(/\/projects\//);

    // During transition, there may be up to 14 blobs (two sets)
    // After transition completes, should be back to 7
    await page.waitForTimeout(1200);
    const finalBlobCount = await page.locator(".blob-layer svg").count();
    expect(finalBlobCount).toBe(7);
  });

  test("blob layer does not cause horizontal scrollbar", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const hasHorizontalScroll = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test("blob layer does not clip vertically", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const overflowY = await page.evaluate(() => {
      const layer = document.querySelector(".blob-layer") as HTMLElement;
      if (!layer) {return "missing";}
      return getComputedStyle(layer).overflowY;
    });
    expect(overflowY).toBe("visible");
  });
});
