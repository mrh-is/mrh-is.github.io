# Blob System v2 Follow-Up

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to complete these tasks. Keep checkbox status current.

## Task 1: Fix Bottom Overflow Behavior

- [ ] Revisit `BlobLayer.svelte` overflow CSS. The original spec called out that `bottom: 0` and vertical clipping should be removed so blobs are not clipped at the bottom of page content.
- [ ] Decide the correct behavior for footer/bottom-page space, then update the implementation and Playwright assertion to match that behavior.
- [ ] Verify there is no horizontal scrollbar on desktop or mobile.

## Task 2: Verify Reduced-Motion Transition Behavior

- [ ] Add Playwright coverage with `page.emulateMedia({ reducedMotion: "reduce" })` for blob navigation transitions.
- [ ] Confirm reduced motion uses opacity-only transitions, no drift/blur/scale, and approximately 200ms timing.
- [ ] Confirm the DOM does not keep two blob sets around for the normal-motion duration when reduced motion is enabled.

## Task 3: Final Validation

- [ ] Run `npm run check`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run test:unit`.
- [ ] Run `npm run test`.
