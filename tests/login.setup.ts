import { test as setup } from "@playwright/test";
import { PageManager } from "../pages/PageManager";
import { valid } from "../test-data/users.json";

setup("Set session data", async ({ page }) => {
  const standardUser = valid[0];
  await page.goto("");
  const pm = new PageManager(page);
  await pm.onLoginPage().logIn(standardUser.username, standardUser.password);
  await page.context().storageState({ path: "./.auth/login.json" });
});
