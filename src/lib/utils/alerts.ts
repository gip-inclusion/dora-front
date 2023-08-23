import { get } from "svelte/store";
import { token } from "./auth";
import { getApiURL } from "./api";
import type { Alert, Frequency } from "$lib/types";
import { getQueryString } from "./service-search";

export async function saveAlert(
  alert: Pick<
    Alert,
    "cityCode" | "cityLabel" | "categories" | "subcategories" | "kinds" | "fees"
  >
) {
  const url = `${getApiURL()}/services/save-alert/`;
  const method = "POST";
  const response = await fetch(url, {
    method,
    headers: {
      Accept: "application/json; version=1.0",
      "Content-Type": "application/json",
      Authorization: `Token ${get(token)}`,
    },
    body: JSON.stringify({ ...alert }),
  });
  if (!response.ok) {
    throw Error(response.statusText);
  }
}

export async function updateAlertFrequency(
  alertId: string,
  frequency: Frequency
) {
  const url = `${getApiURL()}/services/update-alert-frequency/`;
  const method = "POST";

  const response = await fetch(url, {
    method,
    headers: {
      Accept: "application/json; version=1.0",
      "Content-Type": "application/json",
      Authorization: `Token ${get(token)}`,
    },
    body: JSON.stringify({ alertId, frequency }),
  });
  if (!response.ok) {
    throw Error(response.statusText);
  }
}

export async function deleteAlert(alertId: string) {
  const url = `${getApiURL()}/services/delete-alert/`;
  const method = "POST";

  const response = await fetch(url, {
    method,
    headers: {
      Accept: "application/json; version=1.0",
      "Content-Type": "application/json",
      Authorization: `Token ${get(token)}`,
    },
    body: JSON.stringify({ alertId }),
  });
  if (!response.ok) {
    throw Error(response.statusText);
  }
}

export function getAlertQueryString(alert: Alert) {
  return getQueryString({
    categoryIds: alert.categories,
    subCategoryIds: alert.subcategories,
    cityCode: alert.cityCode,
    cityLabel: alert.cityLabel,
    kindIds: alert.kinds,
    feeConditions: alert.fees,
  });
}

export function currentSearchInAlert(userInfo, currentQuery): boolean {
  const userAlerts = userInfo?.alerts || [];

  for (let i = 0; i < userAlerts.length; i++) {
    if (getAlertQueryString(userAlerts[i]) === currentQuery) {
      return true;
    }
  }

  return false;
}
