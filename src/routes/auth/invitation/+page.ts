import { getStructure } from "$lib/structures";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ url, parent, fetch }) => {
  await parent();

  const structure = await getStructure(url.searchParams.get("structure"), {
    fetchFct: fetch,
  });
  let structureParent = null;
  if (!structure) {
    throw error(404, "Page Not Found");
  }

  if (structure.parent) {
    structureParent = await getStructure(structure.parent, fetch);
  }

  return { structure, parent: structureParent };
};
