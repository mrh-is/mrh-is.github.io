# A11y Audit Fixes — Design Spec

**Date:** 2026-06-12

## Summary

Manual accessibility audit of all Svelte components and project data. 8 issues found across 7 files. Color contrast audit ran WCAG luminance checks on all 8 link/accent colors — all pass AA (lowest ratio 6.43:1 Archipelago Platform light). No color changes needed. Remaining issues are structural/semantic.

---

## Issues and Fixes

### 1. `Dropdown.svelte` — spurious `role="region"` on wrapper div

**Issue:** The wrapping `<div>` has `role="region"`, which creates an unnamed landmark. Screen readers enumerate landmarks for navigation; an unnamed region is noise and a spec violation (region requires an accessible name).

**Fix:** Remove `role="region"` from the `<div>`. The button's `aria-haspopup="menu"`, `aria-expanded`, and `aria-controls` attributes already provide the full widget semantics without a landmark wrapper.

---

### 2. `Section.svelte` — empty and invalid `id` attributes

**Issue:** `id={title?.toLocaleLowerCase()}` produces:

- `id=""` when `title` is undefined (invalid HTML; can corrupt skip-link targeting)
- IDs containing spaces and punctuation (e.g., `id="call me if you:"`) — technically valid but fragile

**Fix:** Only set `id` when title is a non-empty string, and slugify it: lowercase, replace any non-alphanumeric characters with hyphens, collapse consecutive hyphens, trim leading/trailing hyphens.

```
id={title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : undefined}
```

---

### 3. `ImageCarousel.svelte` — alt text can resolve to `undefined`

**Issue:** `currentCoverAlt` resolves as `coverAlt ?? slides[0].alt ?? slides[0].caption`. `slides[0].alt` is optional and `slides[0].caption` is the visible caption text — captions describe context, not image content, making them a poor alt fallback. If all three are absent, `img` renders with no `alt` attribute (error).

**Fix:** Ensure `alt` always has a value. If none of the three resolve, fall back to `""` (explicitly decorative). In practice all carousel slides have captions so the fallback is a safety net only.

```svelte
alt={currentCoverAlt ?? ""}
```

No changes needed to project data files — all existing slides have captions.

---

### 4. `Button.svelte` — no `:focus-visible` styling

**Issue:** The global focus ring (`3px solid var(--color-light-link)`) is drawn over the button's background color (`var(--color-dark-blob)` in light mode, `var(--color-light-blob)` in dark mode). These are the same hue family as the link color — on some pages the outline could be nearly invisible against the button.

**Fix:** Add an explicit `:focus-visible` rule on `.button` that forces a high-contrast outline regardless of the blob color. Use `outline: 3px solid currentColor` with a white `outline-offset` buffer via `box-shadow`, or simply use a fixed offset and white/black color.

Concrete approach: use a double ring — a colored outer ring contrasting against the button background. The button always uses `--color-dark-blob` background in light mode and `--color-light-blob` in dark mode, so the outline can use the corresponding text color:

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

`--color-dark-text` is `#ddd` and `--color-light-text` is `#222` — these are the standard foreground colors for each mode and guarantee contrast against the button blob background.

---

### 5. `EmojiSwitcher.svelte` — emoji read aloud unnecessarily

**Issue:** Emoji in `<EmojiSwitcher>` renders as raw text. Inside the "Let's talk! 💌" CTA button, screen readers announce "Let's talk! love letter" (or similar) — verbose and distracting since the button text already communicates the action.

**Fix:** Wrap the rendered emoji in `<span aria-hidden="true">` so it is presentation-only.

```svelte
<span aria-hidden="true">
  {#if isDark}{darkEmoji}{:else}{lightEmoji}{/if}
</span>
```

---

### 6. `NavBar.svelte` — `<nav>` has no accessible name

**Issue:** The `<nav>` element has no `aria-label`. With multiple navigable regions on the page (nav, footer links), labeling the primary nav helps screen reader users distinguish them.

**Fix:** Add `aria-label="Main"` to the `<nav>` element.

---

### 7. `FormattedText.svelte` — external links open new tab without announcement

**Issue:** External links in `FormattedText` use `target="_blank"` but — unlike `OutboundLink.svelte` — give no screen reader announcement that a new tab will open. Keyboard users navigating prose will be surprised when focus moves to a new window.

**Fix:** Add the same visually-hidden span pattern as `OutboundLink`:

```svelte
<a href={segment.href} target="_blank" rel="noopener noreferrer">
  {segment.text}<span class="visually-hidden"> (opens in new tab)</span>
</a>
```

No `↗` arrow — prose links should not get the arrow (would be visually noisy). The visual affordance question is left to a quick design review by the author.

The `.visually-hidden` class is already defined in `styles.css`.

---

## Test Coverage

New assertions in `tests/a11y.spec.ts`:

1. **Dropdown no spurious landmark** — assert no element with `role="region"` exists in the nav dropdown.
2. **Section IDs are slug-safe** — on the timeline page, assert section IDs contain no spaces or colons.
3. **Button focus ring visible** — focus the CTA button and assert `:focus-visible` outline is non-zero and does not match the button background color.
4. **FormattedText new-tab warning** — on a project page with prose external links, assert at least one `.visually-hidden` span containing "opens in new tab" exists inside a `target="_blank"` link.

Existing tests that already cover related issues (do not duplicate):

- Skip link presence and targeting — `a11y.spec.ts`
- Content image alt text — `a11y.spec.ts`
- Carousel trigger accessible label — `a11y.spec.ts`
- Reduced motion transitions — `a11y.spec.ts`

---

## Files Changed

| File                                                     | Change                                                |
| -------------------------------------------------------- | ----------------------------------------------------- |
| `src/lib/components/dropdown/Dropdown.svelte`            | Remove `role="region"`                                |
| `src/lib/components/general/Section.svelte`              | Slugify `id` attribute, only set when non-empty       |
| `src/routes/projects/[slug]/blocks/ImageCarousel.svelte` | Fallback `alt=""` when all alt sources are undefined  |
| `src/lib/components/general/Button.svelte`               | Add `:focus-visible` double-ring outline              |
| `src/lib/components/general/EmojiSwitcher.svelte`        | Wrap emoji in `aria-hidden="true"` span               |
| `src/lib/components/NavBar.svelte`                       | Add `aria-label="Main"` to `<nav>`                    |
| `src/lib/components/general/FormattedText.svelte`        | Add visually-hidden new-tab warning on external links |
| `tests/a11y.spec.ts`                                     | Add 4 new assertions                                  |

**Not changed:** Color scheme files — all 8 link colors pass WCAG AA (min ratio 6.43:1).
