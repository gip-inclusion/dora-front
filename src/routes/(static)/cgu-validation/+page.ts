import type { PageLoad } from "./$types";
import content from "$lib/utils/cgu/content.md?raw";
import { getNextPage } from "../../auth/utils";

export const load: PageLoad = ({ url }) => {
  return {
    title: "Mise à jour des Conditions Générales d’Utilisation de DORA | DORA",
    noIndex: true,
    content,
    next: getNextPage(url),
  };
};
