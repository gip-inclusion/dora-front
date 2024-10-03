// import { CANONICAL_URL } from "$lib/env";
import { defaultAcceptHeader, getApiURL } from "$lib/utils/api";
import { token } from "$lib/utils/auth";
import { redirect } from "@sveltejs/kit";
import { get } from "svelte/store";
import { getNextPage } from "../utils";
import type { PageLoad } from "./$types";

export const ssr = false;

export const load: PageLoad = async ({ url, parent }) => {
  await parent();

  const forceLogin: boolean =
    url.searchParams.get("force_login") === "1" || false;

  const nextPage = getNextPage(url);
  // Si on a déjà un token et qu'on ne force pas le login, on redirige directement sur la destination
  if (get(token) && !forceLogin) {
    redirect(302, nextPage);
  }

  const targetUrl = `${getApiURL()}/oidc/login`;

  // OIDC : problème, le params next_url ne peut être transmis
  // CORS: pourquoi ne pas faire directement le redirect depuis le back et gérer les CORS en front ?

  const result = await fetch(targetUrl, {
    method: "GET",
    headers: {
      Accept: defaultAcceptHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // eslint-disable-next-line camelcase
      loginHint: url.searchParams.get("login_hint") || undefined,
    }),
  });

  if (result.ok) {
    const { url: icUrl, state } = await result.json();
    window.localStorage.setItem("oidcState", state);

    redirect(302, icUrl);
  }
};
