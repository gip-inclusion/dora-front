import { redirect } from "@sveltejs/kit";
import { CANONICAL_URL } from "$lib/env";
import { disconnect } from "$lib/auth";
import { defaultAcceptHeader, getApiURL } from "$lib/utils/api";

export async function load() {
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

    disconnect();
    throw redirect(302, jsonResult.url);
  }
  // TODO: surface error
}