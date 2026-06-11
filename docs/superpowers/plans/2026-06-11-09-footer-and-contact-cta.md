# Footer & Contact CTA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a sitewide `Footer` component and a `ContactCTA` component that gives project pages a contact path after readers finish a case study.

**Architecture:** Two new components (`Footer.svelte`, `ContactCTA.svelte`) plus a `Mail` icon addition. Phase 1 tasks (Tasks 1 and 2) are fully independent and can run in parallel. Phase 2 tasks (Tasks 3, 4, 5) each touch a different file and can also run in parallel once Phase 1 is merged. Task 6 (tests) runs last.

**Tech Stack:** SvelteKit 2, Svelte 5 runes mode, TypeScript. Playwright for e2e tests. Verification: `npm run check` (TypeScript), `npm run lint`, `npm run dev` (visual check).

**Spec:** `docs/superpowers/specs/2026-06-11-footer-and-contact-cta-design.md`

---

## File Map

| File                                      | Action                                                                                      |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- |
| `src/lib/components/general/Icon.svelte`  | Modify — add `"Mail"` to union type and SVG cases                                           |
| `src/lib/components/Footer.svelte`        | Create                                                                                      |
| `src/lib/components/ContactCTA.svelte`    | Create                                                                                      |
| `src/lib/types/Project.ts`                | Modify — add optional `ctaLeadIn?: string` to `Project` interface                           |
| `src/routes/+layout.svelte`               | Modify — import and render `<Footer />` after `</main>`                                     |
| `src/routes/+page.svelte`                 | Modify — replace inline CTA markup with `<ContactCTA />`, remove social icons Section       |
| `src/routes/projects/[slug]/+page.svelte` | Modify — add `<ContactCTA leadIn={project.ctaLeadIn} />` between content and other-projects |
| `tests/pages.spec.ts`                     | Modify — remove stale Instagram assertion, add footer assertions                            |

---

## Phase 1 — Build components (Tasks 1 and 2 run in parallel)

---

### Task 1: Mail icon + Footer component

**Files:**

- Modify: `src/lib/components/general/Icon.svelte`
- Create: `src/lib/components/Footer.svelte`

- [ ] **Step 1: Add `"Mail"` to Icon.svelte**

Replace the `name` prop union type and add the Mail SVG case. Full replacement of `src/lib/components/general/Icon.svelte`:

```svelte
<script lang="ts">
  interface Props {
    name: "GitHub" | "Instagram" | "LinkedIn" | "Mail";
    size?: number;
  }

  const { name, size = 24 }: Props = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
  aria-label={name}
>
  {#if name === "GitHub"}
    <path
      d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
    />
  {:else if name === "Instagram"}
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  {:else if name === "LinkedIn"}
    <path
      d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
    />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  {:else if name === "Mail"}
    <path
      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
    />
    <polyline points="22,6 12,13 2,6" />
  {/if}
</svg>

<style>
  svg {
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
  }
</style>
```

- [ ] **Step 2: Type-check**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 3: Create Footer.svelte**

Create `src/lib/components/Footer.svelte`:

```svelte
<script lang="ts">
  import Icon from "$lib/components/general/Icon.svelte";
</script>

<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-top">
      <span class="domain header-font">mrh.is</span>
      <div class="footer-icons">
        <a href="mailto:me@mrh.is" aria-label="Email me">
          <Icon name="Mail" size={20} />
        </a>
        <a
          href="https://www.linkedin.com/in/michaelhelmbrecht/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <Icon name="LinkedIn" size={20} />
        </a>
      </div>
    </div>
    <p class="footer-sub">
      designed &amp; built by me · <a
        href="https://github.com/mrh-is/mrh-is.github.io"
        target="_blank"
        rel="noopener noreferrer">view source</a
      >
    </p>
  </div>
</footer>

<style>
  .site-footer {
    padding: 3rem 10vw 4rem;
  }

  .footer-inner {
    max-width: var(--max-width);
    margin-left: auto;
    margin-right: auto;
  }

  .footer-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .domain {
    font-size: 2rem;
    font-weight: 800;
    color: var(--text-color);
    text-decoration: none;
  }

  .footer-icons {
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }

  .footer-icons a {
    color: var(--color-light-link);
    display: flex;
    align-items: center;
  }

  .footer-sub {
    margin-top: 0.75rem;
    font-size: 1.2rem;
    color: var(--text-color);
    opacity: 0.4;
  }

  .footer-sub a {
    color: inherit;
  }

  @media (prefers-color-scheme: dark) {
    .footer-icons a {
      color: var(--color-dark-link);
    }
  }
</style>
```

