import { test, expect } from "@playwright/test";
import { parseInlineMarkdown } from "../src/lib/utils/markdown";

test.describe("parseInlineMarkdown unit tests", () => {
  test("parses plain text with no links", () => {
    expect(parseInlineMarkdown("plain text here")).toEqual(["plain text here"]);
  });

  test("parses text with a single link", () => {
    expect(
      parseInlineMarkdown("hello [Google](https://google.com) world"),
    ).toEqual([
      "hello ",
      { text: "Google", href: "https://google.com" },
      " world",
    ]);
  });

  test("parses text with multiple links", () => {
    expect(parseInlineMarkdown("[First](1) and [Second](2)")).toEqual([
      { text: "First", href: "1" },
      " and ",
      { text: "Second", href: "2" },
    ]);
  });

  test("parses adjacent links", () => {
    expect(parseInlineMarkdown("[A](1)[B](2)")).toEqual([
      { text: "A", href: "1" },
      { text: "B", href: "2" },
    ]);
  });

  test("handles empty strings", () => {
    expect(parseInlineMarkdown("")).toEqual([]);
  });

  test("parses links nested inside parentheses", () => {
    expect(
      parseInlineMarkdown("hello (like [Google](https://google.com)) world"),
    ).toEqual([
      "hello (like ",
      { text: "Google", href: "https://google.com" },
      ") world",
    ]);
  });
});

test.describe("FormattedText html generation spec", () => {
  test("projects text block external links open safely in a new tab", async ({
    page,
  }) => {
    await page.goto("/projects/kidfund", { waitUntil: "networkidle" });

    // Find the external link to kidfund.us
    const kidfundLink = page.locator('main a[href="https://www.kidfund.us/"]');
    await expect(kidfundLink).toBeVisible();
    await expect(kidfundLink).toHaveAttribute("target", "_blank");
    await expect(kidfundLink).toHaveAttribute("rel", "noopener noreferrer");

    // Check that we don't leak any raw HTML tags in the main text block
    const text = await page.locator("main").innerText();
    expect(text).not.toContain("<a");
    expect(text).not.toContain("href=");
  });

  test("projects text block internal links stay in-tab", async ({ page }) => {
    await page.goto("/timeline", { waitUntil: "networkidle" });
    const projectLink = page.locator(
      'main a[href="/projects/archipelago-platform"]',
    );
    await expect(projectLink).toBeVisible();
    await expect(projectLink).not.toHaveAttribute("target", "_blank");
  });
});
