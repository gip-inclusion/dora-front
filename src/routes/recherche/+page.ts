import { getQuery } from "$lib/search";
import { getServicesOptions } from "$lib/services";
import {
  SERVICE_UPDATE_STATUS,
  type SearchQuery,
  type ServiceSearchResult,
} from "$lib/types";
import { getApiURL } from "$lib/utils/api";
import { trackSearch } from "$lib/utils/plausible";
import { computeUpdateStatusData } from "$lib/utils/service";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ url, parent, fetch }) => {
  await parent();

  const query = url.searchParams;
  const categoryIds = query.get("cats") ? query.get("cats").split(",") : [];
  const subCategoryIds = query.get("subs") ? query.get("subs").split(",") : [];
  const cityCode = query.get("city");
  const cityLabel = query.get("cl");
  const kindIds = query.get("kinds") ? query.get("kinds").split(",") : [];
  const feeConditions = query.get("fees") ? query.get("fees").split(",") : [];

  const services = await getResults({
    categoryIds,
    subCategoryIds,
    cityCode,
    cityLabel,
    kindIds,
    feeConditions,
    fetchFct: fetch,
  });

  services.forEach((service) => {
    service.updateStatus = computeUpdateStatusData(service).updateStatus;
  });

  trackSearch(
    categoryIds,
    subCategoryIds,
    cityCode,
    cityLabel,
    kindIds,
    feeConditions,
    services.length
  );
  return {
    categoryIds,
    subCategoryIds,
    cityCode,
    cityLabel,
    kindIds,
    feeConditions,
    allServices: services,
    servicesUpToDate: services.filter(
      (service) => service.updateStatus !== SERVICE_UPDATE_STATUS.REQUIRED
    ),
    servicesToUpdate: services.filter(
      (service) => service.updateStatus === SERVICE_UPDATE_STATUS.REQUIRED
    ),
    servicesOptions: await getServicesOptions(fetch),
  };
};

async function getResults({
  categoryIds,
  subCategoryIds,
  cityCode,
  cityLabel,
  kindIds,
  feeConditions,
  fetchFct,
}: SearchQuery): Promise<ServiceSearchResult[]> {
  const query = getQuery({
    categoryIds,
    subCategoryIds,
    cityCode,
    cityLabel,
    kindIds,
    feeConditions,
  });
  const url = `${getApiURL()}/search/?${query}`;

  // TODO: migrate to fetchData
  const res = await fetchFct(url, {
    headers: { Accept: "application/json; version=1.0" },
  });

  if (res.ok) {
    return await res.json();
  }

  // TODO: log errors
  try {
    console.error(await res.json());
  } catch (err) {
    console.error(err);
  }
  return [];
}
