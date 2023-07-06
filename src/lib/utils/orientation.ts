import { get } from "svelte/store";
import { getApiURL } from "./api";
import { token } from "./auth";
import { fetchData } from "./misc";
import type { SendOrientation } from "../../routes/orientation/[id]/types";

export async function getOrientation(
  uid: string
): Promise<SendOrientation | undefined> {
  const url = `${getApiURL()}/orientation/${uid}/`;
  const { data } = await fetchData<SendOrientation>(url);

  if (!data) {
    return undefined;
  }
  return data;
}

export function contactBeneficiary(
  uid: string,
  extraRecipients: string[],
  message: string
) {
  const url = `${getApiURL()}/orientation/${uid}/contact/beneficiaire/`;
  const method = "POST";
  return fetch(url, {
    method,
    headers: {
      Accept: "application/json; version=1.0",
      "Content-Type": "application/json",

      Authorization: `Token ${get(token)}`,
    },
    body: JSON.stringify({
      extraRecipients,
      message,
    }),
  });
}

export function contactService(
  uid: string,
  extraRecipients: string[],
  message: string
) {
  const url = `${getApiURL()}/orientation/${uid}/contact/prescripteur/`;
  const method = "POST";
  return fetch(url, {
    method,
    headers: {
      Accept: "application/json; version=1.0",
      "Content-Type": "application/json",

      Authorization: `Token ${get(token)}`,
    },
    body: JSON.stringify({
      extraRecipients,
      message,
    }),
  });
}

export function denyOrientation(
  uid: string,
  reason: string,
  otherDetails?: string
) {
  const url = `${getApiURL()}/orientation/${uid}/reject/`;
  const method = "POST";
  return fetch(url, {
    method,
    headers: {
      Accept: "application/json; version=1.0",
      "Content-Type": "application/json",

      Authorization: `Token ${get(token)}`,
    },
    body: JSON.stringify({
      reason,
      otherDetails,
    }),
  });
}

export function acceptOrientation(
  uid: string,
  {
    response,
    orientationStartDate,
    orientationEndDate,
    orientationLocation,
    addExtraRecipients,
    extraRecipients,
    addBeneficiaryMessage,
    beneficiaryMessage,
  }: {
    response: string;
    orientationStartDate: string;
    orientationEndDate: string;
    orientationLocation: string;
    addExtraRecipients: string[];
    extraRecipients: string;
    addBeneficiaryMessage: string[];
    beneficiaryMessage: string;
  }
) {
  const url = `${getApiURL()}/orientation/${uid}/validate/`;
  const method = "POST";
  return fetch(url, {
    method,
    headers: {
      Accept: "application/json; version=1.0",
      "Content-Type": "application/json",

      Authorization: `Token ${get(token)}`,
    },
    body: JSON.stringify({
      response,
      orientationStartDate,
      orientationEndDate,
      orientationLocation,
      addExtraRecipients,
      extraRecipients,
      addBeneficiaryMessage,
      beneficiaryMessage,
    }),
  });
}
