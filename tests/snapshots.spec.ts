import { test, expect } from "@playwright/test";

const pages = [
  { name: "Home", url: "/" },
  { name: "Timeline", url: "/timeline" },
  { name: "Archipelago Platform", url: "/projects/archipelago-platform" },
  { name: "Archipelago Tooling", url: "/projects/archipelago-tooling" },
  { name: "Kidfund", url: "/projects/kidfund" },
];

test.describe("Visual Regression Tests", () => {
  for (const page of pages) {
    test(`${page.name} page visual snapshot`, async ({ page: browserPage }) => {
      await browserPage.goto(page.url);

      // Wait for page to fully load
      await browserPage.waitForLoadState("networkidle");

      // Hide dynamic content that might change
      await browserPage.addStyleTag({
        content: `
					/* Hide potentially dynamic content for stable snapshots */
					.bp-wrap, .bigger-picture { display: none !important; }
					/* Ensure fonts are loaded */
					* { font-display: swap; }
				`,
      });

      // Take full page screenshot
      await expect(browserPage).toHaveScreenshot(
        `${page.name.toLowerCase().replace(/ /g, "-")}.png`,
        {
          fullPage: true,
          // Mask dynamic content that might change between runs
          mask: [
            // Hide any potentially dynamic elements
            browserPage.locator("[data-dynamic]").first(),
          ].filter(Boolean),
        },
      );
    });
  }

  test("Projects dropdown visual snapshot", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Open the dropdown
    const dropdownButton = page.locator('button:has-text("Projects")');
    await dropdownButton.click();

    // Wait for dropdown animation
    await page.waitForTimeout(200);

    // Take screenshot of the dropdown area
    const dropdownArea = page.locator("nav");
    await expect(dropdownArea).toHaveScreenshot("projects-dropdown.png");
  });
});
