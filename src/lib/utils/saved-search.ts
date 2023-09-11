import { get } from "svelte/store";
import { token } from "./auth";
import { getApiURL } from "./api";
import type { SavedSearch, Frequency } from "$lib/types";
import { getQueryString } from "./service-search";

export async function saveSearch(
  savedSearch: Pick<
    SavedSearch,
    "cityCode" | "cityLabel" | "categories" | "subcategories" | "kinds" | "fees"
  >
) {
  const url = `${getApiURL()}/services/save-search/`;
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
  const url = `${getApiURL()}/services/update-saved-search-frequency/`;
  const method = "POST";

  const response = await fetch(url, {
    method,
    headers: {
      Accept: "application/json; version=1.0",
      "Content-Type": "application/json",
      Authorization: `Token ${get(token)}`,
    },
    body: JSON.stringify({ savedSearchId, frequency }),
  });
  if (!response.ok) {
    throw Error(response.statusText);
  }
}

export async function deleteSavedSearch(savedSearchId: string) {
  const url = `${getApiURL()}/services/delete-saved-search/`;
  const method = "POST";

  const response = await fetch(url, {
    method,
    headers: {
      Accept: "application/json; version=1.0",
      "Content-Type": "application/json",
      Authorization: `Token ${get(token)}`,
    },
    body: JSON.stringify({ savedSearchId }),
  });
  if (!response.ok) {
    throw Error(response.statusText);
  }
}

export function getSavedSearchQueryString(savedSearch: SavedSearch) {
  return getQueryString({
    categoryIds: savedSearch.categories,
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

  for (let i = 0; i < userSavedSearchs.length; i++) {
    if (getSavedSearchQueryString(userSavedSearchs[i]) === currentQuery) {
      return true;
    }
  }

  return false;
}