- [ ] **Step 4: Type-check**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 5: Lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/components/general/Icon.svelte src/lib/components/Footer.svelte
git commit -m "feat: add Mail icon and Footer component"
```

---

### Task 2: ContactCTA component + Project type

**Files:**

- Modify: `src/lib/types/Project.ts`
- Create: `src/lib/components/ContactCTA.svelte`

- [ ] **Step 1: Add `ctaLeadIn` to Project interface**

In `src/lib/types/Project.ts`, add the optional field to the `Project` interface (after `priority`):

```ts
export interface Project {
  title: string;
  slug: string;
  description: string;
  tile: {
    subtitle: string;
    imageSrc: ImageSource;
  };
  colorScheme: ColorScheme;
  tagline: string;
  content: ContentBlock[];
  priority?: number;
  ctaLeadIn?: string;
}
```

- [ ] **Step 2: Type-check**

```bash
npm run check
```

Expected: no errors (the field is optional so no existing project files need updating).

- [ ] **Step 3: Create ContactCTA.svelte**

Create `src/lib/components/ContactCTA.svelte`:

```svelte
<script lang="ts">
  import Section from "$lib/components/general/Section.svelte";
  import Button from "$lib/components/general/Button.svelte";
  import EmojiSwitcher from "$lib/components/general/EmojiSwitcher.svelte";

  interface Props {
    leadIn?: string;
  }

  const { leadIn = undefined }: Props = $props();
</script>

<Section>
  {#if leadIn}
    <p class="lead-in">{leadIn}</p>
  {/if}
  <div class="centerer">
    <Button href="mailto:me@mrh.is?subject=Let's%20work%20together!"
      >Let's talk! <EmojiSwitcher lightEmoji="💌" darkEmoji="📬" /></Button
    >
  </div>
</Section>

<style>
  .lead-in {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .centerer {
    display: flex;
    justify-content: center;
  }
</style>
```

- [ ] **Step 4: Type-check**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 5: Lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/types/Project.ts src/lib/components/ContactCTA.svelte
git commit -m "feat: add ContactCTA component and ctaLeadIn project field"
```

---

## Phase 2 — Wiring (Tasks 3, 4, 5 run in parallel after Phase 1 is merged)

---

### Task 3: Wire Footer into layout

**Files:**

- Modify: `src/routes/+layout.svelte`

- [ ] **Step 1: Import Footer and render it after `</main>`**

In `src/routes/+layout.svelte`, add the Footer import at the top of the `<script>` block and render it after `</main>`. Full file replacement:

```svelte
<script lang="ts">
  import { page } from "$app/stores";
  import { PUBLIC_ORIGIN } from "$env/static/public";
  import { styleStringFromScheme } from "$lib/types/Colors";
  import BlobLayer from "$lib/components/blob/BlobLayer.svelte";
  import NavBar from "$lib/components/NavBar.svelte";
  import Footer from "$lib/components/Footer.svelte";

  import "$lib/assets/normalize.css";
  import "$lib/assets/styles.css";

  import { type Snippet } from "svelte";
  import type { LayoutData } from "./$types";
  import Favicons from "$lib/components/Favicons.svelte";
  import { onMount } from "svelte";

  interface Props {
    data: LayoutData;
    children: Snippet;
  }

  const { data, children }: Props = $props();

  const pageTitle = $derived(
    ($page.data.title ?? "Michael Helmbrecht").replace(/­/g, ""),
  );
  const pageDescription = $derived(
    $page.data.description ??
      "Michael Helmbrecht — product designer & developer.",
  );

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-underline");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    // Observe all h2/h3 elements
    document.querySelectorAll("h2, h3").forEach((heading) => {
      observer.observe(heading);
    });

    return () => {
      observer.disconnect();
    };
  });
</script>

<svelte:head>
  <link rel="preconnect" href="https://rsms.me/" />
  <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossorigin="anonymous"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Sniglet:wght@400;800&display=swap"
    rel="stylesheet"
  />

  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <link rel="canonical" href="{PUBLIC_ORIGIN}{$page.url.pathname}" />

  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:url" content="{PUBLIC_ORIGIN}{$page.url.pathname}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Michael Helmbrecht" />
  {#if $page.data.ogImage}
    <meta property="og:image" content="{PUBLIC_ORIGIN}{$page.data.ogImage}" />
    <meta name="twitter:card" content="summary_large_image" />
  {:else}
    <meta name="twitter:card" content="summary" />
  {/if}

  <Favicons />
</svelte:head>

<div class="page" style={styleStringFromScheme($page.data.colorScheme)}>
  <a class="skip-link" href="#main-content">Skip to main content</a>

  <BlobLayer seed={$page.url.pathname} />

  <NavBar projects={data.projects} />

  <main class="content" id="main-content">
    <div class="container">
      {@render children()}
    </div>
  </main>

  <Footer />
</div>

<style>
  .page {
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .content {
    min-height: 80vh;
    margin: 0 10vw 10vh;
  }

  .container {
    max-width: var(--max-width);
    margin-left: auto;
    margin-right: auto;
  }

  .skip-link {
    position: absolute;
    top: -100%;
    left: 1rem;
    z-index: 10;
    padding: 0.5rem 1.5rem;
    background: var(--background-color);
    border-radius: 0.5rem;
  }

  .skip-link:focus-visible {
    top: 1rem;
    outline: 3px solid var(--color-light-link);
    outline-offset: 3px;
  }
</style>
```

- [ ] **Step 2: Type-check**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 3: Lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/routes/+layout.svelte
git commit -m "feat: add Footer to sitewide layout"
```

---

### Task 4: Update home page

**Files:**

- Modify: `src/routes/+page.svelte`

- [ ] **Step 1: Replace inline CTA and remove social icons Section**

Full replacement of `src/routes/+page.svelte`. Changes: import `ContactCTA`, replace the `<Section>` containing `Button`+`EmojiSwitcher` with `<ContactCTA />`, remove the final `<Section>` containing the three social icon links, remove now-unused imports (`Icon`, `Button`, `EmojiSwitcher`), remove `.centerer` and `.icon-set` styles.

```svelte
<script lang="ts">
  import Section from "$lib/components/general/Section.svelte";

  import parque from "$lib/assets/Parque.jpg?enhanced";
  import ProjectTileList from "$lib/components/projects/ProjectTileList.svelte";
  import ContactCTA from "$lib/components/ContactCTA.svelte";
  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }

  const { data }: Props = $props();
</script>

<svelte:head>
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Michael Helmbrecht",
      "url": "https://mrh.is",
      "jobTitle": "Product designer & developer",
      "sameAs": [
        "https://github.com/mrh-is",
        "https://www.instagram.com/mrh_is/",
        "https://www.linkedin.com/in/michaelhelmbrecht/"
      ]
    }
  </script>
