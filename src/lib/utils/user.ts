import { get } from "svelte/store";
import { getApiURL } from "./api";
import { token, type UserProfile } from "./auth";

export function updateUserProfile(userProfile: UserProfile) {
  return fetch(`${getApiURL()}/profile/update-main-activity/`, {
    method: "PATCH",
    body: JSON.stringify({ mainActivity: userProfile }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json; version=1.0",
      Authorization: `Token ${get(token)}`,
    },
  });
}
