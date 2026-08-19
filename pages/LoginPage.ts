import { Page, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly closeErrorButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.getByRole("textbox", { name: "Username" });
    this.passwordField = page.getByRole("textbox", { name: "Password" });
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.errorMessage = page.getByTestId("error");
    this.closeErrorButton = page.getByTestId("error-button");
  }

  /**
   * Logs the user into the website.
   * @param username a username from the list of accepted usernames
   * @param password a password e.g. "password123"
   */

  async logIn(username: string, password: string) {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }
  // /**
  //  * Fills the username field on the login page
  //  * @param username a username string
  //  */
  // async fillUsername(username: string) {
  //   await this.usernameField.fill(username);
  // }

  // /**
  //  * Fills the password field on the login page
  //  * @param password a password string
  //  */
  // async fillPassword(password: string) {
  //   await this.passwordField.fill(password);
  // }
}
