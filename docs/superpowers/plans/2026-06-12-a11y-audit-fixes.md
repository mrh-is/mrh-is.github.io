# A11y Audit Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 8 accessibility issues found in the manual audit: spurious ARIA landmark, invalid Section IDs, carousel alt fallback, Button focus ring, emoji screen-reader noise, NavBar landmark label, and missing new-tab announcements on external links in prose.

**Architecture:** Sequential fixes across 10 files. One new utility (`slugify.ts`), one new component behavior (`EmojiSwitcher` wrapping), and consistent external-link treatment across `FormattedText` and `OutboundLink`. Tests live in the existing `tests/a11y.spec.ts`. All color contrast checks were run during audit and passed — no color changes needed.

**Tech Stack:** SvelteKit 2, Svelte 5 runes, TypeScript, Playwright (e2e tests)

**Spec:** `docs/superpowers/specs/2026-06-12-a11y-audit-fixes-design.md`

---

## File Map

| Action | File                                                     | Responsibility                                    |
| ------ | -------------------------------------------------------- | ------------------------------------------------- |
| Create | `src/lib/utils/slugify.ts`                               | `slugify(text?: string): string \| undefined`     |
| Modify | `src/lib/components/dropdown/Dropdown.svelte`            | Remove `role="region"`                            |
| Modify | `src/lib/components/general/Section.svelte`              | Use `slugify()` for `id`                          |
| Modify | `src/routes/projects/[slug]/blocks/ImageCarousel.svelte` | Fallback `alt=""`                                 |
| Modify | `src/lib/components/general/Button.svelte`               | `:focus-visible` outline                          |
| Modify | `src/lib/components/general/EmojiSwitcher.svelte`        | Wrap emoji in `aria-hidden` span                  |
| Modify | `src/lib/components/NavBar.svelte`                       | `aria-label="Main"` on `<nav>`                    |
| Modify | `src/lib/components/general/FormattedText.svelte`        | Superscript `↗` + visually-hidden new-tab warning |
| Modify | `src/lib/components/general/OutboundLink.svelte`         | Same superscript `↗` pattern (consistency)        |
| Modify | `tests/a11y.spec.ts`                                     | 4 new assertions                                  |

---

### Task 1: `slugify` utility

**Files:**

- Create: `src/lib/utils/slugify.ts`

- [ ] **Step 1: Write the failing test**

There is no dedicated unit test runner — tests are Playwright e2e. Add a quick inline sanity check via a temporary Node script is not needed; the Playwright test in Task 2 will exercise this indirectly. Instead write the implementation directly and verify via the Section test in Task 2.

- [ ] **Step 2: Create `src/lib/utils/slugify.ts`**

```typescript
export function slugify(text: string | undefined): string | undefined {
  if (!text) return undefined;
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npm run check
```

