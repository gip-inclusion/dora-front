import { userInfo } from "$lib/auth";
import {
  createModelFromService,
  getNewModel,
} from "$lib/components/services/form/utils";
import { getService, getServicesOptions } from "$lib/services";
import { getStructures } from "$lib/structures";
import { get } from "svelte/store";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ url, parent, fetch }) => {
  await parent();

  const serviceSlug = url.searchParams.get("service");
  const structureSlug = url.searchParams.get("structure");

  const user = get(userInfo);
  let structures = [];

  if (user?.isStaff) {
    structures = await getStructures(fetch);
  } else if (user) {
    structures = user.structures;
  }

  let model;

  if (serviceSlug) {
    const service = await getService(serviceSlug, fetch);
    model = createModelFromService(service);
    model.slug = null;
    model.structure = null;
    model.service = serviceSlug;
  } else {
    model = getNewModel();
  }

  let structure;

  if (structures.length === 1) {
    model.structure = structures[0].slug;
    structure = structures[0];
  } else if (structureSlug) {
    structure = structures.find((s) => s.slug === structureSlug);
    model.structure = structureSlug;
  }

  return {
    model,
    servicesOptions: await getServicesOptions(fetch, { model }),
    structures,
    structure,
    serviceSlug,
  };
};
