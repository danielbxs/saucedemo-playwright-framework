import { Page, Locator } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;
  readonly checkoutTitle: Locator;
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly zipCodeField: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;
  readonly closeErrorButton: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;
  readonly summaryContainer: Locator;
  readonly confirmationImage: Locator;
  readonly confirmationHeading: Locator;
  readonly backHomeButton: Locator;
  readonly generatePdfButton: Locator;
  readonly generatingButton: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutTitle = page.getByTestId("title");
    this.firstNameField = page.getByPlaceholder("First Name");
    this.lastNameField = page.getByPlaceholder("Last Name");
    this.zipCodeField = page.getByPlaceholder("Zip/Postal Code");
    this.continueButton = page.getByTestId("continue");
    this.errorMessage = page.getByTestId("error");
    this.closeErrorButton = page.getByTestId("error-button");
    this.cancelButton = page.getByRole("button", { name: "Cancel" });
    this.finishButton = page.getByRole("button", { name: "Finish" });
    this.summaryContainer = page.getByTestId("checkout-summary-container");
    this.confirmationImage = page.getByAltText("Pony Express");
    this.confirmationHeading = page.getByRole("heading", { name: "Thank you for your order!" });
    this.backHomeButton = page.getByRole("button", { name: "Back Home" });
    this.generatePdfButton = page.getByRole("button", { name: "Generate PDF order" });
    this.generatingButton = page.getByRole("button", { name: "Generating..." });
    this.subtotalLabel = page.getByTestId("subtotal-label");
    this.taxLabel = page.getByTestId("tax-label");
    this.totalLabel = page.getByTestId("total-label");
  }

  /**
   * Fills out the checkout information form and clicks the Continue button.
   * @param firstName Customer's first name
   * @param lastName Customer's last name
   * @param zipCode Customer's postal or zip code
   */
  async fillInformation(firstName: string, lastName: string, zipCode: string) {
    await this.firstNameField.fill(firstName);
    await this.lastNameField.fill(lastName);
    await this.zipCodeField.fill(zipCode);
    await this.continueButton.click();
  }
  /**
   * Clicks the cancel button on step one of the checkout process.
   */
  async cancelCheckout() {
    await this.cancelButton.click();
  }

  /**
   * Clicks the button to close the error message popup.
   */
  async closeErrorMessage() {
    await this.closeErrorButton.click();
  }

  /**
   * Clicks the Finish button on the overview step to place the order.
   */
  async finishCheckout() {
    await this.finishButton.click();
  }

  /**
   * Clicks the Back Home button on the confirmation page to return to the product inventory.
   */
  async completeCheckout() {
    await this.backHomeButton.click();
  }

  /**
   * Clicks the button to request a PDF generation of the order summary.
   */
  async generatePdf() {
    await this.generatePdfButton.click();
  }
}
