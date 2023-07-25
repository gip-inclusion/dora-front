import { get } from "svelte/store";
import { token } from "../auth";
import { getApiURL } from "../api";

export async function acceptCGU() {
  const url = `${getApiURL()}/auth/accept-cgu/`;
  const method = "POST";
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
