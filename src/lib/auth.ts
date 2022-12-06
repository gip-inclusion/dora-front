import { browser } from "$app/environment";
import { defaultAcceptHeader } from "$lib/utils/api";
import { get, writable } from "svelte/store";
import { log, logException } from "./logger";
import { userPreferencesSet } from "./preferences";
import type { Bookmark, ShortStructure } from "./types";

const tokenKey = "token";

export const token = writable(null);

export interface UserInfo {
  firstName: string;
  lastName: string;
  fullName: string;
  shortName: string;
  email: string;
  phoneNumber: string;
  newsletter: boolean;
  isStaff: boolean;
  isBizdev: boolean;
  bookmarks: Bookmark[];
  structures: ShortStructure[];
  pendingStructures: ShortStructure[];
}

export const userInfo = writable<UserInfo>(null);

export function setToken(t: string) {
  token.set(t);
  if (browser) {
    localStorage.setItem(tokenKey, t);
  }
}

export function setUserInfo(extUserInfo: UserInfo) {
  userInfo.set(extUserInfo);
}

export async function getUserInfo(authToken, fetchFct) {
  return await fetchFct(`/api/user-info`, {
    method: "POST",
    headers: {
      Accept: defaultAcceptHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key: authToken }),
  });
}

export async function refreshUserInfo(fetchFct) {
  try {
    const result = await getUserInfo(get(token), fetchFct);
    if (result.status === 200) {
      const info = (await result.json()) as UserInfo;
      userInfo.set(info);
      userPreferencesSet([...info.structures, ...info.pendingStructures]);
    } else {
      log("Unexpected status code", { result });
    }
  } catch (err) {
    logException(err);
  }
}

export function deleteCookies() {
  const cookies = document.cookie.split(";").reduce((acc, cookie) => {
    const [name] = cookie.split("=").map((c) => c.trim());
    acc.push(name);

    return acc;
  }, []);

  const cookieNames = Object.keys(window.tarteaucitron.services).reduce(
    (acc, name) => {
      acc.push(...window.tarteaucitron.services[name].cookies);

      return acc;
    },
    ["tarteaucitron"]
  );

  cookieNames.forEach((n) => {
    const name = cookies.find((c) => c.includes(n));

    document.cookie = `${name}=; Max-Age=0; path=/; domain=${location.hostname}`;
  });
}

export function disconnect() {
  token.set(null);
  userInfo.set(null);
  localStorage.clear();
  deleteCookies();
}

export async function validateCredsAndFillUserInfo(fetchFct) {
  // token.set(null);
  // userInfo.set(null);

  if (browser) {
    const lsToken = localStorage.getItem(tokenKey);
    if (lsToken) {
      // Valide le token actuel et remplit les informations
      // utilisateur
      try {
        const result = await getUserInfo(lsToken, fetchFct);
        if (result.status === 200) {
          token.set(lsToken);
          const info: UserInfo = await result.json();
          userInfo.set(info);
          userPreferencesSet([...info.structures, ...info.pendingStructures]);
        } else if (result.status === 404) {
          // Le token est invalide, on déconnecte l'utilisateur
          disconnect();
        } else {
          log("Unexpected status code", { result });
        }
      } catch (err) {
        logException(err);
      }
    }
  }
}
