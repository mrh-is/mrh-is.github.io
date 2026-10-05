import { defineConfig, devices } from "@playwright/test";

// Smoke tests against the deployed site, to catch problems introduced
// between our build and the browser (CDN rewrites, headers, caching).
export default defineConfig({
  testDir: "./tests-live",
  retries: 1,
  workers: 2,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.LIVE_URL ?? "https://mrh.is",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "Desktop Chrome", use: devices["Desktop Chrome"] }],
});
