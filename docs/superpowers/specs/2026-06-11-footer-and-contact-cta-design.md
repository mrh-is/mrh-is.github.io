# Footer & Contact CTA — Design Spec

**Date:** 2026-06-11  
**Status:** Implemented

## Background

Two related gaps: project pages have no contact path after a reader finishes a case study, and every page except home lacks social links and a consistent closing moment. Both are solved together: a `ContactCTA` component for project pages and a sitewide `Footer` component.

---

## 1. Footer

### Component

**File:** `src/lib/components/Footer.svelte`

A `<footer>` landmark rendered in `src/routes/+layout.svelte` after `</main>`, outside the `.content` div so it can be full-width.

### Layout

Two rows, left-right aligned:

**Top row:**

- Left: "mrh.is" — Sniglet bold, same size/weight as other Sniglet headings on the site
- Right: Mail icon + LinkedIn icon, each wrapped in `OutboundLink` with `target="_blank" rel="noopener"`

**Bottom row:**

- "designed & built by me · [view source](https://github.com/mrh-is/mrh-is.github.io)" — Inter, smaller/muted
- "view source" is a standard anchor link to the public GitHub repo

### Styling

- Horizontal padding matches the `.content` margin (`10vw`) so text aligns with page content
- Icon and link colors inherit from CSS custom properties (`--color-light-link` / `--color-dark-link`) — picks up the per-page color scheme automatically
- No explicit background — sits on the page background

### Icon additions

`src/lib/components/general/Icon.svelte` needs one new icon name added to its union type and SVG cases: `"Mail"` (envelope icon, same stroke style as existing icons).

LinkedIn already exists. The footer uses the `Icon` component for both icons.

### Home page change

The existing standalone `Section` on `src/routes/+page.svelte` containing only the three social icon links (`GitHub`, `Instagram`, `LinkedIn`) is **removed**. The footer replaces it sitewide.

---

## 2. ContactCTA

### Component

**File:** `src/lib/components/ContactCTA.svelte`

Wraps `Button` + `EmojiSwitcher` in a centered layout. Takes one optional prop:

```ts
interface Props {
  leadIn?: string;
}
```

If `leadIn` is provided, renders a `<p>` above the button:

```
Want results like this for your product?
        [ Let's talk! 💌 ]
```

If absent, renders just the button — matching the current home page behavior. Button text is always fixed: "Let's talk! " + `<EmojiSwitcher lightEmoji="💌" darkEmoji="📬" />`.

Centered via flexbox (same `.centerer` pattern currently on the home page).

### Project type

`src/lib/types/Project.ts` gets a new optional field:

```ts
ctaLeadIn?: string;
```

If absent, `ContactCTA` renders just the button. Project data files can supply a lead-in line, e.g. `"Want results like this for your product?"`.

### Project page

`src/routes/projects/[slug]/+page.svelte` adds `<ContactCTA leadIn={project.ctaLeadIn} />` between the content `Section` and the other-projects `Section`:

```svelte
<Section title={project.title} subtitle={project.tagline} headingLevel={1}>
  {#each project.content as block, index (index)}
    <ContentBlock content={block} hero={index === firstImageIndex} />
  {/each}
</Section>

<ContactCTA leadIn={project.ctaLeadIn} />
<!-- new -->

<Section>
  <p>While you're here, check out some other projects:</p>
  <ProjectTileList projects={data.otherProjects} />
</Section>
```

### Home page

`src/routes/+page.svelte` replaces the inline `Button` + `EmojiSwitcher` + `.centerer` markup with `<ContactCTA />` (no copy prop — uses default). The `.centerer` style block can be removed from the home page styles if no longer referenced.

---

## Files changed

| File                                      | Change                                              |
| ----------------------------------------- | --------------------------------------------------- |
| `src/lib/components/Footer.svelte`        | New component                                       |
| `src/lib/components/ContactCTA.svelte`    | New component                                       |
| `src/lib/components/general/Icon.svelte`  | Add `"Mail"` icon                                   |
| `src/lib/types/Project.ts`                | Add optional `ctaLeadIn?: string`                   |
| `src/routes/+layout.svelte`               | Import and render `Footer` after `</main>`          |
| `src/routes/+page.svelte`                 | Replace inline CTA + remove social icons Section    |
| `src/routes/projects/[slug]/+page.svelte` | Add `ContactCTA` between content and other-projects |

---

## Out of scope

- `ctaLeadIn` values for existing projects — these can be added to project data files independently, any time. The component renders just the button if the field is absent.
- Footer dark/light mode visual testing beyond inheriting CSS custom properties.
