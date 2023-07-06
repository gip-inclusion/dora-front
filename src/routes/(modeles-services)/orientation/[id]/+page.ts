import type { PageLoad } from "./$types";
import { getOrientation } from "$lib/utils/orientation";
import { error } from "@sveltejs/kit";
import type { SendOrientation } from "../../services/[slug]/orienter/types";

export const load: PageLoad = async ({ params }) => {
  const sendOrientation = await getOrientation(params.id);

  if (!sendOrientation) {
    throw error(404, "Page Not Found");
  }

  return {
    title: `Demande d‘orientation ${sendOrientation.id}| DORA`,
    noIndex: true,
    sendOrientation: sendOrientation as SendOrientation,
  };
};
