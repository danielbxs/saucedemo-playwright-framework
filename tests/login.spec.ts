import { test, expect } from "@playwright/test";
import { PageManager } from "../pages/PageManager";
import { test as checka11yTest } from "../fixtures/checka11y";
import { valid, locked, injection, invalid, negative, boundary } from "../test-data/users.json";
import { inventoryRegExp } from "../lib/constants";

test.describe("Login Functionality", () => {
  let pm: PageManager;
  test.beforeEach(async ({ page }) => {
    pm = new PageManager(page);
    await page.goto("");
  });

  valid.forEach(({ username, password }) => {
    test(`should log in successfully with ${username}`, async ({ page }) => {
      await pm.onLoginPage().logIn(username, password);
      await expect(page).toHaveURL(inventoryRegExp);
    });
  });

  test(`should not be able to log in with ${locked.username}`, async ({ page }) => {
    await pm.onLoginPage().logIn(locked.username, locked.password);
    await expect(pm.onLoginPage().errorMessage).toBeVisible();
    await expect(pm.onLoginPage().errorMessage).toHaveText(locked.errorMessage);
    await expect(page).toHaveURL("/");
  });

  invalid.forEach(({ username, password, errorMessage }) => {
    test(`should display an error message when providing invalid credentials for ${username}`, async ({ page }) => {
      await pm.onLoginPage().logIn(username, password);
      await expect(pm.onLoginPage().errorMessage).toBeVisible();
      await expect(pm.onLoginPage().errorMessage).toHaveText(errorMessage);
      await expect(pm.onLoginPage().closeErrorButton).toBeEnabled();
      await pm.onLoginPage().closeErrorButton.click();
      await expect(page).toHaveURL("/");
    });
  });

  test("should display an error message when username is empty", async ({ page }) => {
    await pm.onLoginPage().logIn("", valid[0].password);
    await expect(pm.onLoginPage().errorMessage).toBeVisible();
    await expect(pm.onLoginPage().errorMessage).toHaveText("Epic sadface: Username is required");
    await expect(pm.onLoginPage().closeErrorButton).toBeEnabled();
    await pm.onLoginPage().closeErrorButton.click();
    await expect(page).toHaveURL("/");
  });

  test("should display an error message when password is empty", async ({ page }) => {
    await pm.onLoginPage().logIn(valid[0].username, "");
    await expect(pm.onLoginPage().errorMessage).toBeVisible();
    await expect(pm.onLoginPage().errorMessage).toHaveText("Epic sadface: Password is required");
    await expect(pm.onLoginPage().closeErrorButton).toBeEnabled();
    await pm.onLoginPage().closeErrorButton.click();
    await expect(page).toHaveURL("/");
  });

  test.fixme("should display an error message when injections are input into login fields", async ({ page }) => {
    await pm.onLoginPage().logIn(injection.username, injection.password);
    await expect(pm.onLoginPage().errorMessage).toBeVisible();
    await expect(pm.onLoginPage().errorMessage).toHaveText(injection.errorMessage);
    await expect(pm.onLoginPage().closeErrorButton).toBeEnabled();
    await pm.onLoginPage().closeErrorButton.click();
    await expect(page).toHaveURL("/");
  });

  negative.forEach(({ username, password, errorMessage }) => {
    test.fixme(`negative tests ${username}`, async ({ page }) => {
      await pm.onLoginPage().logIn(username, password);
      await expect(pm.onLoginPage().errorMessage).toBeVisible();
      await expect(pm.onLoginPage().errorMessage).toHaveText(errorMessage);
      await expect(pm.onLoginPage().closeErrorButton).toBeEnabled();
      await pm.onLoginPage().closeErrorButton.click();
      await expect(page).toHaveURL("/");
    });
  });

  boundary.forEach(({ field, username, password, errorMessage }) => {
    test.fixme(`should validate field lengths for ${field}`, async ({ page }) => {
      await pm.onLoginPage().logIn(username, password);
      await expect(pm.onLoginPage().errorMessage).toBeVisible();
      await expect(pm.onLoginPage().errorMessage).toHaveText(errorMessage);
      await expect(pm.onLoginPage().closeErrorButton).toBeEnabled();
      await pm.onLoginPage().closeErrorButton.click();
      await expect(page).toHaveURL("/");
    });
  });

  checka11yTest("should meet WCAG 2.1 AA accessibility standards", async ({ axe }) => {
    const wcagResults = await axe().analyze();
    expect(wcagResults.violations).toEqual([]);
  });

  checka11yTest.fixme("should meet accessibility best practices", async ({ axe }) => {
    const bestPracticeResults = await axe({ extraTags: ["best-practice"] }).analyze();
    expect(bestPracticeResults.violations).toEqual([]);
  });
});
