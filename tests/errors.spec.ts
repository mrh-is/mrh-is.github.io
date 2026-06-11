import { test, expect } from "@playwright/test";

test.describe("Error pages", () => {
  test("unknown project slug renders branded 404", async ({ page }) => {
    const response = await page.goto("/projects/not-a-real-project");
    expect(response?.status()).toBe(404);
    // Site chrome survives: nav and a way home
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.locator("h1")).toContainText("Page not found");
    await expect(page.locator('main a[href="/"]')).toBeVisible();
  });

  test("unknown top-level path renders branded 404", async ({ page }) => {
    const response = await page.goto("/not-a-real-page");
    expect(response?.status()).toBe(404);
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.locator("h1")).toContainText("Page not found");
  });
});
