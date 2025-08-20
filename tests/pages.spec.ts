import { test, expect } from "@playwright/test";

const pages = [
  { name: "Home", url: "/" },
  { name: "Timeline", url: "/timeline" },
  { name: "Archipelago Platform", url: "/projects/archipelago-platform" },
  { name: "Archipelago Tooling", url: "/projects/archipelago-tooling" },
  { name: "Kidfund", url: "/projects/kidfund" },
];

test.describe("Page Structure Tests", () => {
  for (const page of pages) {
    test(`${page.name} page loads and has correct structure`, async ({
      page: browserPage,
    }) => {
      await browserPage.goto(page.url);

      // Check that the page loads successfully
      await expect(browserPage).toHaveTitle(/Michael Helmbrecht/);

      // Check navigation is present
      await expect(browserPage.locator("nav")).toBeVisible();
      await expect(browserPage.locator('a[href="/"]')).toBeVisible(); // Home link
      await expect(browserPage.locator('a[href="/timeline"]')).toBeVisible(); // Timeline link

      // Check no broken images
      const images = browserPage.locator("img");
      const imageCount = await images.count();

      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        await expect(img).toBeVisible();

        // Check that image loaded successfully
        const naturalWidth = await img.evaluate(
          (el: HTMLImageElement) => el.naturalWidth,
        );
        expect(naturalWidth).toBeGreaterThan(0);
      }

      // Check main content area exists
      await expect(browserPage.locator("main, body")).toBeVisible();
    });
  }
});

test.describe("Home Page Specific Tests", () => {
  test("Contact email link works", async ({ page }) => {
    await page.goto("/");

    const emailLink = page.locator('a[href*="mailto:me@mrh.is"]');
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute("href", /mailto:me@mrh\.is/);
  });

  test("Social media links are present", async ({ page }) => {
    await page.goto("/");

    // Check for social media links
    await expect(page.locator('a[href*="github.com/mrh-is"]')).toBeVisible();
    await expect(page.locator('a[href*="instagram.com"]')).toBeVisible();
    await expect(page.locator('a[href*="linkedin.com"]')).toBeVisible();
  });

  test("Profile image loads with correct attributes", async ({ page }) => {
    await page.goto("/");

    const profileImg = page.locator('img[alt="Me!"]');
    await expect(profileImg).toBeVisible();
    await expect(profileImg).toHaveAttribute("fetchpriority", "high");
  });
});

test.describe("Project Pages Specific Tests", () => {
  const projectPages = pages.filter((p) => p.url.startsWith("/projects/"));

  for (const projectPage of projectPages) {
    test(`${projectPage.name} project page has content`, async ({ page }) => {
      await page.goto(projectPage.url);

      // Check that project content loads
      await expect(page.locator("h1, h2, h3").first()).toBeVisible();

      // Check for project images/galleries
      const images = page.locator("img");
      const imageCount = await images.count();
      expect(imageCount).toBeGreaterThan(0);
    });
  }
});
