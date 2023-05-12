import type { Service } from "$lib/types";
import { token, userInfo } from "$lib/utils/auth";
import { get } from "svelte/store";
import type { Profile } from "$lib/utils/auth";
import { browser } from "$app/environment";
import { CANONICAL_URL } from "$lib/env";

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

function _trackEvent({
  category,
  action,
  name,
  value,
  userDepartment,
  userProfile,
  extraData = {},
}: {
  category: Category;
  action: Action;
  name: string;
  value: string;
  userDepartment: string | undefined;
  structureDepartment: string | undefined;
  userProfile: Profile | undefined;
  extraData: Record<string, any>;
}) {
  if (browser) {
    window._paq.push([
      "trackEvent",
      category,
      action,
      name,
      value,
      {
        ...extraData,
        ...computeActionDimensions(userDepartment, userProfile),
      },
    ]);
  }
}

function _getServiceProps(service, withUserData = false) {
  let props = {
    service: service.name,
    slug: service.slug,
    structure: service.structureInfo.name,
    departement: service.department || service.structureInfo.department,
    department: service.department || service.structureInfo.department,
    perimeter: service.diffusionZoneType,
    url: `${CANONICAL_URL}/services/${service.slug}`,
  };
  if (withUserData) {
    props = {
      ...props,
      loggedIn: !!get(token),
      owner: [
        ...(get(userInfo)?.structures.map((struct) => struct.slug) ?? []),
        ...(get(userInfo)?.pendingStructures.map((struct) => struct.slug) ??
          []),
      ].includes(service.structureInfo.slug),
    };
  }
  return props;
}

function _getStructureProps(structure, withUserData = false) {
  let props = {
    structure: structure.name,
    slug: structure.slug,
    departement: structure.department,
    department: structure.department,
    url: `${CANONICAL_URL}/structures/${structure.slug}`,
  };
  if (withUserData) {
    props = {
      ...props,
      loggedIn: !!get(token),
      owner: [
        ...(get(userInfo)?.structures.map((struct) => struct.slug) ?? []),
        ...(get(userInfo)?.pendingStructures.map((struct) => struct.slug) ??
          []),
      ].includes(structure.slug),
    };
  }
  return props;
}

// *** EXPORT
export function trackMobilisationServiceEmail(service: Service) {
  const user = get(userInfo);

  _trackEvent({
    category: "Mobilisation",
    action: "click",
    name: "Clic sur l'e-mail de contact",
    value: service.slug,
    userDepartment: user ? user.department : undefined,
    structureDepartment: service.department || service.structureInfo.department,
    userProfile: user ? user.profile : undefined,
    extraData: _getServiceProps(service, true),
  });
}

export function trackMobilisationService(service: Service) {
  const user = get(userInfo);

  _trackEvent({
    category: "Mobilisation",
    action: "click",
    name: "Clic bouton mobiliser",
    value: service.slug,
    userDepartment: user ? user.department : undefined,
    structureDepartment: service.department || service.structureInfo.department,
    userProfile: user ? user.profile : undefined,
    extraData: _getServiceProps(service, true),
  });
}
