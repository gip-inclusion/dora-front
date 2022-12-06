import { userInfo } from "$lib/auth";
import { getNewService } from "$lib/components/services/form/utils";
import { getLastDraft, getModel, getServicesOptions } from "$lib/services";
import { getStructures } from "$lib/structures";
import { get } from "svelte/store";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ url, parent, fetch }) => {
  await parent();

  const query = url.searchParams;
  const structureSlug = query.get("structure");
  const modelSlug = query.get("modele");

  const user = get(userInfo);
  let structures = [];

  if (user?.isStaff) {
    structures = await getStructures(fetch);
  } else if (user) {
    structures = user.structures;
  }

  let service;
  let model;

  if (modelSlug) {
    model = await getModel(modelSlug, fetch);
    service = JSON.parse(JSON.stringify(model));
    service.model = modelSlug;
    service.structure = null;
    service.slug = null;
    service.locationKinds = [];
  } else {
    service = getNewService();
  }

  let structure;

  if (structures.length === 1) {
    service.structure = structures[0].slug;
    structure = structures[0];
  } else if (structureSlug) {
    // si la structure est renseignée dans l'URL, force celle-là
    structure = structures.find((s) => s.slug === structureSlug);
    service.structure = structureSlug;
  }

  return {
    lastDraft: await getLastDraft(fetch),
    servicesOptions: await getServicesOptions(fetch, { model }),
    structures,
    structure,
    service,
    model,
  };
};
