import { getServicesOptions } from "$lib/requests/services";
import { getStructuresOptions } from "$lib/requests/structures";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  // TODO: avoid serializing
  const servicesOptions = await getServicesOptions();
  const structuresOptions = await getStructuresOptions();

  return {
    title: "Structures | Administration | DORA",
    noIndex: true,
    servicesOptions,
    structuresOptions,
  };
};
