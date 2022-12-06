import { browser } from "$app/environment";
import { userInfo } from "$lib/auth";
import { getModel, getService, getServicesOptions } from "$lib/services";
import { getStructure, getStructures } from "$lib/structures";
import { error } from "@sveltejs/kit";
import { get } from "svelte/store";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, parent, fetch }) => {
  await parent();

  const user = get(userInfo);
  const service = await getService(params.slug, fetch);
  let structure = {};
  let structures = [];
  let model = null;

  // on ne retourne une 404 que sur le client
  if (!browser) {
    return { structure, structures, service, servicesOptions: {} };
  }

  if (!service) {
    throw error(404, "Page Not Found");
  }

  structure = await getStructure(service.structure, fetch);

  if (user.isStaff) {
    structures = await getStructures(fetch);
  } else if (user) {
    structures = user.structures;
  }

  if (service.model) {
    model = await getModel(service.model, fetch);
  }

  return {
    service,
    servicesOptions: await getServicesOptions(fetch, { model }),
    structures,
    structure,
    model,
  };
};
