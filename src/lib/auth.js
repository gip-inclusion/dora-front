import { get, writable } from "svelte/store";
import { browser } from "$app/env";
import { getApiURL, defaultAcceptHeader } from "$lib/utils/api.js";
import { log, logException } from "./logger";

const tokenKey = "token";

/**
 * @typedef { import("svelte/store").Writable } Writable
 */

export const token = writable(null);
/** @type {Writable<{firstName: string, lastName: string, fullName: string, shortName: string, email: string, phoneNumber: string, newsletter: boolean,
            isStaff: boolean, isBizdev: boolean} | null>} */
export const userInfo = writable(null);

export const userStructures = writable(null);

// Rules for auto generation by password managers
// https://developer.apple.com/password-rules/
// https://support.1password.com/compatible-website-design/
// - between 9 and 129 chars
// - not only numbers
export const passwordRules =
  "minlength: 9; maxlength: 128; required: upper,lower,special; allowed: unicode;";

export function setToken(t) {
  token.set(t);
  localStorage.setItem(tokenKey, t);
}

export function clearToken() {
  token.set(null);
  localStorage.removeItem(tokenKey);
}

export function clearUserInfo() {
  userInfo.set(null);
}

async function getUserInfo(authToken) {
  return await fetch(`${getApiURL()}/auth/user-info/`, {
    method: "POST",
    headers: {
      Accept: defaultAcceptHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key: authToken }),
  });
}

async function getUserStructures(authToken) {
  const url = `${getApiURL()}/structures/?mine=1`;
  const headers = {
    Accept: defaultAcceptHeader,
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers.Authorization = `Token ${authToken}`;
  }

  const response = await fetch(url, { headers });

  return await response.json();
}

export async function refreshUserInfo() {
  try {
    const result = await getUserInfo(get(token));
    if (result.status === 200) {
      userInfo.set(await result.json());

      const structures = await getUserStructures(get(token));

      userStructures.set(structures || []);
    } else {
      log("Unexpected status code", { result });
    }
  } catch (err) {
    logException(err);
  }
}

export async function validateCredsAndFillUserInfo() {
  token.set(null);
  userInfo.set(null);
  userStructures.set(null);

  if (browser) {
    const lsToken = localStorage.getItem(tokenKey);
    if (lsToken) {
      // Valide le token actuel, et rempli les informations
      // utilisateur
      try {
        const result = await getUserInfo(lsToken);
        if (result.status === 200) {
          token.set(lsToken);
          userInfo.set(await result.json());

          const structures = await getUserStructures(get(token));

          userStructures.set(structures || []);
        } else if (result.status === 404) {
          // Le token est invalide, on vide le localStorage
          clearToken();
          clearUserInfo();
        } else {
          log("Unexpected status code", { result });
        }
      } catch (err) {
        logException(err);
      }
    }
  }
}

export function disconnect() {
  clearToken();
  clearUserInfo();
  localStorage.clear();
}

export function userInfoIsComplete() {
  const info = get(userInfo);

  return (
    !!info.email && !!info.firstName && !!info.lastName && !!info.phoneNumber
  );
}
