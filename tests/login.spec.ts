import { test, expect } from "@playwright/test";
import { PageManager } from "../pages/PageManager";
import invalidCredentials from "../test-data/invalidCredentials.json";
import users from "../test-data/users.json";

test.describe("Login Functionality", () => {
  let pm: PageManager;
  test.beforeEach(async ({ page }) => {
    pm = new PageManager(page);
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
});
