# AGENTS.md

This file provides guidance to AI coding agents working with code in this repository.

## Project Overview

Personal portfolio website for Michael Helmbrecht (mrh.is) — a product designer & developer. Built with SvelteKit 2, Svelte 5 (runes mode), TypeScript, and deployed to Cloudflare Pages.

## Commands

- `npm run dev` — Start dev server (port 5173)
- `npm run build` — Production build
- `npm run preview` — Preview production build (port 4173)
- `npm run check` — TypeScript/Svelte type checking
- `npm run lint` — Prettier + ESLint
- `npm run format` — Auto-format with Prettier
- `npm run test` — Playwright e2e tests (builds first, runs against preview server)
- `npm run test:ui` — Playwright tests with interactive UI
- `npm run pages:deploy` — Build and deploy to Cloudflare Pages

Pre-commit hook runs `lint-staged` (prettier + eslint --fix on staged .js/.ts/.svelte files).

## Architecture

### Routing (SvelteKit file-based)

- `/` — Home page with bio and project tiles
- `/projects/[slug]` — Dynamic project detail pages
- `/timeline` — Career timeline

The root `+layout.ts` sets `prerender = true` (fully static site) and loads project nav links for the shared layout.

### Project Data System

Projects are defined as TypeScript files in `src/lib/data/projects/`, each exporting a `Project` object (see `src/lib/types/Project.ts`). Projects are auto-discovered via `import.meta.glob` in `Project.ts` and sorted by `priority`. Each project defines its content as an array of typed `ContentBlock` variants (text, title, list, carousel, image, subsection), rendered recursively by `src/routes/projects/[slug]/blocks/ContentBlock.svelte`.

### Color System

Each page provides a `ColorScheme` (light/dark palettes with blob and link colors) via page data. The layout applies these as CSS custom properties via `styleStringFromScheme()`.

### Blob Background

Decorative animated SVG blobs rendered by `src/lib/components/blob/` — deterministic geometry seeded by the current URL path, with waggle animation. Uses custom path geometry and math helpers.

### Images

Uses `@sveltejs/enhanced-img` for responsive images. Import images with `?enhanced` suffix in project data files. The `bigger-picture` library provides lightbox functionality.

### Key Conventions

- Svelte 5 runes mode (`$props()`, `$derived()`, `$state()`) — enabled globally in `svelte.config.js`
- Strict TypeScript with `svelte-check`
- ESLint enforces `eqeqeq`, `curly`, `no-var`, `prefer-const`, `no-console` (warn)
- Unused vars prefixed with `_` are allowed
