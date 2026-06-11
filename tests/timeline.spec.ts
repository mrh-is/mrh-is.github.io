import { test, expect } from "@playwright/test";

test.describe("Timeline rich text", () => {
  test("external description links open safely in new tabs", async ({
    page,
  }) => {
    await page.goto("/timeline", { waitUntil: "networkidle" });
    const capstoneLink = page.locator('main a[href*="capstone"]');
    await expect(capstoneLink).toBeAttached();
    await expect(capstoneLink).toHaveAttribute("target", "_blank");
    await expect(capstoneLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("internal description links stay in-tab", async ({ page }) => {
    await page.goto("/timeline", { waitUntil: "networkidle" });
    const projectLink = page.locator(
      'main a[href="/projects/archipelago-platform"]',
    );
    await expect(projectLink).toBeAttached();
    await expect(projectLink).not.toHaveAttribute("target", "_blank");
  });

  test("no raw HTML leaks into rendered text", async ({ page }) => {
    await page.goto("/timeline", { waitUntil: "networkidle" });
    const text = await page.locator("main").innerText();
    expect(text).not.toContain("<a");
    expect(text).not.toContain("href=");
  });
});
