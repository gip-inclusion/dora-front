import { get } from "svelte/store";
import { getApiURL } from "./api";
import { token, type MainActivity } from "./auth";

export function updateMainActivity(mainActivity: MainActivity) {
  return fetch(`${getApiURL()}/profile/update-main-activity/`, {
    method: "PATCH",
    body: JSON.stringify({ mainActivity }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json; version=1.0",
      Authorization: `Token ${get(token)}`,
    },
  });
}
