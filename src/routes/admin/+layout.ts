import { token, userInfo } from "$lib/auth";
import { error, redirect } from "@sveltejs/kit";
import { get } from "svelte/store";

// pages authentifiées sur lesquelles la première requête non authentifiée n'a pas de sens
export const ssr = false;

export async function load({ url, parent }) {
  await parent();

  const myToken = get(token);
  if (!myToken) {
    throw redirect(
      302,
      `/auth/connexion?next=${encodeURIComponent(url.pathname + url.search)}`
    );
  }

  const user = get(userInfo);

  if (!user?.isStaff) {
    throw error(403, "Accès réservé");
  }

  return {};
}