</svelte:head>

<Section>
  <div class="main-stack">
    <div class="title-container">
      <h1>Hi! I'm Michael 👋🏻</h1>
      <p class="subtitle">
        I'm a product designer & developer based in Pittsburgh, PA.
      </p>
    </div>
    <enhanced:img
      fetchpriority="high"
      src={parque}
      alt="Me!"
      sizes="(max-width: 400px) 100vw, (max-width: 1000px) 80vw, 320px"
    />
  </div>
  <p>I have a decade of experience helping startups build great products.</p>
  <p>
    I've been a designer, a developer (web & iOS), a product manager, & even a
    marketer. A real jack of all trades, tbh pretty good at most of them! But
    the synthesis is where the real magic happens.
  </p>
  <p>I'd love to help your team make amazing things.</p>
</Section>

<Section title="Call me if you:">
  <ul>
    <li>Want to build The Right Thing™, The Right Way™, the first time</li>
    <li>Want to work with one person who can do it all</li>
    <li>
      Like easy, clear communication and enjoy puns (you're getting them either
      way)
    </li>
  </ul>
</Section>

<ContactCTA />

<Section>
  <p>Have a look at some of my work:</p>
  <ProjectTileList projects={data.projects} />
</Section>

<style>
  .main-stack {
    column-gap: 5rem;
    justify-content: space-between;
    align-items: center;
    margin-top: -1rem;
    margin-bottom: 2rem;
    display: flex;
  }

  .title-container {
    margin-top: -1rem;
    margin-bottom: -1rem;
  }

  .subtitle {
    margin-top: 2rem;
    font-size: 2rem;
    font-weight: 500;
  }

  enhanced\:img {
    border-radius: 100%;
    flex: none;
    width: 20rem;
    height: 20rem;
    object-fit: cover;
  }

  @media (max-width: 1000px) {
    .main-stack {
      flex-direction: column;
      row-gap: 3rem;
      margin-bottom: 5rem;
    }

    enhanced\:img {
      width: 80%;
      height: auto;
      aspect-ratio: 1;
    }
  }

  @media (max-width: 400px) {
    enhanced\:img {
      width: 100%;
    }
  }
