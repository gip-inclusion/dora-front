import { get } from "svelte/store";
import { token } from "./auth";
import { getApiURL } from "./api";
import type { SavedSearch, Frequency } from "$lib/types";
import { getQueryString } from "./service-search";

export async function saveSearch(
  savedSearch: Pick<
    SavedSearch,
    "cityCode" | "cityLabel" | "category" | "subcategories" | "kinds" | "fees"
  >
) {
  const url = `${getApiURL()}/saved-searchs/`;
  const method = "POST";
  const response = await fetch(url, {
    method,
    headers: {
      Accept: "application/json; version=1.0",
      "Content-Type": "application/json",
      Authorization: `Token ${get(token)}`,
    },
    body: JSON.stringify({ ...savedSearch }),
  });
  if (!response.ok) {
    throw Error(response.statusText);
  }
}

export async function updateSavedSearchFrequency(
  savedSearchId: string,
  frequency: Frequency
) {
  const url = `${getApiURL()}/saved-searchs/${savedSearchId}/`;
  const method = "PATCH";

  const response = await fetch(url, {
    method,
    headers: {
      Accept: "application/json; version=1.0",
      "Content-Type": "application/json",
      Authorization: `Token ${get(token)}`,
    },
    body: JSON.stringify({ frequency }),
  });
  if (!response.ok) {
    throw Error(response.statusText);
  }
}

export async function deleteSavedSearch(savedSearchId: string) {
  const url = `${getApiURL()}/saved-searchs/${savedSearchId}/`;
  const method = "DELETE";

  const response = await fetch(url, {
    method,
    headers: {
      Accept: "application/json; version=1.0",
      "Content-Type": "application/json",
      Authorization: `Token ${get(token)}`,
    },
  });
  if (!response.ok) {
    throw Error(response.statusText);
  }
}

export function getSavedSearchQueryString(savedSearch: SavedSearch) {
  return getQueryString({
    categoryIds: [savedSearch.category],
    subCategoryIds: savedSearch.subcategories,
    cityCode: savedSearch.cityCode,
    cityLabel: savedSearch.cityLabel,
    kindIds: savedSearch.kinds,
    feeConditions: savedSearch.fees,
  });
}

export function isCurrentSearchInUserSavedSearchs(
  userInfo,
  currentQuery
): boolean {
  const userSavedSearchs = userInfo?.savedSearchs || [];

  return userSavedSearchs.some(
    (search) => getSavedSearchQueryString(search) === currentQuery
  );
}
