import { userInfo, validateCredsAndFillUserInfo } from "$lib/auth";
import { redirect } from "@sveltejs/kit";
import { get } from "svelte/store";
import type { LayoutLoad } from "./$types";

// No SSR for testing => we can't intercept request server side
export const ssr = false;
export const prerender = false;

export const load: LayoutLoad = async ({ url }) => {
  let currentUserInfo = get(userInfo);
  if (!currentUserInfo) {
    await validateCredsAndFillUserInfo();
    currentUserInfo = get(userInfo);
  }
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
