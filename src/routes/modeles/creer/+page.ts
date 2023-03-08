import { createModelFromService, getNewModel } from "$lib/utils/forms";
import { getService, getServicesOptions } from "$lib/requests/services";
import { userInfo } from "$lib/utils/auth";
import { get } from "svelte/store";
import { getStructure } from "../../../lib/requests/structures";
import type { PageLoad } from "./$types";

// pages authentifiées sur lesquelles la première requête non authentifiée n'a pas de sens
export const ssr = false;

export const load: PageLoad = async ({ url, parent }) => {
  await parent();

  const serviceSlug = url.searchParams.get("service");
  const structureSlug = url.searchParams.get("structure");

  const user = get(userInfo);
  const structures = user.structures;

  let model;

  if (serviceSlug) {
    const service = await getService(serviceSlug);
    model = createModelFromService(service);
    model.slug = null;
    model.structure = null;
    model.service = serviceSlug;
  } else {
    model = getNewModel();
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
  model.structure = structure ? structure.slug : null;

  return {
    title: "Création d’un modèle | DORA",
    noIndex: true,
    model,
    servicesOptions: await getServicesOptions(),
    structures,
    structure,
    serviceSlug,
  };
};
