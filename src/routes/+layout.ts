import { browser } from "$app/environment";
import {
  setToken,
  setUserInfo,
  userInfo,
  validateCredsAndFillUserInfo,
  type UserInfo,
} from "$lib/auth";
import { CRISP_ID } from "$lib/env";
import { userPreferencesSet } from "$lib/preferences";
import { redirect } from "@sveltejs/kit";
import { get } from "svelte/store";
import type { LayoutLoad } from "./$types";

export const ssr = true;

// No SSR for testing => we can't intercept request server side
//export const ssr = ENVIRONMENT === "testing" ? false : undefined;

export const load: LayoutLoad = async ({ url, data, fetch }) => {
  let currentUserInfo: UserInfo;
  if (data.userInfo) {
    console.log("using ssr userinfo", browser, data.userInfo?.firstName);
    setUserInfo(data.userInfo);
    currentUserInfo = data.userInfo;
    if (browser) {
      userPreferencesSet([
        ...currentUserInfo.structures,
        ...currentUserInfo.pendingStructures,
      ]);
    }
  } else {
    currentUserInfo = get(userInfo);
    console.log("get userinfo from store", browser, currentUserInfo?.firstName);
  }
  if (!currentUserInfo) {
    console.log("rechecking userinfo", browser);
    await validateCredsAndFillUserInfo(fetch);
    currentUserInfo = get(userInfo);
    console.log("rechecking userinfo", browser, currentUserInfo?.firstName);
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

  if (data.serverToken) {
    setToken(data.serverToken);
  }
};

if (browser) {
  window.tarteaucitron.user.crispID = CRISP_ID;
}
