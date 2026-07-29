import { test as setup } from "@playwright/test";
import { PageManager } from "../pages/PageManager";
import users from "../test-data/users.json";

setup("Set session data", async ({ page }) => {
  await page.goto("/");
  const pm = new PageManager(page);
  await pm.onLoginPage().logIn(users.standard.username, users.standard.password);
  await page.context().storageState({ path: "./.auth/login.json" });
});
