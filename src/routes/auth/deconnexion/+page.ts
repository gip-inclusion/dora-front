import { browser } from "$app/environment";
import { disconnect } from "$lib/auth";
import { CANONICAL_URL } from "$lib/env";
import { defaultAcceptHeader, getApiURL } from "$lib/utils/api";
import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent, fetch }) => {
  await parent();
  console.log("logout load", browser);

  const response = await fetch("/auth/deconnexion", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  });
  console.log(response);
  // TODO check response, and if OK continue

  const targetUrl = `${getApiURL()}/inclusion-connect-get-logout-info/`;
  const result = await fetch(targetUrl, {
    method: "POST",
    headers: {
      Accept: defaultAcceptHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      redirect_uri: CANONICAL_URL,
    }),
  });
  let jsonResult = {};

  if (result.ok) {
    jsonResult = await result.json();
    console.log(jsonResult);
    disconnect();
    throw redirect(302, jsonResult.url);
  }
  // TODO: surface error
};
