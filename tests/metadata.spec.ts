import { test, expect } from "@playwright/test";

test.describe("Social & SEO metadata", () => {
  for (const url of ["/", "/timeline", "/projects/kidfund"]) {
    test(`${url} has Open Graph and Twitter tags`, async ({ page }) => {
      await page.goto(url, { waitUntil: "networkidle" });
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
        "content",
        /Michael Helmbrecht/,
      );
      await expect(page.locator('meta[property="og:description"]')).toHaveCount(
        1,
      );
      await expect(page.locator('meta[property="og:url"]')).toHaveCount(1);
      await expect(page.locator('meta[name="twitter:card"]')).toHaveCount(1);
    });
  }

  test("project page has an og:image", async ({ page }) => {
    await page.goto("/projects/kidfund", { waitUntil: "networkidle" });
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
  });

  test("home page has a JSON-LD Person schema", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const json = await page
      .locator('script[type="application/ld+json"]')
      .textContent();
    const schema = JSON.parse(json!);
    expect(schema["@type"]).toBe("Person");
    expect(schema.name).toBe("Michael Helmbrecht");
  });

  test("sitemap.xml lists all pages", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("/timeline");
    expect(body).toContain("/projects/archipelago-platform");
    expect(body).toContain("/projects/archipelago-tooling");
    expect(body).toContain("/projects/kidfund");
  });
});
