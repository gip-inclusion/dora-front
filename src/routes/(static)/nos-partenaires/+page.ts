import { getPartners } from "$lib/utils/partners";
import type { PageLoad } from "./$types";

export const load: PageLoad = () => {
  return {
    title: "Nos partenaires | DORA",
    partnersToShow: getPartners(),
  };
};
