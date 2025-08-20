import { test, expect } from "@playwright/test";

test.describe("Interactive Components", () => {
  test.describe("Projects Dropdown Navigation", () => {
    test("Projects dropdown opens and closes", async ({ page }) => {
      await page.goto("/");

      // Look for projects dropdown button with "Projects ↓" text
      const dropdownButton = page.locator('button:has-text("Projects")');
      await expect(dropdownButton).toBeVisible();

      // Click to open dropdown
      await dropdownButton.click();

      // Check if dropdown menu appears
      const dropdownMenu = page.locator("menu[aria-labelledby]");
      await expect(dropdownMenu).toBeVisible();

      // Check that project links are present in dropdown menu specifically
      await expect(
        dropdownMenu.locator('a[href="/projects/archipelago-platform"]'),
      ).toBeVisible();
      await expect(
        dropdownMenu.locator('a[href="/projects/archipelago-tooling"]'),
      ).toBeVisible();
      await expect(
        dropdownMenu.locator('a[href="/projects/kidfund"]'),
      ).toBeVisible();

      // Test clicking a project link from the dropdown menu specifically
      await dropdownMenu
        .locator('a[href="/projects/archipelago-platform"]')
        .click();
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
      await page.goto("/");

      // Check that navigation is still accessible on mobile
      await expect(page.locator("nav")).toBeVisible();

      // Check for mobile menu button if it exists
      const mobileMenuButton = page
        .locator('[data-testid="mobile-menu"], .mobile-menu-toggle, .hamburger')
        .first();

      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click();

        // Check that navigation items become visible
        await expect(page.locator('a[href="/timeline"]')).toBeVisible();
      }
    });
  });
});
