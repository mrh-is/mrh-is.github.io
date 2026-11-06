import { defineConfig, devices } from "@playwright/test";

// Smoke tests against the deployed site, to catch problems introduced
// between our build and the browser (CDN rewrites, headers, caching).
// This targets the Pages hostname because Bot Fight Mode challenges automated
// clients on mrh.is, and the free plan can't exempt them.
export default defineConfig({
  testDir: "./tests-live",
  retries: 1,
  workers: 2,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.LIVE_URL ?? "https://mrh-is-github-io.pages.dev",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "Desktop Chrome", use: devices["Desktop Chrome"] }],
});
