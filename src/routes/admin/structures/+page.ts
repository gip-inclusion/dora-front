import { getServicesOptions } from "$lib/requests/services";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  const servicesOptions = await getServicesOptions();

  return {
    title: "Structures | Administration | DORA",
    noIndex: true,
    servicesOptions,
  };
};
