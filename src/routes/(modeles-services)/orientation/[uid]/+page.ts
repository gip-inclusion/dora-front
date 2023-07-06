import type { PageLoad } from "./$types";
import { getOrientation } from "$lib/utils/orientation";
import { error } from "@sveltejs/kit";
import type { SendOrientation } from "../../services/[slug]/orienter/types";

export const load: PageLoad = async ({ params }) => {
  const sendOrientation = await getOrientation(params.uid);

  if (!sendOrientation) {
    throw error(404, "Page Not Found");
  }

  return {
    title: `Demande orientation ${sendOrientation.uid}| DORA`,
    noIndex: true,
    sendOrientation: sendOrientation as SendOrientation,
  };
};
