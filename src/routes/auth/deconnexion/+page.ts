import { disconnect } from "$lib/auth";
import { CANONICAL_URL } from "$lib/env";
import { defaultAcceptHeader, getApiURL } from "$lib/utils/api";
import { redirect } from "@sveltejs/kit";

export async function load({ parent }) {
  await parent();

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
