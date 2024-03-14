import { browser } from "$app/environment";
import { token } from "$lib/utils/auth";
import { get } from "svelte/store";
import { getApiURL } from "$lib/utils/api";
import hexoid from "hexoid";
import type { Service } from "$lib/types";

const analyticsIdKey = "userHash";

function getAnalyticsId() {
  let analyticsId = localStorage.getItem(analyticsIdKey);
  if (!analyticsId) {
    analyticsId = hexoid(32)();
    localStorage.setItem(analyticsIdKey, analyticsId);
  }
  return analyticsId;
}

async function logAnalyticsEvent(tag, path, params = {}) {
  const data = {
    tag,
    path,
    userHash: getAnalyticsId(),
    ...params,
  };
  const currentToken = get(token);

  const headers = new Headers({
    Accept: "application/json; version=1.0",
    "Content-Type": "application/json",
  });
  if (currentToken) {
    headers.append("Authorization", `Token ${currentToken}`);
  }

  const res = await fetch(`${getApiURL()}/stats/event/`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (res.ok) {
    return res.json();
  } else {
    try {
      console.error(await res.json());
    } catch (err) {
      console.error(err);
    }
  }
  return null;
}

export function trackPageView(pathname, title) {
  if (browser) {
    logAnalyticsEvent("pageview", pathname, {
      title: title,
    });
  }
}

export async function trackMobilisation(
  service: Service,
  url: URL,
  isDI: boolean
) {
  if (browser) {
    const searchId = url.searchParams.get("searchId");
    if (isDI) {
      await logAnalyticsEvent("di_mobilisation", url.pathname, {
        diStructureId: service.structure,
        diStructureName: service.structureInfo.name,
        diStructureDepartment: service.structureInfo.department,
        diServiceId: service.slug.split("--")[1],
        diServiceName: service.name,
        diSource: service.source,
        diCategories: service.categories || [],
        diSubcategories: service.subcategories || [],
        searchId,
      });
    } else {
      await logAnalyticsEvent("mobilisation", url.pathname, {
        service: service.slug,
        searchId,
      });
    }
  }
}

export function trackOrientation(orientation, url) {
  if (browser) {
    logAnalyticsEvent("orientation", url.pathname, {
      orientation: orientation.id,
      diStructureName: orientation.diStructureName,
      diServiceId: orientation.diServiceId,
      diServiceName: orientation.diServiceName,
    });
  }
}

export async function trackSearch(
  url,
  categoryIds,
  subCategoryIds,
  cityCode,
  cityLabel,
  kinds,
  feeConditions,
  locationKinds,
  results
) {
  if (browser) {
    const numResults = results.length;
    const numDiResults = results.filter(
      (service) => service.type === "di"
    ).length;
    const numDiResultsTop10 = results
      .slice(0, 10)
      .filter((service) => service.type === "di").length;
    const resultsSlugsTop10 = results
      .slice(0, 10)
      .map((service) => service.slug);

    const searchId = await logAnalyticsEvent("search", url.pathname, {
      searchCityCode: cityCode,
      searchNumResults: numResults,
      categoryIds: categoryIds,
      subCategoryIds: subCategoryIds,
      numDiResults,
      numDiResultsTop10,
      resultsSlugsTop10,
      kinds,
      feeConditions,
      locationKinds,
    });
    return searchId;
  }
  return null;
}

export function trackService(service, url, searchId, isDI) {
  if (browser) {
    if (isDI) {
      logAnalyticsEvent("di_service", url.pathname, {
        diStructureId: service.structure,
        diStructureName: service.structureInfo.name,
        diStructureDepartment: service.structureInfo.department,
        diServiceId: service.slug.split("--")[1],
        diServiceName: service.name,
        diSource: service.source,
        diCategories: service.categories || [],
        diSubcategories: service.subcategories || [],
        searchId,
      });
    } else {
      logAnalyticsEvent("service", url.pathname, {
        service: service.slug,
        searchId,
      });
    }
  }
}

export function trackServiceShare(
  service: Service,
  recipientEmail: string,
  recipientKind: string,
  url: URL,
  searchId: string,
  isDI: boolean
) {
  if (browser) {
    if (isDI) {
      logAnalyticsEvent("share", url.pathname, {
        diStructureName: service.structureInfo.name,
        diStructureDepartment: service.structureInfo.department,
        diServiceId: service.slug.split("--")[1],
        diServiceName: service.name,
        diSource: service.source,
        diCategories: service.categories || [],
        diSubcategories: service.subcategories || [],
        searchId,
        recipientEmail,
        recipientKind,
      });
    } else {
      logAnalyticsEvent("share", url.pathname, {
        service: service.slug,
        searchId,
        recipientEmail,
        recipientKind,
      });
    }
  }
}

export function trackStructure(structure, url) {
  if (browser) {
    logAnalyticsEvent("structure", url.pathname, {
      structure: structure.slug,
    });
  }
}