</style>
```

- [ ] **Step 2: Type-check**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 3: Lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "feat: replace inline CTA with ContactCTA, remove social icons section"
```

---

### Task 5: Add ContactCTA to project pages

**Files:**

- Modify: `src/routes/projects/[slug]/+page.svelte`

- [ ] **Step 1: Add ContactCTA between content and other-projects**

Full replacement of `src/routes/projects/[slug]/+page.svelte`:

```svelte
<script lang="ts">
  import Section from "$lib/components/general/Section.svelte";
  import type { Project } from "$lib/types/Project";
  import ContentBlock from "./blocks/ContentBlock.svelte";
  import ProjectTileList from "$lib/components/projects/ProjectTileList.svelte";
  import ContactCTA from "$lib/components/ContactCTA.svelte";
  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }

  const { data }: Props = $props();
  const project: Project = $derived(data.project);
  const firstImageIndex = $derived(
    project.content.findIndex(
      (b) => b.kind === "image" || b.kind === "carousel",
    ),
  );
</script>

<Section title={project.title} subtitle={project.tagline} headingLevel={1}>
  {#each project.content as block, index (index)}
    <ContentBlock content={block} hero={index === firstImageIndex} />
  {/each}
</Section>

<ContactCTA leadIn={project.ctaLeadIn} />

<Section>
  <p>While you're here, check out some other projects:</p>
  <ProjectTileList projects={data.otherProjects} />
</Section>
```

- [ ] **Step 2: Type-check**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 3: Lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/routes/projects/[slug]/+page.svelte
git commit -m "feat: add ContactCTA to project pages"
```

---

## Phase 3 — Tests

### Task 6: Update Playwright tests

**Files:**

- Modify: `tests/pages.spec.ts`

- [ ] **Step 1: Update the "Social media links are present" test and add footer tests**

In `tests/pages.spec.ts`, find the `"Social media links are present"` test and the `"Contact email link works"` test inside `test.describe("Home Page Specific Tests")`. Replace that entire `describe` block with the following updated version (Instagram is gone from the home page; LinkedIn and Mail are now in the footer on every page; GitHub still appears as the "view source" link):

```ts
test.describe("Home Page Specific Tests", () => {
  test("Contact email link works", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const emailLink = page.locator('a[href*="mailto:me@mrh.is"]');
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute("href", /mailto:me@mrh\.is/);
  });

  test("Profile image loads with correct attributes", async ({ page }) => {
    await page.goto("/");

    const profileImg = page.locator('img[alt="Me!"]');
    await expect(profileImg).toBeVisible();

    await expect(profileImg).toHaveAttribute("src");
    await expect(profileImg).toHaveAttribute("fetchpriority", "high");
  });
});

test.describe("Footer", () => {
  for (const url of ["/", "/timeline", "/projects/kidfund"]) {
    test(`footer is present on ${url}`, async ({ page }) => {
      await page.goto(url, { waitUntil: "networkidle" });
      await expect(page.locator("footer")).toBeVisible();
    });

    test(`footer has mail and LinkedIn links on ${url}`, async ({ page }) => {
      await page.goto(url, { waitUntil: "networkidle" });
      await expect(
        page.locator('footer a[href*="mailto:me@mrh.is"]'),
      ).toBeAttached();
      await expect(
        page.locator('footer a[href*="linkedin.com"]'),
      ).toBeAttached();
    });

    test(`footer view-source link is present on ${url}`, async ({ page }) => {
      await page.goto(url, { waitUntil: "networkidle" });
      await expect(
        page.locator(
          'footer a[href="https://github.com/mrh-is/mrh-is.github.io"]',
        ),
      ).toBeAttached();
    });
  }
});
```

- [ ] **Step 2: Run the full test suite**

```bash
npm run test
```

Expected: all tests pass. If the `"Social media links are present"` test no longer exists (it was replaced), confirm the new footer tests pass instead. The GitHub `view source` link satisfies any remaining `github.com/mrh-is` assertions elsewhere in the suite.

- [ ] **Step 3: Commit**

```bash
git add tests/pages.spec.ts
git commit -m "test: update social links test, add footer coverage"
```
