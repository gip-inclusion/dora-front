import type { PageLoad } from "./$types";
import { getServicesOptions } from "$lib/requests/services";
import { getOrientation } from "$lib/utils/orientation";
import type { SendOrientation } from "../../services/[slug]/orienter/types";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ params }) => {
  const sendOrientation = await getOrientation(params.uid);

  if (!sendOrientation) {
    throw error(404, "Page Not Found");
  }

  return {
    title: `Demande orientation ${sendOrientation.id}| DORA`,
    sendOrientation: sendOrientation as SendOrientation,
    servicesOptions: await getServicesOptions(),
  };
};
