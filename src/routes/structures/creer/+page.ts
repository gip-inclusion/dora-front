import { getStructuresOptions } from "$lib/structures";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent, fetch }) => {
  await parent();

  return { structuresOptions: await getStructuresOptions(fetch) };
};
