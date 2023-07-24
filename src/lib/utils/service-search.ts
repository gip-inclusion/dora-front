import type { SearchQuery } from "$lib/types";
import { logException } from "./logger";

const LAST_SEARCH_CITY_KEY = "lastSearch";

export function getQueryString({
  categoryIds,
  subCategoryIds,
  cityCode,
  cityLabel,
  feeConditions,
  kindIds,
  useDI,
}: SearchQuery) {
  const parameters = {
    cats: categoryIds.join(","),
    subs: subCategoryIds.join(","),
    city: cityCode,
    // eslint-disable-next-line id-length
    cl: cityLabel,
    kinds: kindIds.join(","),
    fees: feeConditions.join(","),
    // eslint-disable-next-line id-length
    di: useDI || undefined,
  };
  const query = Object.entries(parameters)
    .filter(([_key, value]) => !!value)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  return query;
}

export function storeLastSearchCity(cityCode, cityLabel) {
  localStorage.setItem(
    LAST_SEARCH_CITY_KEY,
    JSON.stringify({
      cityCode,
      cityLabel,
    })
  );
}

export function getLastSearchCity() {
  let cityCode, cityLabel;
  const lastSearch = localStorage.getItem(LAST_SEARCH_CITY_KEY);
  if (lastSearch) {
    try {
      ({ cityCode, cityLabel } = JSON.parse(lastSearch));
    } catch (err) {
      logException(err, "Impossible de lire la dernière ville de recherche");
    }
  }
  return { cityCode, cityLabel };
}
