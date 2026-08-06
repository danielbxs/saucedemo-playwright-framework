import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PageManager } from "../pages/PageManager";
import { test as checka11yTest } from "../fixtures/checka11y";
import invalidCredentials from "../test-data/invalidCredentials.json";
import users from "../test-data/users.json";

test.describe("Login Functionality", () => {
  let pm: PageManager;
  let axeScan: AxeBuilder;
  test.beforeEach(async ({ page }) => {
    pm = new PageManager(page);
    axeScan = new AxeBuilder({ page });
    await page.goto("/");
  });

  test("should log in successfully with valid credentials", async ({ page }) => {
    await pm.onLoginPage().logIn(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/.*inventory.html$/);
  });

  invalidCredentials.forEach(({ username, password }) => {
    test(`should display an error message when providing invalid credentials for ${username}`, async ({ page }) => {
      await pm.onLoginPage().logIn(username, password);
      await expect(pm.onLoginPage().errorMessage).toBeVisible();
      await expect(pm.onLoginPage().errorMessage).toHaveText("Epic sadface: Username and password do not match any user in this service");
      await expect(pm.onLoginPage().closeErrorButton).toBeEnabled();
      await pm.onLoginPage().closeErrorButton.click();
      await expect(page).toHaveURL("/");
    });
  });

  test("should display an error message for a locked out user", async ({ page }) => {
    await pm.onLoginPage().logIn(users.locked.username, users.locked.password);
    await expect(pm.onLoginPage().errorMessage).toBeVisible();
    await expect(pm.onLoginPage().errorMessage).toHaveText("Epic sadface: Sorry, this user has been locked out.");
    await expect(pm.onLoginPage().closeErrorButton).toBeEnabled();
    await pm.onLoginPage().closeErrorButton.click();
    await expect(page).toHaveURL("/");
  });

  test("should display an error message when username is empty", async ({ page }) => {
    await pm.onLoginPage().logIn("", users.standard.password);
    await expect(pm.onLoginPage().errorMessage).toBeVisible();
    await expect(pm.onLoginPage().errorMessage).toHaveText("Epic sadface: Username is required");
    await expect(pm.onLoginPage().closeErrorButton).toBeEnabled();
    await pm.onLoginPage().closeErrorButton.click();
    await expect(page).toHaveURL("/");
  });

  test("should display an error message when password is empty", async ({ page }) => {
    await pm.onLoginPage().logIn(users.standard.username, "");
    await expect(pm.onLoginPage().errorMessage).toBeVisible();
    await expect(pm.onLoginPage().errorMessage).toHaveText("Epic sadface: Password is required");
    await expect(pm.onLoginPage().closeErrorButton).toBeEnabled();
    await pm.onLoginPage().closeErrorButton.click();
    await expect(page).toHaveURL("/");
  });

  test("should display an error message when injections are input into login fields", async ({ page }) => {
    await pm.onLoginPage().logIn(users.injection.username, users.injection.password);
    await expect(pm.onLoginPage().errorMessage).toBeVisible();
    await expect(pm.onLoginPage().errorMessage).toHaveText("Epic sadface: Username and password do not match any user in this service");
    await expect(pm.onLoginPage().closeErrorButton).toBeEnabled();
    await pm.onLoginPage().closeErrorButton.click();
    await expect(page).toHaveURL("/");
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
