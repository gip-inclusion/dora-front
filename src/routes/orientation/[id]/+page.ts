import type { PageLoad } from "./$types";
import { getOrientation } from "$lib/utils/orientation";
import { error } from "@sveltejs/kit";
import type { SendOrientation } from "$lib/types";

export const load: PageLoad = async ({ params }) => {
  const orientation = await getOrientation(params.id);

  if (!orientation) {
    throw error(404, "Page Not Found");
  }

  return {
    title: `Demande d’orientation ${orientation.queryId}| DORA`,
    noIndex: true,
    orientation: orientation as SendOrientation,
  };
};
