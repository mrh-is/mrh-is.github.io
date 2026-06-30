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

    // During transition, there may be up to 14 blobs (two sets).
    // Wait for cleanup instead of assuming a fixed animation duration.
    await expect
      .poll(() => page.locator(".blob-layer svg").count(), {
        timeout: 5000,
      })
      .toBe(7);
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

  test("blob layer does not affect page scroll height", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const blobsAffectScroll = await page.evaluate(() => {
      const layer = document.querySelector(".blob-layer") as HTMLElement;
      if (!layer) {
        return true;
      }
      const style = getComputedStyle(layer);
      return style.position !== "absolute" || style.overflow !== "clip";
    });
    expect(blobsAffectScroll).toBe(false);
  });
});

test.describe("Blob transitions — reduced motion", () => {
  test("blobs use opacity-only transitions", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "networkidle" });

    await page.locator("a.hover-effect").first().click();
    await page.waitForURL(/\/projects\//);

    const enteringStyles = await page.evaluate(() => {
      const wrapper = document.querySelector(
        ".blob-wrapper.entering",
      ) as HTMLElement;
      if (!wrapper) {
        return null;
      }
      const cs = getComputedStyle(wrapper);
      return {
        opacity: cs.opacity,
        transform: cs.transform,
        filter: cs.filter,
      };
    });

    if (enteringStyles) {
      expect(enteringStyles.opacity).toBe("0");
      expect(["none", "blur(0px)"]).toContain(enteringStyles.filter);
      expect(enteringStyles.transform).not.toContain("0.92");
    }
  });

  test("transition duration is short", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "networkidle" });

    await page.locator("a.hover-effect").first().click();
    await page.waitForURL(/\/projects\//);

    const duration = await page.evaluate(() => {
      const wrapper = document.querySelector(".blob-wrapper") as HTMLElement;
      if (!wrapper) {
        return null;
      }
      return wrapper.style.getPropertyValue("--blob-duration");
    });

    if (duration) {
      expect(parseInt(duration)).toBeLessThanOrEqual(200);
    }
  });

  test("blob sets clean up quickly", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "networkidle" });

    await page.locator("a.hover-effect").first().click();
    await page.waitForURL(/\/projects\//);

    await expect
      .poll(() => page.locator(".blob-layer svg").count(), {
        timeout: 2000,
      })
      .toBe(7);
  });
});
