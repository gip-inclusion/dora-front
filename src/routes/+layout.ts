import { browser } from "$app/environment";
import {
  disconnect,
  userInfo,
  validateCredsAndFillUserInfo,
} from "$lib/utils/auth";
import { redirect } from "@sveltejs/kit";
import dayjs from "dayjs";
import { get } from "svelte/store";
import type { LayoutLoad } from "./$types";

export const prerender = false;

function tokenWillExpireSoon(tokenExpirationString: string): boolean {
  const tokenExpirationDate = dayjs(tokenExpirationString);
  if (!tokenExpirationDate.isValid()) {
    // Impossible de parser la date d'expiration -- on considère que
    // le token est invalide
    return true;
  }
  const minimalValidityDate = dayjs().add(1, "days");
  return tokenExpirationDate.isBefore(minimalValidityDate);
}

export const load: LayoutLoad = async ({ url, depends }) => {
  if (!browser) {
    // On ne fait pas d'authentification coté serveur
    // => on peut court-circuiter les vérifications ici
    return {};
  }

  // On veut vérifier le token à chaque changement de page
  depends(url.pathname);

  let currentUserInfo = get(userInfo);
  if (!currentUserInfo) {
    await validateCredsAndFillUserInfo();
    currentUserInfo = get(userInfo);
  }

  // Si l'utilisateur est connecté, mais que son token expire dans moins de 24h,
  // on force une deconnexion, afin qu'il récupère un token frais dès qu'il en aura besoin.
  if (currentUserInfo && tokenWillExpireSoon(currentUserInfo.tokenExpiration)) {
    // logout and reload page
    disconnect();
    window.location.reload();
  }

  // Si l'utilisateur existe mais n'est rattaché à aucune structure,
  // on le force à se rattacher
  if (
    currentUserInfo &&
    !(
      currentUserInfo.structures.length ||
      currentUserInfo.pendingStructures.length
    ) &&
    !url.pathname.startsWith("/auth/rattachement") &&
    !url.pathname.startsWith("/auth/invitation") &&
    !url.pathname.startsWith("/auth/deconnexion")
  ) {
    throw redirect(302, "/auth/rattachement");
  }

  return {};
};