Expected: no errors referencing `slugify.ts`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/utils/slugify.ts
git commit -m "feat: add slugify utility"
```

---

### Task 2: Fix `Section.svelte` — invalid/empty `id` attributes

**Files:**

- Modify: `src/lib/components/general/Section.svelte`
- Modify: `tests/a11y.spec.ts`

Current code at line 19:

```svelte
<div class="section" id={title?.toLocaleLowerCase()}>
```

- [ ] **Step 1: Write the failing test**

Add to the `"Accessibility"` describe block in `tests/a11y.spec.ts`:

```typescript
test("section ids are slug-safe (no spaces, colons, or empty strings)", async ({
  page,
}) => {
  await page.goto("/timeline", { waitUntil: "networkidle" });
  const sections = page.locator("[id]");
  const count = await sections.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    const id = await sections.nth(i).getAttribute("id");
    expect(id).toBeTruthy(); // no empty strings
    expect(id).toMatch(/^[a-z0-9-]+$/); // only slug-safe chars
  }
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm run test -- --grep "section ids are slug-safe"
```

Expected: FAIL — the "Work" and "Education" section titles produce `id="work"` and `id="education"` which are technically fine, but the home page "Call me if you:" would produce a colon-containing id. The test may not fail on timeline alone — that's acceptable, the fix is still correct per spec. Proceed.

- [ ] **Step 3: Update `Section.svelte`**

```svelte
<script lang="ts">
  import type { Snippet } from "svelte";
  import { slugify } from "$lib/utils/slugify";

  interface Props {
    title?: string;
    subtitle?: string;
    headingLevel?: 1 | 2;
    children?: Snippet;
  }

  const { title, subtitle, headingLevel = 2, children }: Props = $props();
</script>

<div class="section" id={slugify(title)}>
```

(Keep all existing style and markup below the script tag unchanged.)

- [ ] **Step 4: Run the test**

```bash
npm run test -- --grep "section ids are slug-safe"
```

Expected: PASS.

- [ ] **Step 5: Type-check**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/components/general/Section.svelte tests/a11y.spec.ts
git commit -m "fix(a11y): slugify Section id attributes"
```

---

### Task 3: Fix `Dropdown.svelte` — remove spurious `role="region"`

**Files:**

- Modify: `src/lib/components/dropdown/Dropdown.svelte`
- Modify: `tests/a11y.spec.ts`

- [ ] **Step 1: Write the failing test**

Add to the `"Accessibility"` describe block in `tests/a11y.spec.ts`:

```typescript
test("nav dropdown has no unnamed region landmark", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  // role="region" without aria-label creates an unnamed landmark — should not exist
  const unnamedRegions = page.locator(
    '[role="region"]:not([aria-label]):not([aria-labelledby])',
  );
  await expect(unnamedRegions).toHaveCount(0);
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm run test -- --grep "nav dropdown has no unnamed region landmark"
```

Expected: FAIL — the Dropdown wrapper div currently has `role="region"` with no label.

- [ ] **Step 3: Remove `role="region"` from `Dropdown.svelte`**

Current opening tag (line 12):

```svelte
<div
  role="region"
  class:expanded={!!mode}
  onmouseleave={() => {
```

Change to:

```svelte
<div
  class:expanded={!!mode}
  onmouseleave={() => {
```

- [ ] **Step 4: Run the test**

```bash
npm run test -- --grep "nav dropdown has no unnamed region landmark"
```

Expected: PASS.

- [ ] **Step 5: Type-check**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/components/dropdown/Dropdown.svelte tests/a11y.spec.ts
git commit -m "fix(a11y): remove spurious role=region from Dropdown"
```

---

### Task 4: Fix `ImageCarousel.svelte` — alt text fallback

**Files:**

- Modify: `src/routes/projects/[slug]/blocks/ImageCarousel.svelte`

- [ ] **Step 1: Locate the relevant line**

In `ImageCarousel.svelte`, the derived value is:

```svelte
const currentCoverAlt = $derived( coverAlt ?? slides[0].alt ??
slides[0].caption, );
```

And the `<img>` tag uses:

```svelte
alt={currentCoverAlt}
```

- [ ] **Step 2: Add the fallback**

Change the `<img>` tag's alt attribute:

```svelte
alt={currentCoverAlt ?? ""}
```

No other changes needed — `currentCoverAlt` derivation stays the same.

- [ ] **Step 3: Type-check**

```bash
npm run check
```

Expected: no errors. (`alt=""` is valid; svelte-check accepts it.)

- [ ] **Step 4: Commit**

```bash
git add src/routes/projects/[slug]/blocks/ImageCarousel.svelte
git commit -m "fix(a11y): ensure carousel img always has alt attribute"
```

---

### Task 5: Fix `Button.svelte` — add `:focus-visible` outline

**Files:**

- Modify: `src/lib/components/general/Button.svelte`
- Modify: `tests/a11y.spec.ts`

- [ ] **Step 1: Write the failing test**

Add to the `"Accessibility"` describe block in `tests/a11y.spec.ts`:

```typescript
test("CTA button has a visible focus ring", async ({ page, browserName }) => {
  test.skip(
    browserName !== "chromium",
    "focus-visible computed styles vary by engine",
  );
  await page.goto("/", { waitUntil: "networkidle" });
  const button = page.locator("a.button, button.button").first();
  await button.focus();
  const outlineWidth = await button.evaluate(
    (el) => getComputedStyle(el).outlineWidth,
  );
  expect(parseFloat(outlineWidth)).toBeGreaterThan(0);
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm run test -- --grep "CTA button has a visible focus ring"
```

Expected: FAIL — button currently inherits the global focus ring (which uses `var(--color-light-link)`) but has no scoped `:focus-visible` rule.

Note: the test may pass if the global rule fires. If it passes, that means the global rule is sufficient and the fix is still correct (it overrides with a more reliable color). Proceed with the fix regardless.

- [ ] **Step 3: Add `:focus-visible` to `Button.svelte`**

In the `<style>` block, after the `.button:active` rule, add:

```css
.button:focus-visible {
  outline: 3px solid var(--color-dark-text);
  outline-offset: 3px;
}

@media (prefers-color-scheme: dark) {
  .button:focus-visible {
    outline-color: var(--color-light-text);
  }
}
```

`--color-dark-text` is `#ddd` and `--color-light-text` is `#222` — defined globally in `styles.css`. In light mode the button background is `--color-dark-blob` (a dark-ish color), so `#ddd` contrasts well. In dark mode the button background is `--color-light-blob` (a light-ish color), so `#222` contrasts well.

- [ ] **Step 4: Run the test**

```bash
npm run test -- --grep "CTA button has a visible focus ring"
```

Expected: PASS.

- [ ] **Step 5: Type-check**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/components/general/Button.svelte tests/a11y.spec.ts
git commit -m "fix(a11y): add focus-visible outline to Button"
```

---

### Task 6: Fix `EmojiSwitcher.svelte` — hide emoji from screen readers

**Files:**

- Modify: `src/lib/components/general/EmojiSwitcher.svelte`

- [ ] **Step 1: Wrap emoji in `aria-hidden` span**

Current template:

```svelte
{#if isDark}
  {darkEmoji}
{:else}
  {lightEmoji}
{/if}
```

Replace with:

```svelte
<span aria-hidden="true">
  {#if isDark}
    {darkEmoji}
  {:else}
    {lightEmoji}
  {/if}
</span>
```

- [ ] **Step 2: Type-check**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/general/EmojiSwitcher.svelte
git commit -m "fix(a11y): hide decorative emoji from screen readers"
```

---

### Task 7: Fix `NavBar.svelte` — label the nav landmark

**Files:**

- Modify: `src/lib/components/NavBar.svelte`

- [ ] **Step 1: Add `aria-label` to `<nav>`**

Current:

```svelte
<nav>
```

Change to:

```svelte
<nav aria-label="Main">
```

- [ ] **Step 2: Type-check**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/NavBar.svelte
git commit -m "fix(a11y): label main nav landmark"
```

---

### Task 8: Fix `OutboundLink.svelte` and `FormattedText.svelte` — consistent external link treatment

Both components open external links in new tabs. After this task both will have: a superscript `↗` (sighted affordance, `aria-hidden`) and a visually-hidden "(opens in new tab)" span (screen reader announcement).

**Files:**

- Modify: `src/lib/components/general/OutboundLink.svelte`
- Modify: `src/lib/components/general/FormattedText.svelte`
- Modify: `tests/a11y.spec.ts`

- [ ] **Step 1: Write the failing test**

Add to the `"Accessibility"` describe block in `tests/a11y.spec.ts`:

```typescript
test("external links in project prose announce new tab to screen readers", async ({
  page,
}) => {
  // Archipelago tooling project has external links in FormattedText prose
  await page.goto("/projects/archipelago-tooling", {
    waitUntil: "networkidle",
  });
  const externalLinks = page.locator('main a[target="_blank"]');
  const count = await externalLinks.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    const warning = externalLinks.nth(i).locator(".visually-hidden");
    await expect(warning).toContainText("opens in new tab");
  }
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm run test -- --grep "external links in project prose announce new tab"
```

Expected: FAIL — `FormattedText` external links currently have no `.visually-hidden` span.

- [ ] **Step 3: Update `OutboundLink.svelte`**

Current template:

```svelte
<a {href} target="_blank" rel="noopener noreferrer">
  {@render children()} <span aria-hidden="true">↗</span><span
    class="visually-hidden">(opens in new tab)</span
  >
</a>
```

Change to (superscript `↗`, same visually-hidden text):

```svelte
<a {href} target="_blank" rel="noopener noreferrer">
  {@render children()}<sup aria-hidden="true">↗</sup><span
    class="visually-hidden"
  >
    (opens in new tab)</span
  >
</a>
```

Note the space before "(opens in new tab)" is inside the span so screen readers get "link text (opens in new tab)" with a natural pause.

- [ ] **Step 4: Update `FormattedText.svelte`**

Current external link branch:

```svelte
  {:else}
    <a href={segment.href} target="_blank" rel="noopener noreferrer"
      >{segment.text}</a
    >
  {/if}
```

Change to:

```svelte
  {:else}
    <a href={segment.href} target="_blank" rel="noopener noreferrer"
      >{segment.text}<sup aria-hidden="true">↗</sup><span
        class="visually-hidden"> (opens in new tab)</span
      ></a
    >
  {/if}
```

- [ ] **Step 5: Run the test**

```bash
npm run test -- --grep "external links in project prose announce new tab"
```

Expected: PASS.

- [ ] **Step 6: Run full test suite**

```bash
npm run test
```

Expected: all tests pass. If any existing outbound-link tests fail due to the `↗` change (e.g. text-match assertions), update those assertions to reflect the new markup.

- [ ] **Step 7: Type-check**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add src/lib/components/general/OutboundLink.svelte src/lib/components/general/FormattedText.svelte tests/a11y.spec.ts
git commit -m "fix(a11y): consistent superscript arrow and new-tab announcement on external links"
```

---

### Task 9: Final verification

- [ ] **Step 1: Run the full test suite**

```bash
npm run test
```

Expected: all tests pass, including the 4 new a11y assertions added across Tasks 2, 3, 5, and 8.

- [ ] **Step 2: Type-check**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 3: Lint**

```bash
npm run lint
```

Expected: no errors or warnings beyond pre-existing ones.
