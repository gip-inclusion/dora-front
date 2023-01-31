import { expect, test } from "@playwright/test";
import { createFakeService } from "../../mocks/mockService.ts";
import { createFakeStructure } from "../../mocks/mockStructure.ts";
import { createFakeUser } from "../../mocks/mockUser.ts";
import { mockServiceOptions } from "../../mocks/mockServiceOptions.ts";
import { mockUserInfoRequest } from "../../pages/common.ts";
import {
  goToServicePage,
  mockGetServiceResponse,
  mockGetStructureResponse,
  SERVICE_SELECTORS,
} from "../../pages/service.js";

test.describe("Page service", () => {
  test.beforeEach(async ({ context }) => {
    await context.route("**/services-options/", (route) =>
      route.fulfill({
        body: JSON.stringify(mockServiceOptions),
      })
    );
  });

  // *** Affichage correct
  test.describe("Affichage correct", () => {
    test("affiche le bon titre", async ({ page, context }) => {
      // ÉTANT DONNÉ un service
      const SERVICE_NAME = "Mon service";
      const SERVICE = createFakeService({ name: SERVICE_NAME });
      const STRUCTURE = createFakeStructure({ name: SERVICE.structure });

      // SI je vais sur la page service
      await mockGetServiceResponse(context, SERVICE);
      await mockGetStructureResponse(context, STRUCTURE);
      await goToServicePage(page, SERVICE);

      // ALORS son nom s'affiche correctement
      const title = await page
        .locator(SERVICE_SELECTORS.HEADER_TITLE)
        .innerText();
      expect(title).toEqual(SERVICE_NAME);
    });
  });

  // *** Actualisation côté offreur
  test.describe("Actualisation côté offreur", () => {
    test("actualisation récente", async ({ page, context }) => {
      // ÉTANT DONNÉ un service actualisé récemment
      // ET en tant qu'utilisateur non connecté
      const today = new Date();

      const SERVICE = createFakeService({
        creationDate: today.toUTCString(),
        modificationDate: today.toUTCString(),
      });
      const STRUCTURE = createFakeStructure({ name: SERVICE.structure });

      // SI je vais sur la page service
      await mockGetServiceResponse(context, SERVICE);
      await mockGetStructureResponse(context, STRUCTURE);
      await goToServicePage(page, SERVICE);

      // ALORS le service est affiché comme actualisé récemment
      const updateLabel = await page
        .locator(SERVICE_SELECTORS.UPDATE_STATUS_LABEL)
        .innerText();
      expect(updateLabel?.trim()).toEqual("Actualisé aujourd'hui");

      // ET le bouton pour suggérer une modification est visible
      const suggestUpdateButtonText = await page
        .locator(SERVICE_SELECTORS.UPDATE_STATUS_SUGGEST_BUTTON)
        .innerText();
      expect(suggestUpdateButtonText?.trim()).toEqual(
        "Suggérer une modification"
      );
    });

    test("aucune actualisation depuis 6 mois", async ({ page, context }) => {
      // ÉTANT DONNÉ un service actualisé il y a 6 mois
      // ET en tant qu'utilisateur non connecté
      const MONTH_DIFF = 7;
      const oldDate = new Date();
      oldDate.setMonth(oldDate.getMonth() - MONTH_DIFF);

      const SERVICE = createFakeService({
        creationDate: oldDate.toUTCString(),
        modificationDate: oldDate.toUTCString(),
      });
      const STRUCTURE = createFakeStructure({ name: SERVICE.structure });

      // SI je vais sur la page service
      await mockGetServiceResponse(context, SERVICE);
      await mockGetStructureResponse(context, STRUCTURE);
      await goToServicePage(page, SERVICE);

      // ALORS le service est affiché comme étant actualisé il y a 6 mois
      const updateLabel = await page
        .locator(SERVICE_SELECTORS.UPDATE_STATUS_LABEL)
        .innerText();
      expect(updateLabel?.trim()).toContain(
        `Actualisé il y a ${MONTH_DIFF - 1} mois`
      );

      // ET le bouton pour suggérer une modification est visible
      const suggestUpdateButtonText = await page
        .locator(SERVICE_SELECTORS.UPDATE_STATUS_SUGGEST_BUTTON)
        .innerText();
      expect(suggestUpdateButtonText?.trim()).toEqual(
        "Suggérer une modification"
      );
    });

    test("aucune actualisation depuis plus depuis 2020", async ({
      page,
      context,
    }) => {
      // ÉTANT DONNÉ un service actualisé il y a longtemps
      // ET en tant qu'utilisateur non connecté
      const oldDate = new Date(2020, 1, 1);

      const SERVICE = createFakeService({
        creationDate: oldDate.toUTCString(),
        modificationDate: oldDate.toUTCString(),
      });
      const STRUCTURE = createFakeStructure({ name: SERVICE.structure });

      // SI je vais sur la page service
      await mockGetServiceResponse(context, SERVICE);
      await mockGetStructureResponse(context, STRUCTURE);
      await goToServicePage(page, SERVICE);

      // ALORS le service est affiché comme étant actualisé il y a longtemps
      const updateLabel = await page
        .locator(SERVICE_SELECTORS.UPDATE_STATUS_LABEL)
        .innerText();
      expect(updateLabel?.trim()).toContain(
        "Service en attente d’actualisation"
      );

      // ET le bouton pour suggérer une modification est visible
      const suggestUpdateButtonText = await page
        .locator(SERVICE_SELECTORS.UPDATE_STATUS_SUGGEST_BUTTON)
        .innerText();
      expect(suggestUpdateButtonText?.trim()).toEqual(
        "Suggérer une modification"
      );
    });
  });

  // *** Actualisation côté administrateur
  test.describe("Actualisation côté administrateur", () => {
    // Création d'un utilisateur gérant une structure
    const STRUCTURE_SLUG = "STRUCTURE_SLUG";
    const STRUCTURE_NAME = "STRUCTURE_NAME";
    const USER = createFakeUser({
      structures: [{ slug: STRUCTURE_SLUG, name: STRUCTURE_NAME }],
    });

    test.beforeEach(async ({ page, context }) => {
      // Faux token pour l'authentification
      await page.addInitScript(() => {
        window.localStorage.setItem("token", "FAKE_TOKEN");
      });

      await mockUserInfoRequest(context, USER);
    });

    test("actualisation récente", async ({ page, context }) => {
      // ÉTANT DONNÉ un service actualisé récemment
      // ET en tant qu'utilisateur gérant la structure
      const today = new Date();

      const SERVICE = createFakeService({
        canWrite: true,
        creationDate: today.toUTCString(),
        modificationDate: today.toUTCString(),
        structureSlug: STRUCTURE_SLUG,
        structureName: STRUCTURE_NAME,
      });
      const STRUCTURE = createFakeStructure({ name: SERVICE.structure });

      // SI je vais sur la page service
      await mockGetServiceResponse(context, SERVICE);
      await mockGetStructureResponse(context, STRUCTURE);
      await goToServicePage(page, SERVICE);

      // ALORS le service est affiché comme actualisé récemment
      const updateLabel = await page
        .locator(SERVICE_SELECTORS.UPDATE_STATUS_LABEL)
        .innerText();
      expect(updateLabel?.trim()).toEqual("Actualisé aujourd'hui");

      // ET le bouton de mise à jour est visible
      const updateButtonText = await page
        .locator(SERVICE_SELECTORS.UPDATE_BUTTON)
        .innerText();
      expect(updateButtonText?.trim()).toEqual("Modifier");

      // ET le bouton de modification du status du service est visible
      const updateServiceStateButtonText = await page
        .locator(SERVICE_SELECTORS.SERVICE_STATE_UPDATE)
        .innerText();
      expect(updateServiceStateButtonText?.trim()).toContain(
        "Statut du service"
      );
      expect(updateServiceStateButtonText?.trim()).toContain("Publié");
    });

    test("aucune actualisation depuis 6 mois", async ({ page, context }) => {
      // ÉTANT DONNÉ un service actualisé il y a 6 mois
      // ET en tant qu'utilisateur gérant la structure
      const MONTH_DIFF = 7;
      const oldDate = new Date();
      oldDate.setMonth(oldDate.getMonth() - MONTH_DIFF);

      const SERVICE = createFakeService({
        canWrite: true,
        structureSlug: STRUCTURE_SLUG,
        structureName: STRUCTURE_NAME,
        creationDate: oldDate.toUTCString(),
        modificationDate: oldDate.toUTCString(),
      });
      const STRUCTURE = createFakeStructure({ name: SERVICE.structure });

      // SI je vais sur la page service
      await mockGetServiceResponse(context, SERVICE);
      await mockGetStructureResponse(context, STRUCTURE);
      await goToServicePage(page, SERVICE);

      // ALORS le service est affiché comme étant actualisé il y a 6 mois
      const updateLabel = await page
        .locator(SERVICE_SELECTORS.UPDATE_STATUS_LABEL)
        .innerText();
      expect(updateLabel?.trim()).toContain("Actualisé il y a 6 mois");
      expect(updateLabel?.trim()).toContain(
        "Vérifiez et/ou actualisez les informations de ce service"
      );

      // ET le bouton de mise à jour est visible
      const updateButtonText = await page
        .locator(SERVICE_SELECTORS.UPDATE_BUTTON)
        .innerText();
      expect(updateButtonText?.trim()).toEqual("Modifier");

      // ET le bouton de modification du status du service est visible
      const updateServiceStateButtonText = await page
        .locator(SERVICE_SELECTORS.SERVICE_STATE_UPDATE)
        .innerText();
      expect(updateServiceStateButtonText?.trim()).toContain(
        "Statut du service"
      );
      expect(updateServiceStateButtonText?.trim()).toContain("Publié");
    });

    test("aucune actualisation depuis plus depuis 2020", async ({
      page,
      context,
    }) => {
      // ÉTANT DONNÉ un service actualisé il y a longtemps
      // ET en tant qu'utilisateur gérant la structure
      const oldDate = new Date(2020, 1, 1);

      const SERVICE = createFakeService({
        canWrite: true,
        structureSlug: STRUCTURE_SLUG,
        structureName: STRUCTURE_NAME,
        creationDate: oldDate.toUTCString(),
        modificationDate: oldDate.toUTCString(),
      });
      const STRUCTURE = createFakeStructure({ name: SERVICE.structure });

      // SI je vais sur la page service
      await mockGetServiceResponse(context, SERVICE);
      await mockGetStructureResponse(context, STRUCTURE);
      await goToServicePage(page, SERVICE);

      // ALORS le service est affiché comme étant actualisé il y a longtemps
      const updateLabel = await page
        .locator(SERVICE_SELECTORS.UPDATE_STATUS_LABEL)
        .innerText();
      expect(updateLabel?.trim()).toContain("Actualisation requise");
      expect(updateLabel?.trim()).toContain(
        "Ce service est dépriorisé dans les résultats de recherche, il doit être actualisé pour gagner à nouveau en visibilité"
      );

      // ET le bouton de mise à jour est visible
      const updateButtonText = await page
        .locator(SERVICE_SELECTORS.UPDATE_BUTTON)
        .innerText();
      expect(updateButtonText?.trim()).toEqual("Modifier");

      // ET le bouton de modification du status du service est visible
      const updateServiceStateButtonText = await page
        .locator(SERVICE_SELECTORS.SERVICE_STATE_UPDATE)
        .innerText();

      expect(updateServiceStateButtonText?.trim()).toContain(
        "Statut du service"
      );
      expect(updateServiceStateButtonText?.trim()).toContain("Publié");
    });
  });
});
