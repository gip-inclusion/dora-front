import { getApiURL } from "$lib/utils/api";
import { token } from "$lib/utils/auth";
import { get } from "svelte/store";

export function logAnalyticsEvent(tag, path, params = {}) {
  const data = {
    tag,
    path,
    ...params,
  };
  const currentToken = get(token);

  return fetch(`${getApiURL()}/stats/event/`, {
    method: "POST",
    headers: {
      Accept: "application/json; version=1.0",
      "Content-Type": "application/json",
      Authorization: currentToken ? `Token ${get(token)}` : undefined,
    },
    body: JSON.stringify(data),
  });
}
