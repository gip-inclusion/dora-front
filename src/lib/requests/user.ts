import { getApiURL } from "$lib/utils/api";

export function saveHasDoneASearch(token: string): Promise<Response> {
  const url = `${getApiURL()}/profile/change/`;
  return fetch(url, {
    method: "POST",
    body: JSON.stringify({
      extraInfos: {
        hasDoneASearch: true,
      },
    }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json; version=1.0",
      Authorization: `Token ${token}`,
    },
  });
}
