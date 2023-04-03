import {
  bankIcon,
  chatQuoteIcon,
  chatSmileIcon,
  compassDiscoverIcon,
  euroLineIcon,
  homeSmileIcon,
  macLineIcon,
  mentalHealthIcon,
  parentIcon,
  rocketIcon,
  serviceIcon,
  stethoscopeIcon,
  storeIcon,
  textIcon,
  wheelChairIcon,
} from "$lib/icons";
import type {
  Choice,
  FeeCondition,
  Service,
  ServiceSearchResult,
  ServicesOptions,
  ServiceStatus,
  ServiceUpdateStatus,
  ShortService,
} from "$lib/types";
import dayjs from "dayjs";
import { getChoicesFromKey } from "./choice";
import { log } from "./logger";

export function getAvailableOptionsForStatus(
  status: ServiceStatus
): (ServiceStatus | "DELETE")[] {
  let result: (ServiceStatus | "DELETE")[] = [];

  if (status === "SUGGESTION") {
    result = ["DRAFT", "DELETE"];
  } else if (status === "PUBLISHED") {
    result = ["DRAFT", "ARCHIVED"];
  } else if (status === "DRAFT") {
    result = ["PUBLISHED", "ARCHIVED"];
  } else if (status === "ARCHIVED") {
    result = ["DRAFT"];
  } else {
    throw new Error(`Unknown status ${status}`);
  }

  return result;
}

export function computeUpdateStatus(
  service: Service | ShortService | ServiceSearchResult
): ServiceUpdateStatus {
  const lastUpdateDay = dayjs(service.modificationDate);
  const monthDiff = dayjs().diff(lastUpdateDay, "month");

  let updateStatus: ServiceUpdateStatus = "NOT_NEEDED";
  if (service.status === "PUBLISHED") {
    if (monthDiff >= 6 && monthDiff < 8) {
      updateStatus = "NEEDED";
    }
    if (monthDiff >= 8) {
      updateStatus = "REQUIRED";
    }
  }

  return updateStatus;
}

export function getCategoryIcon(slug: string) {
  if ("creation-activite" === slug) {
    return rocketIcon;
  }
  if ("numerique" === slug) {
    return macLineIcon;
  }
  if ("equipement-et-alimentation" === slug) {
    return storeIcon;
  }
  if ("famille" === slug) {
    return parentIcon;
  }
  if ("gestion-financiere" === slug) {
    return euroLineIcon;
  }
  if ("apprendre-francais" === slug) {
    return chatQuoteIcon;
  }
  if ("accompagnement-social-et-professionnel-personnalise" === slug) {
    return chatSmileIcon;
  }
  if ("handicap" === slug) {
    return wheelChairIcon;
  }
  if ("sante" === slug) {
    return stethoscopeIcon;
  }
  if ("logement-hebergement" === slug) {
    return homeSmileIcon;
  }
  if ("illettrisme" === slug) {
    return textIcon;
  }
  if ("mobilite" === slug) {
    return compassDiscoverIcon;
  }
  if ("remobilisation" === slug) {
    return mentalHealthIcon;
  }
  if ("acces-aux-droits-et-citoyennete" === slug) {
    return bankIcon;
  }
  if ("choisir-un-metier" === slug) {
    return serviceIcon;
  }
  if ("preparer-sa-candidature" === slug) {
    return serviceIcon;
  }
  if ("trouver-un-emploi" === slug) {
    return serviceIcon;
  }
  log(`Pas d'icone définie pour la thématique ${slug}`);
  return null;
}

export function getCategoryLabel(
  slug: string,
  servicesOptions: ServicesOptions
) {
  const category = servicesOptions.categories.find((cat) => cat.value === slug);
  return category.label ?? "";
}

export function getSubCategoryLabel(
  slug: string,
  servicesOptions: ServicesOptions
) {
  const subCategory = servicesOptions.subcategories.find(
    (subCat) => subCat.value === slug
  );
  return subCategory.label ?? "";
}

export function formatFilePath(filePath: string) {
  const file = filePath.split("/").pop();

  const dotPosition = file.lastIndexOf(".");
  if (dotPosition === -1) {
    return file;
  }

  const name = file.slice(0, dotPosition);
  const extension = file.slice(file.lastIndexOf("."), file.length);

  return `${name} (${extension})`;
}

export function isNotFreeService(feeConditionValue: FeeCondition): boolean {
  return feeConditionValue !== "gratuit";
}

export function associateIconToCategory(choices: Choice[]): Choice[] {
  choices.forEach((choice) => {
    choice.icon = getCategoryIcon(choice.value);
  });
  return choices;
}

export function sortCategory(categories: Choice[]) {
  return categories.sort((a, b) => {
    return a.label.localeCompare(b.label, "fr", { numeric: true });
  });
}

function sortSubcategory(subcategories: Choice[]) {
  return subcategories.sort((a, b) => {
    if (a.value.endsWith("--autre")) {
      return 1;
    }
    if (b.value.endsWith("--autre")) {
      return -1;
    }

    if (a.value.endsWith("--all")) {
      return -1;
    }
    if (b.value.endsWith("--all")) {
      return 1;
    }

    return a.label.localeCompare(b.label, "fr", { numeric: true });
  });
}

export function sortByCategories(
  categories: Choice[],
  subcategories: Choice[]
) {
  const result: Choice[] = [];

  categories.forEach(({ value }) => {
    const subCategoriesForCategory = getChoicesFromKey(value, subcategories);
    result.push(...sortSubcategory(subCategoriesForCategory));
  });
  return result;
}
