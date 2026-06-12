# Design & Content Backlog — Unplanned Review Findings

The seven implementation plans (01–07) covered everything from the June 2026 review that was a defect: bugs, accessibility, metadata, performance, infrastructure. What's left are **judgment calls** — content and design decisions where the right answer depends on taste and goals, not correctness. This document expands each one with the observation, the trade-offs, and a recommendation, so they can be picked up individually whenever it feels right.

These are deliberately _not_ written as TDD implementation plans. Each would start with a quick design conversation (the superpowers:brainstorming skill), not a test.

---

## Worth doing soon — high value, low effort

### 1. Contact CTA on project pages

**Observation:** The home page has the "Let's talk! 💌" mailto button, but project pages end with "While you're here, check out some other projects." The person who just read an entire case study is the most-convinced visitor on the site — and the page hands them more reading instead of a way to get in touch.

**Options:**

- **Extract the CTA into a shared component** (`src/lib/components/ContactCTA.svelte` wrapping the existing `Button` + `EmojiSwitcher` in a `Section`) and render it on project pages between the content and the other-projects tiles. Copy can be context-aware — "Want results like this for your product? Let's talk!" reads better after a case study than a bare "Let's talk!".
- **Put the CTA in a footer instead** (see #2) — lighter touch, but a footer CTA is furniture; an in-flow CTA after the outcome section is a pitch.

**Recommendation:** Do both, differently weighted: the full button CTA on project pages after the content block loop in `src/routes/projects/[slug]/+page.svelte`, and a quieter text link in the footer. The component extraction also de-duplicates the home page markup. Effort: well under an hour.

### 2. Footer

**Observation:** Pages just stop. Home ends at the social icons; project pages end at the other-projects tiles; the timeline ends at the PDF link. There's no consistent "you've reached the end, here's who this was and how to reach them" moment, and on every page except home, the social links don't exist at all.

**What a footer buys here:** a contact path on every page, a home for the social icons site-wide, and an ending that reads as intentional. For a one-person portfolio it should stay quiet — name, a mailto link, the three existing `Icon` links, maybe "Designed & built by me · view source" if the repo is public.

**Considerations:** It lives in `src/routes/+layout.svelte` after `<main>`, inherits the per-page color scheme automatically (links pick up `--color-light-link`/`--color-dark-link`), and should use a `<footer>` landmark (consistent with the `<main>` landmark work in plan 01). Keep it outside `.content` so it can be full-width if wanted.

**Recommendation:** Yes — small, finishes the page visually, and pairs with #1 (if the footer carries contact info everywhere, the per-page CTA can stay focused on project pages). Effort: an hour including responsive/dark-mode checks.

### 3. Analytics

**Observation:** There is no visibility into whether anyone visits, which projects get read, or where visitors come from. For a site whose purpose is generating work conversations, that's flying blind — #1 and #4 in this document are guesses without it.

**Options (all cookie-less, no consent banner needed):**

| Option                   | Cost            | Notes                                                                                                                                      |
| ------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Cloudflare Web Analytics | Free            | Already on Cloudflare Pages — enable in the dashboard, or add their one-line beacon script. Page views, referrers, paths, Core Web Vitals. |
| GoatCounter              | Free (donation) | Scrappier UI, very privacy-focused, one script tag.                                                                                        |
| Plausible / Fathom       | ~$9+/mo         | Nicer dashboards, custom events (e.g. "CTA clicked"), paid.                                                                                |

**Recommendation:** Cloudflare Web Analytics — zero cost, zero new vendors, and enabling it from the Pages dashboard requires no code at all (Cloudflare injects the beacon). If instead the script tag goes in `src/app.html`, note the interaction with `static/_headers`: a future Content-Security-Policy would need to allow `static.cloudflareinsights.com`. Revisit after a month of data: if project-level read-depth or CTA-click events become interesting, that's the point to consider Plausible.

---

## Bigger lift — content, not code

### 4. Show more projects

**Observation:** Three projects, two of them from Archipelago. A hiring manager skimming for breadth sees one company plus one consumer app. Meanwhile the timeline names several roles with no corresponding case study, and the project system makes adding one almost free: a new file in `src/lib/data/projects/` + images, and auto-discovery handles the nav dropdown, home tiles, other-projects lists, sitemap, and OG tags. The `priority` field controls ordering.

**Candidate case studies, from existing timeline material:**

- **This website** — cheapest content available (the material is the repo itself), and it's the strongest possible demo of the "designer & developer synthesis" pitch the bio leads with. The blob system, the typed content-block architecture, and the recent a11y/perf work are all showable artifacts.
- **Realm (2015–2017)** — website, developer docs, branding, content marketing. The only material that shows the marketer/writer facet, and it's a recognizable name in the iOS world.
- **CMU capstone advising (current)** — short-form, but it's current work and signals seniority/mentorship.
- **Motiv (2014–2015)** — iOS + device SDK; older, probably only worth it if hardware-adjacent work is a target.

**Recommendation:** Add one or two, prioritizing non-Archipelago breadth: "this website" first (lowest effort, on-brand), Realm second if old artifacts/screenshots still exist. Skip anything where the visuals would have to be reconstructed from memory — a thin case study reads worse than none.

---

## Reviewed and deliberately left alone

Revisit these only if a concrete signal appears; none is worth speculative work.

### 5. Section spacing (15rem)

One reviewer hit a full viewport of empty space between sections on the Archipelago page and read it as "the page ended." Counterpoint: the airy pacing is part of the site's character, and the scroll-triggered underline animations rely on sections entering the viewport discretely. If it ever nags, the surgical fix is reducing margins only for `Section`s rendered inside `subsection` content blocks (nested sections compound the spacing) rather than touching the global 15rem. **Status: taste — owner's call, no change recommended.**

### 6. Blob animation cost on mobile

Seven concurrently animating SVG blobs per page. `prefers-reduced-motion` already disables the waggle (and plan 03 extended reduced-motion coverage to CSS transitions), so the accessibility angle is handled. The remaining question is purely battery/jank on low-end devices — and there's no measurement showing a problem. If one appears (complaints, or a Performance trace with 6x CPU throttle showing long frames), the mitigations in order of effort: pause animation when the tab is hidden, pause offscreen blobs via IntersectionObserver, fewer blobs under a width media query. **Status: no action without a measurement.**

### 7. Self-hosting fonts (Inter via rsms.me, Sniglet via Google Fonts)

Both load with `font-display: swap`, so the review's original FOIT concern was unfounded. What self-hosting would still buy: two fewer third-party origins (resilience if rsms.me hiccups, marginally faster first load, cleaner privacy posture — Google Fonts CSS requests have GDPR baggage in the EU). Cost: moderate — `@fontsource-variable/inter` + `@fontsource/sniglet`, swap the `<link>` tags for imports, drop the preconnects. **Status: nice-to-have; fold it into the next typography change rather than doing it standalone.**

### 8. ~~Lint strictness~~ — done

`no-console` and `no-explicit-any` were promoted to errors (with `consistent-type-imports` and stricter Svelte rules) in commit `25e4b0a` after the plans were written. Nothing left here.
