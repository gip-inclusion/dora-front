import type { Service } from "$lib/types";
import { userInfo } from "$lib/utils/auth";
import { get } from "svelte/store";
import type { Profile } from "$lib/utils/auth";

// Documentation : https://developer.matomo.org/guides/tracking-javascript-guide

// Pour en savoir plus : https://matomo.inclusion.beta.gouv.fr/index.php?module=CustomDimensions&action=manage&idSite=210
function computeActionDimensions(
  userDepartment: string | undefined,
  userProfile: Profile | undefined
): { dimension3?: Profile; dimension4?: string } {
  const result: { dimension3?: Profile; dimension4?: string } = {};
  if (userProfile) {
    result.dimension3 = userProfile;
  }
  if (userDepartment) {
    result.dimension4 = userDepartment;
  }
  return result;
}

// *** GLOBAL
type Category = "Mobilisation";
type Action = "click";
type Name = "Click bouton mobiliser";

function _trackEvent({
  category,
  action,
  name,
  value,
  userDepartment,
  userProfile,
}: {
  category: Category;
  action: Action;
  name: Name;
  value: string;
  userDepartment: string | undefined;
  structureDepartment: string | undefined;
  userProfile: Profile | undefined;
}) {
  window._paq.push([
    "trackEvent",
    category,
    action,
    name,
    value,
    {
      ...computeActionDimensions(userDepartment, userProfile),
    },
  ]);
}

// *** EXPORT
export function trackMobilisationService(service: Service) {
  _trackEvent({
    category: "Mobilisation",
    action: "click",
    name: "Click bouton mobiliser",
    value: service.slug,
    userDepartment: userInfo ? get(userInfo).department : undefined,
    structureDepartment: service.department || service.structureInfo.department,
    userProfile: userInfo ? get(userInfo).profile : undefined,
  });
}
