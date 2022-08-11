import { expect, test } from "@playwright/test";

import { createFakeService } from "../../mocks/mockService.js";
import { createFakeUser } from "../../mocks/mockUser.js";
import {
  SERVICE_SELECTORS,
  mockServiceRequest,
  goToServicePage,
} from "../../pages/service.js";
import { mockUserInfoRequest } from "../../pages/common.js";

test.describe("Page service", () => {
  // *** Affichage correct
  test.describe("Affichage correct", () => {
    test("affiche le bon titre", async ({ page, context }) => {
      const SERVICE_NAME = "Mon service";
      const SERVICE = createFakeService({ name: SERVICE_NAME });

      await mockServiceRequest(context, SERVICE);
      await goToServicePage(page, SERVICE);

      const title = await page.textContent(SERVICE_SELECTORS.HEADER_TITLE);
      expect(title).toEqual(SERVICE_NAME);
    });

    test("affiche le bon status", async ({ page, context }) => {
      const SERVICE = createFakeService({ isAvailable: true });

      await mockServiceRequest(context, SERVICE);
      await goToServicePage(page, SERVICE);

      const availability = await page.textContent(
        SERVICE_SELECTORS.AVAILIBILITY
      );
      expect(availability?.trim()).toEqual("Service disponible");
    });
  });

  // *** Actualisation Actualisation côté offreur
  test.describe("Actualisation côté offreur", () => {
    test("actualisation récente", async ({ page, context }) => {
      const today = new Date();

      const SERVICE = createFakeService({
        creationDate: today.toUTCString(),
        modificationDate: today.toUTCString(),
      });

      await mockServiceRequest(context, SERVICE);
      await goToServicePage(page, SERVICE);

      const updateLabel = await page.textContent(
        SERVICE_SELECTORS.UPDATE_STATUS_LABEL
      );
      expect(updateLabel?.trim()).toEqual("Actualisé aujourd'hui");

      // Bouton de suggestion visible
      const suggestUpdateButtonText = await page.textContent(
        SERVICE_SELECTORS.UPDATE_STATUS_SUGGEST_BUTTON
      );
      expect(suggestUpdateButtonText?.trim()).toEqual(
        "Suggérer une modification"
      );
    });

    test("aucune actualisation depuis 7 mois", async ({ page, context }) => {
      const MONTH_DIFF = 7;
      const oldDate = new Date();
      oldDate.setMonth(oldDate.getMonth() - MONTH_DIFF);

      const SERVICE = createFakeService({
        creationDate: oldDate.toUTCString(),
        modificationDate: oldDate.toUTCString(),
      });

      await mockServiceRequest(context, SERVICE);
      await goToServicePage(page, SERVICE);

      const updateLabel = await page.textContent(
        SERVICE_SELECTORS.UPDATE_STATUS_LABEL
      );
      expect(updateLabel?.trim()).toContain(
        `Actualisé il y a ${MONTH_DIFF} mois`
      );

      // Bouton de suggestion visible
      const suggestUpdateButtonText = await page.textContent(
        SERVICE_SELECTORS.UPDATE_STATUS_SUGGEST_BUTTON
      );
      expect(suggestUpdateButtonText?.trim()).toEqual(
        "Suggérer une modification"
      );
    });

    test("aucune actualisation depuis plus depuis 2020", async ({
      page,
      context,
    }) => {
      const oldDate = new Date(2020, 1, 1);

      const SERVICE = createFakeService({
        creationDate: oldDate.toUTCString(),
        modificationDate: oldDate.toUTCString(),
      });

      await mockServiceRequest(context, SERVICE);
      await goToServicePage(page, SERVICE);

      const updateLabel = await page.textContent(
        SERVICE_SELECTORS.UPDATE_STATUS_LABEL
      );
      expect(updateLabel?.trim()).toContain(
        "Service en attente d’actualisation"
      );

      // Bouton de suggestion visible
      const suggestUpdateButtonText = await page.textContent(
        SERVICE_SELECTORS.UPDATE_STATUS_SUGGEST_BUTTON
      );
      expect(suggestUpdateButtonText?.trim()).toEqual(
        "Suggérer une modification"
      );
    });
  });

  // *** Actualisation Actualisation côté administrateur
  test.describe("Actualisation côté administrateur", () => {
    const STRUCTURE_SLUG = "STRUCTURE_SLUG";
    const STRUCTURE_NAME = "STRUCTURE_NAME";
    const USER = createFakeUser({
      structures: [{ slug: STRUCTURE_SLUG, name: STRUCTURE_NAME }],
    });

    test.beforeEach(async ({ page, context }) => {
      await page.addInitScript(() => {
        window.localStorage.setItem("token", "FAKE_TOKEN");
      });

      await mockUserInfoRequest(context, USER);
    });

    test("actualisation récente", async ({ page, context }) => {
      const today = new Date();

      const SERVICE = createFakeService({
        canWrite: true,
        creationDate: today.toUTCString(),
        modificationDate: today.toUTCString(),
        structureSlug: STRUCTURE_SLUG,
        structureName: STRUCTURE_NAME,
      });

      await mockServiceRequest(context, SERVICE);
      await goToServicePage(page, SERVICE);

      const updateLabel = await page.textContent(
        SERVICE_SELECTORS.UPDATE_STATUS_LABEL
      );
      expect(updateLabel?.trim()).toEqual("Actualisé aujourd'hui");

      // Bouton de modification visible
      const updateButtonText = await page.textContent(
        SERVICE_SELECTORS.UPDATE_BUTTON
      );
      expect(updateButtonText?.trim()).toEqual("Modifier");

      // Bouton de modification du status du service
      const updateServiceStateButtonText = await page.textContent(
        SERVICE_SELECTORS.SERVICE_STATE_UPDATE
      );
      expect(updateServiceStateButtonText?.trim()).toContain(
        "Statut du service"
      );
      expect(updateServiceStateButtonText?.trim()).toContain("Publié");
    });

    test("aucune actualisation depuis 7 mois", async ({ page, context }) => {
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

      await mockServiceRequest(context, SERVICE);
      await goToServicePage(page, SERVICE);

      const updateLabel = await page.textContent(
        SERVICE_SELECTORS.UPDATE_STATUS_LABEL
      );
      expect(updateLabel?.trim()).toContain("Actualisé il y a 7 mois");
      expect(updateLabel?.trim()).toContain(
        "Vérifiez et/ou actualisez les informations de ce service"
      );

      // Bouton de modification visible
      const updateButtonText = await page.textContent(
        SERVICE_SELECTORS.UPDATE_BUTTON
      );
      expect(updateButtonText?.trim()).toEqual("Modifier");

      // Bouton de modification du status du service
      const updateServiceStateButtonText = await page.textContent(
        SERVICE_SELECTORS.SERVICE_STATE_UPDATE
      );
      expect(updateServiceStateButtonText?.trim()).toContain(
        "Statut du service"
      );
      expect(updateServiceStateButtonText?.trim()).toContain("Publié");
    });

    test("aucune actualisation depuis plus depuis 2020", async ({
      page,
      context,
    }) => {
      const oldDate = new Date(2020, 1, 1);

      const SERVICE = createFakeService({
        canWrite: true,
        structureSlug: STRUCTURE_SLUG,
        structureName: STRUCTURE_NAME,
        creationDate: oldDate.toUTCString(),
        modificationDate: oldDate.toUTCString(),
      });
      await mockServiceRequest(context, SERVICE);
      await goToServicePage(page, SERVICE);

      const updateLabel = await page.textContent(
        SERVICE_SELECTORS.UPDATE_STATUS_LABEL
      );
      expect(updateLabel?.trim()).toContain(
        "Service en attente d’actualisation"
      );
      expect(updateLabel?.trim()).toContain(
        "Les informations sur ce service ne sont plus mis à jour"
      );

      // Bouton de modification visible
      const updateButtonText = await page.textContent(
        SERVICE_SELECTORS.UPDATE_BUTTON
      );
      expect(updateButtonText?.trim()).toEqual("Modifier");

      // Bouton de modification du status du service
      const updateServiceStateButtonText = await page.textContent(
        SERVICE_SELECTORS.SERVICE_STATE_UPDATE
      );
      expect(updateServiceStateButtonText?.trim()).toContain(
        "Statut du service"
      );
      expect(updateServiceStateButtonText?.trim()).toContain("Publié");
    });
  });
});
