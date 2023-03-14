import { browser } from "$app/environment";
import { getService, getServicesOptions } from "$lib/requests/services";
import { getStructure } from "$lib/requests/structures";
import { error, redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const ssr = false;
export const load: PageLoad = async ({ url, params, parent }) => {
  await parent();
  const request = await getService(params.slug);
  const service = request.data;
  if (!service) {
    if (!browser) {
      return {
        service,
      };
    }
    switch (request.status) {
      case 401:
        // vous devez vous connecter + bouton de redirection vers la auth.
        throw redirect(
          302,
          `/auth/connexion?next=${encodeURIComponent(
            url.pathname + url.search
          )}`
        );
        break;
      case 403:
        // on redirige vers le tableau de bord de la structure, avec une notification (même message, mais pour les utilisateurs non connectés peut-etre dire qu’il est peut-être privé?)
        throw error(403, "Page Not Found");
        break;
      case 404:
        // 404 (“le service n'existe plus ou n'est plus disponible“) + bouton de redirection vers la HP.
        throw error(404, "Page Not Found");
        break;
      default:
        return {
          service: null,
        };
        break;
    }
  }
  return {
    title: `${service.name} | ${service.structureInfo.name} | DORA`,
    description: service.shortDesc,
    service,
    structure: await getStructure(service.structure),
    servicesOptions: await getServicesOptions(),
  };
};
