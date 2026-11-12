import { test as pageTest, expect } from "../fixtures/PageFixtures";
import { test as a11yCheck } from "../fixtures/checka11y";
import {
  valid,
  locked,
  injection,
  invalid,
  negative,
  boundary,
} from "../test-data/users.json";
import { inventoryRegExp } from "../lib/constants";
import { mergeTests } from "@playwright/test";

const test = mergeTests(pageTest, a11yCheck);

test.describe("Login Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("");
  });

  valid.forEach(({ username, password }) => {
    test(`should log in successfully with ${username}`, async ({ page, loginPage }) => {
      await loginPage.logIn(username, password);
      await expect(page).toHaveURL(inventoryRegExp);
    });
  });

  test(`should not be able to log in with ${locked.username}`, async ({
    page,
    loginPage,
  }) => {
    await loginPage.logIn(locked.username, locked.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(locked.errorMessage);
    await expect(page).toHaveURL("/");
  });

  invalid.forEach(({ username, password, errorMessage }) => {
    test(`should display an error message when providing invalid credentials for ${username}`, async ({
      page,
      loginPage,
    }) => {
      await loginPage.logIn(username, password);
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toHaveText(errorMessage);
      await expect(loginPage.closeErrorButton).toBeEnabled();
      await loginPage.closeErrorButton.click();
      await expect(page).toHaveURL("/");
    });
  });

  test("should display an error message when username is empty", async ({
    page,
    loginPage,
  }) => {
    await loginPage.logIn("", valid[0].password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText("Epic sadface: Username is required");
    await expect(loginPage.closeErrorButton).toBeEnabled();
    await loginPage.closeErrorButton.click();
    await expect(page).toHaveURL("/");
  });

  test("should display an error message when password is empty", async ({
    page,
    loginPage,
  }) => {
    await loginPage.logIn(valid[0].username, "");
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText("Epic sadface: Password is required");
    await expect(loginPage.closeErrorButton).toBeEnabled();
    await loginPage.closeErrorButton.click();
    await expect(page).toHaveURL("/");
  });

  test("should reject script-like invalid credentials without executing them", async ({
    page,
    loginPage,
  }) => {
    let dialogOpened = false;

    page.on("dialog", async (dialog) => {
      dialogOpened = true;
      await dialog.dismiss();
    });

    await loginPage.logIn(injection.username, injection.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(injection.errorMessage);
    await expect(loginPage.closeErrorButton).toBeEnabled();
    await loginPage.closeErrorButton.click();
    expect(dialogOpened).toBe(false);
    await expect(page).toHaveURL("/");
  });

  negative.forEach(({ username, password, errorMessage, label }) => {
    test(`should reject ${label}`, async ({ page, loginPage }) => {
      await loginPage.logIn(username, password);
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toHaveText(errorMessage);
      await expect(loginPage.closeErrorButton).toBeEnabled();
      await loginPage.closeErrorButton.click();
      await expect(page).toHaveURL("/");
    });
  });

  boundary.forEach(({ field, username, password, errorMessage }) => {
    test(`should reject invalid credentials with ${field}`, async ({
      page,
      loginPage,
    }) => {
      await loginPage.logIn(username, password);
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toHaveText(errorMessage);
      await expect(loginPage.closeErrorButton).toBeEnabled();
      await loginPage.closeErrorButton.click();
      await expect(page).toHaveURL("/");
    });
  });

  a11yCheck("should meet WCAG 2.1 AA accessibility standards", async ({ axe }) => {
    const wcagResults = await axe().analyze();
    expect(wcagResults.violations).toEqual([]);
  });

  a11yCheck.fail("should meet accessibility best practices", async ({ axe }) => {
    const bestPracticeResults = await axe({ extraTags: ["best-practice"] }).analyze();
    expect(bestPracticeResults.violations).toEqual([]);
  });
});
