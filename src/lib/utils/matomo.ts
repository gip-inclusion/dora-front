import type { Model, Service } from "$lib/types";
import { token, userInfo } from "$lib/utils/auth";
import { get } from "svelte/store";
import type { Profile } from "$lib/utils/auth";
import { browser } from "$app/environment";
import { CANONICAL_URL } from "$lib/env";
import { getDepartmentFromCityCode } from "./misc";

// Documentation : https://developer.matomo.org/guides/tracking-javascript-guide

// *** GLOBAL
type Category =
  | "Mobilisation"
  | "Inscription"
  | "Service"
  | "Structure"
  | "Erreurs"
  | "Recherche"
  | "Modèle";

type ExtraData = {
  cityCode: number;
  cityLabel: string;
  departement: number;
  department: number;
  loggedIn: boolean;
  numResults: string;
  categoryIds: string[];
  userDepartment: string;
  userProfile: string;
  structureDepartment: string;
  service: string;
  slug: string;
  structure: string;
  perimeter: string;
  url: string;
};

function resetTagManager() {
  if (window._mtm.length > 1) {
    window._mtm.length = 1;
  }
}

function _trackEvent({
  category,
  action,
  name,
  value,
  userDepartment,
  userProfile,
  structureDepartment,
  extraData,
}: {
  category: Category;
  action: string;
  name?: string;
  value?: string;
  userDepartment?: string | undefined;
  structureDepartment?: string | undefined;
  userProfile?: Profile | undefined;
  extraData?: Partial<ExtraData>;
}) {
  if (browser) {
    if (window._mtm) {
      resetTagManager();

      window._mtm.push({
        ...extraData,
        userDepartment,
        structureDepartment,
        userProfile,
      });
    }

    if (window._paq) {
      window._paq.push(["trackEvent", category, action, name, value]);
    }
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
    action: "Clic sur l'e-mail de contact",
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
    action: "Clic bouton mobiliser",
    value: service.slug,
    userDepartment: user ? user.department : undefined,
    structureDepartment: service.department || service.structureInfo.department,
    userProfile: user ? user.profile : undefined,
    extraData: _getServiceProps(service, true),
  });
}

export function trackMobilisationLogin(service) {
  const user = get(userInfo);

  _trackEvent({
    category: "Mobilisation",
    action: "Clic bouton login",
    value: service.slug,
    userDepartment: user ? user.department : undefined,
    structureDepartment: service.department || service.structureInfo.department,
    userProfile: user ? user.profile : undefined,
    extraData: _getServiceProps(service, true),
  });
}

export function trackJoinStructure() {
  _trackEvent({
    category: "Inscription",
    action: "Adhésion structure",
  });
}

export function trackPDFDownload(service: Service) {
  const user = get(userInfo);

  _trackEvent({
    category: "Service",
    action: "Clic pdf download",
    value: service.slug,
    userDepartment: user ? user.department : undefined,
    structureDepartment: service.department || service.structureInfo.department,
    userProfile: user ? user.profile : undefined,
    extraData: _getServiceProps(service, true),
  });
}
export function trackFeedback(service) {
  const user = get(userInfo);

  _trackEvent({
    category: "Service",
    action: "Suggérer modification",
    value: service.slug,
    userDepartment: user ? user.department : undefined,
    structureDepartment: service.department || service.structureInfo.department,
    userProfile: user ? user.profile : undefined,
    extraData: _getServiceProps(service, true),
  });
}

export function trackError(errorStatusCode, path) {
  _trackEvent({
    category: "Erreurs",
    action: "Affichage de la page d'erreur",
    extraData: {
      path,
    },
  });
}

export function trackModel(model: Model) {
  const props = _getServiceProps(model, true);
  props.model = props.structure;
  delete props.model;

  _trackEvent({
    category: "Modèle",
    action: "Consultation d'un modèle",
    extraData: props,
  });
}

export function trackService(service: Service) {
  _trackEvent({
    category: "Service",
    action: "Consultation d'un service",
    extraData: _getServiceProps(service, true),
  });
}

export function trackStructure(structure) {
  _trackEvent({
    category: "Structure",
    action: "Consultation d'une structure",
    extraData: _getStructureProps(structure, true),
  });
}

export function trackSearch(
  categoryIds,
  subCategoryIds,
  cityCode,
  cityLabel,
  kindIds,
  feeConditions,
  numResults
) {
  let numResultsCat;
  if (numResults === 0) {
    numResultsCat = "0";
  } else if (numResults <= 5) {
    numResultsCat = "Entre 1 et 5";
  } else {
    numResultsCat = "Plus de 5";
  }

  if (browser) {
    const props = {
      categoryIds: categoryIds.join(","),
      subCategoryIds: subCategoryIds.join(","),
      cityCode,
      cityLabel,
      serviceKinds: kindIds.join(","),
      feeConditions: feeConditions.join(","),
      loggedIn: !!get(token),
      numResults: numResultsCat,
      department: getDepartmentFromCityCode(cityCode),
    };
    console.log({ props });
    _trackEvent({
      category: "Recherche",
      action: "Réalisation d'une recherche",
      extraData: props,
    });
  }
}
