import { getApiURL } from "$lib/utils/api";

export function setUserHasDoneASearch(token: string): Promise<Response> {
  const url = `${getApiURL()}/profile/change/`;
  return fetch(url, {
    method: "POST",
    body: JSON.stringify({
      onboardingActionsAccomplished: {
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
