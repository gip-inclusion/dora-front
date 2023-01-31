import { expect, test } from "@playwright/test";
import { mockServiceOptions } from "../mocks/mockServiceOptions.ts";
import { HOME_SELECTORS, HOME_URL } from "../pages/home.ts";

test.describe("La page d'accueil", () => {
  test.beforeEach(async ({ context, page }) => {
    await context.route("**/services-options/", (route) =>
      route.fulfill({
        body: JSON.stringify(mockServiceOptions),
      })
    );

    await page.goto(HOME_URL);
    await page.waitForSelector(HOME_SELECTORS.SEARCH_FORM);
  });

  test("a le bon titre", async ({ page }) => {
    const title = await page.locator("h1").innerText();
    expect(title?.trim()).toEqual(
      "Identifiez rapidement les services d’insertion adaptés aux besoins de vos bénéficiaires"
    );
  });

  /*
  // FIXME: obsolete test...
  test("a les bons libellés pour le formulaire de recherche", async ({
    page,
  }) => {
    const formLabels = await page
      .locator(HOME_SELECTORS.FORM_LABELS)
      .allInnerTexts();

    expect(formLabels.length).toBe(2);
    expect(await formLabels[0]).toBe("Lieu");
    expect(await formLabels[1]).toBe("Besoins");
  });
  */
});
