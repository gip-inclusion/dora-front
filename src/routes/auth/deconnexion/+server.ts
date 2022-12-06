import { browser } from "$app/environment";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async () => {
  console.log("logout on server", browser);

  return new Response(null, {
    status: 204,
    headers: { "set-cookie": `server-token=; Max-Age=0; Path=/; HttpOnly` },
  });
};
