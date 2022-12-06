import { getServicesOptions } from "$lib/services";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent, fetch }) => {
  await parent();
  return {
    servicesOptions: await getServicesOptions(fetch),
  };
};
