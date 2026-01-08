import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 2,
  reporter: [["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:8788",
    trace: "on-first-retry",
    // Speed up tests
    actionTimeout: 10000,
    navigationTimeout: 20000,
    // Reduce screenshot overhead
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "Desktop Chrome",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: "Mobile iPhone SE",
      use: { ...devices["iPhone SE"], viewport: { width: 375, height: 667 } },
    },
  ],
  webServer: {
    command:
      "npm run build && npx wrangler pages dev .svelte-kit/cloudflare --compatibility-date=2023-10-30 --port=8788",
    port: 8788,
    timeout: 120000, // 2 minutes for build + start
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
  },
});
