import { defaultAcceptHeader, getApiURL } from "$lib/utils/api";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, fetch }) => {
  const { key } = await request.json();
  const apiResponse = await fetch(`${getApiURL()}/auth/user-info/`, {
    method: "POST",
    headers: {
      Accept: defaultAcceptHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key: key }),
  });
  if (apiResponse.status === 200) {
    const response = new Response(JSON.stringify(await apiResponse.json()), {
      headers: { "set-cookie": `server-token=${key}; Path=/; HttpOnly` },
    });

    return response;
  }
  // TODO delete cookie
  // TODO will probably fail on header rewriting
  return apiResponse;
};
