import { getNewService } from "$lib/utils/forms";
import { getModel, getServicesOptions } from "$lib/requests/services";
import { userInfo } from "$lib/utils/auth";
import { get } from "svelte/store";
import { getStructure } from "../../../lib/requests/structures";
import type { PageLoad } from "./$types";

// pages authentifiées sur lesquelles la première requête non authentifiée n'a pas de sens
export const ssr = false;

export const load: PageLoad = async ({ url, parent }) => {
  await parent();

  const query = url.searchParams;
  const structureSlug = query.get("structure");
  const modelSlug = query.get("modele");

  const user = get(userInfo);
  const structures = user.structures;

  let service;
  let model;

  if (modelSlug) {
    model = await getModel(modelSlug);
    service = JSON.parse(JSON.stringify(model));
    service.model = modelSlug;
    service.structure = null;
    service.slug = null;
    service.locationKinds = [];
  } else {
    service = getNewService();
  }

  let structure;

  if (structureSlug) {
    structure = structures.find((struct) => struct.slug === structureSlug);
    if (!structure) {
      structure = await getStructure(structureSlug);
      if (structure) {
        structures.push(structure);
      }
    }
  } else if (structures.length === 1) {
    structure = structures[0];
  }
  service.structure = structure ? structure.slug : null;

  return {
    noIndex: true,
    title: "Création d'un service | DORA",
    servicesOptions: await getServicesOptions(),
    structures,
    structure,
    service,
    model,
  };
};
