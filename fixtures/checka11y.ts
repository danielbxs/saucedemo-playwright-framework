import { test as base } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

type AxeFixture = { axe: (options?: { extraTags?: string[] }) => AxeBuilder };

export const test = base.extend<AxeFixture>({
  axe: async ({ page }, use) => {
    await use((options) => {
      const defaultTags = ["wcag21a", "wcag21aa"];

      return new AxeBuilder({ page }).withTags([...defaultTags, ...(options?.extraTags ?? [])]);
    });
  },
});
