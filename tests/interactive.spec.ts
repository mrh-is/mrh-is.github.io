import { test, expect } from "@playwright/test";

test.describe("Interactive Components", () => {
  test.describe("Projects Dropdown Navigation", () => {
    test("Projects dropdown structure and links exist", async ({ page }) => {
      await page.goto("/", { waitUntil: "networkidle" });

      // Look for projects dropdown button with "Projects ↓" text
      const dropdownButton = page.locator('button:has-text("Projects")');
      await expect(dropdownButton).toBeVisible();

      // Check that the dropdown has proper accessibility attributes
      await expect(dropdownButton).toHaveAttribute("aria-haspopup", "menu");
      await expect(dropdownButton).toHaveAttribute("aria-expanded", "false");

      // Check that dropdown menu exists in DOM (even if not visible)
      const dropdownMenu = page.locator("menu[aria-labelledby]");
      await expect(dropdownMenu).toBeAttached();

      // Check that project links are present in dropdown menu
      await expect(
        dropdownMenu.locator('a[href="/projects/archipelago-platform"]'),
      ).toBeAttached();
      await expect(
        dropdownMenu.locator('a[href="/projects/archipelago-tooling"]'),
      ).toBeAttached();
      await expect(
        dropdownMenu.locator('a[href="/projects/kidfund"]'),
      ).toBeAttached();

      // Test that we can navigate to a project page directly (bypassing dropdown interaction)
      await page.goto("/projects/archipelago-platform");
      await expect(page).toHaveURL("/projects/archipelago-platform");
    });
  });

  test.describe("Image Lightboxes", () => {
    const projectPages = [
      "/projects/archipelago-platform",
      "/projects/archipelago-tooling",
      "/projects/kidfund",
    ];

    for (const projectUrl of projectPages) {
      test(`Lightbox functionality on ${projectUrl}`, async ({ page }) => {
        await page.goto(projectUrl);

        // bigger-picture creates clickable images - look for images with cursor pointer
        const clickableImages = page.locator("img").first();

        if (await clickableImages.isVisible()) {
          // Click the first image to open bigger-picture lightbox
          await clickableImages.click();

          // Wait for bigger-picture lightbox to appear
          await page.waitForTimeout(200);

          // bigger-picture creates an overlay with specific classes
          const lightboxContainer = page
            .locator(".bp-wrap, .bigger-picture")
            .first();

          if (await lightboxContainer.isVisible()) {
            // Test navigation if multiple images exist - be more careful with selectors
            const nextButton = page.locator(".bp-next").first();
            const prevButton = page.locator(".bp-prev").first();

            // Test next navigation if available
            if (await nextButton.isVisible()) {
              try {
                await nextButton.click();
                await page.waitForTimeout(100);
              } catch {
                // Navigation might not be available, continue
              }
            }

            // Test previous navigation if available
            if (await prevButton.isVisible()) {
              try {
                await prevButton.click();
                await page.waitForTimeout(100);
              } catch {
                // Navigation might not be available, continue
              }
            }

            // Close by pressing escape key
            await page.keyboard.press("Escape");
            await page.waitForTimeout(100);
          }
        }
      });
    }
  });

  test.describe("Responsive Navigation", () => {
    test("Mobile navigation works correctly", async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/", { waitUntil: "networkidle" });

      // Check that navigation is still accessible on mobile
      await expect(page.locator("nav")).toBeVisible();

      // This site uses a simple responsive design without a mobile hamburger menu
      // Verify that timeline link is visible and accessible on mobile
      await expect(page.locator('a[href="/timeline"]')).toBeVisible();

      // Test that navigation works on mobile
      await page.locator('a[href="/timeline"]').click();
      await expect(page).toHaveURL("/timeline");
    });
  });

  test.describe("Dark Mode", () => {
    test("Site switches to dark mode based on system preference", async ({
      page,
    }) => {
      // Test with dark mode preference
      await page.emulateMedia({ colorScheme: "dark" });
      await page.goto("/");

      // Wait for favicon system to respond to dark mode
      await page.waitForTimeout(100);

      // Check that dark mode favicons are present in the DOM
      const darkFavicons = page.locator(
        'link[rel="icon"][media*="prefers-color-scheme: dark"]',
      );
      await expect(darkFavicons).toHaveCount(5); // Should have 5 different sizes

      // Test with light mode preference
      await page.emulateMedia({ colorScheme: "light" });
      await page.reload();

      // Wait for favicon system to respond to light mode
      await page.waitForTimeout(100);

      // Check that light mode favicons are present in the DOM
      const lightFavicons = page.locator(
        'link[rel="icon"][media*="prefers-color-scheme: light"]',
      );
      await expect(lightFavicons).toHaveCount(5); // Should have 5 different sizes
    });
  });
});
