import { getServicesOptions } from "$lib/requests/services";
import { getStructuresOptions } from "$lib/requests/structures";
import type { PageLoad } from "./$types";
import { userInfo } from "$lib/utils/auth";
import { get } from "svelte/store";
import { getApiURL } from "$lib/utils/api";
import type { GeoApiValue } from "$lib/types";

async function searchAdminDivision(query) {
  const url = `${getApiURL()}/admin-division-search/?type=department&q=${encodeURIComponent(
    query
  )}&with_geom=1`;
  const response = await fetch(url);
  const jsonResponse = await response.json();
  const results = jsonResponse.map((result) => ({
    value: result,
    label: `${result.name} (${result.code})`,
  }));

  return results;
}

export const load: PageLoad = async ({ parent }) => {
  await parent();

  const [servicesOptions, structuresOptions] = await Promise.all([
    getServicesOptions(),
    getStructuresOptions(),
  ]);

  const user = get(userInfo);

  let department;
  let departments: GeoApiValue[] = [];
  let title = "Structures | Administration | DORA";
  if (user.isManager) {
    // note : on pourrait créer un service pour récupérer un bloc, plutôt que répeter l'appel
    // mais ce n'est utilisé qu'ici je pense ...
    departments = await Promise.all(user.departments.map(searchAdminDivision));
    departments = departments.map((dpt) => dpt[0]);
    [department] = departments;
    department = department.value;
    title = `Tableau de bord ${user.departments} | DORA`;
  }

  return {
    title,
    noIndex: true,
    servicesOptions,
    structuresOptions,
    isManager: user.isManager && department,
    department,
    departments,
  };
};
