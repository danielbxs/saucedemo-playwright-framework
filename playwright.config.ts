import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  use: {
    baseURL: "https://www.saucedemo.com/",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    testIdAttribute: "data-test",
  },

  projects: [
    { name: "setup", use: { ...devices["Desktop Chrome"] }, testMatch: /.*\.setup\.ts/ },

    {
      name: "chromium-logged-out-tests",
      testMatch: /.*login.spec.ts/,
      use: { ...devices["Desktop Chrome"], storageState: { cookies: [], origins: [] } },
    },
    {
      name: "chromium-authenticated-tests",
      testIgnore: /.*login.spec.ts/,
      use: { ...devices["Desktop Chrome"], storageState: "./.auth/login.json" },
      dependencies: ["setup"],
    },

    {
      name: "firefox-logged-out-tests",
      testMatch: /.*login.spec.ts/,
      use: { ...devices["Desktop Firefox"], storageState: { cookies: [], origins: [] } },
    },
    {
      name: "firefox-authenticated-tests",
      testIgnore: /.*login.spec.ts/,
      use: { ...devices["Desktop Firefox"], storageState: "./.auth/login.json" },
      dependencies: ["setup"],
    },
  ],
});
