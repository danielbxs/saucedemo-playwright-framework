import { test as setup } from "../fixtures/PageFixtures";
import { valid } from "../test-data/users.json";

setup("Set session data", async ({ page, loginPage }) => {
  const standardUser = valid[0];
  await page.goto("");
  await loginPage.logIn(standardUser.username, standardUser.password);
  await page.context().storageState({ path: "./.auth/login.json" });
});
