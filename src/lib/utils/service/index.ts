import {
  SERVICE_STATUSES,
  SERVICE_UPDATE_STATUS,
  type Service,
} from "$lib/types";
import dayjs from "dayjs";

import ArchivedIcon from "$lib/assets/services/status/service-archived.svg";
import DraftIcon from "$lib/assets/services/status/service-draft.svg";
import PublishedIcon from "$lib/assets/services/status/service-published.svg";
import SuggestionIcon from "$lib/assets/services/status/service-suggestion.svg";

type ServiceStatusPresentation = {
  bgClass: string;
  hoverBgClass: string;
  icon: string;
  label: string;
};

export const SERVICE_STATUS_PRESENTATION: Record<
  SERVICE_STATUSES,
  ServiceStatusPresentation
> = {
  [SERVICE_STATUSES.SUGGESTION]: {
    bgClass: "bg-service-violet",
    hoverBgClass: "bg-service-violet-dark",
    icon: SuggestionIcon,
    label: "Suggestion",
  },
  [SERVICE_STATUSES.DRAFT]: {
    bgClass: "bg-service-orange",
    hoverBgClass: "bg-service-orange-dark",
    icon: DraftIcon,
    label: "Brouillon",
  },
  [SERVICE_STATUSES.PUBLISHED]: {
    bgClass: "bg-service-green",
    hoverBgClass: "bg-service-green-dark",
    icon: PublishedIcon,
    label: "Publié",
  },
  [SERVICE_STATUSES.ARCHIVED]: {
    bgClass: "bg-service-gray",
    hoverBgClass: "bg-service-gray-dark",
    icon: ArchivedIcon,
    label: "Archivé",
  },
};

export function getAvailableOptionsForStatus(
  status: SERVICE_STATUSES
): (SERVICE_STATUSES | "DELETE")[] {
  let result: (SERVICE_STATUSES | "DELETE")[] = [];

  if (status === SERVICE_STATUSES.SUGGESTION) {
    result = [SERVICE_STATUSES.DRAFT, "DELETE"];
  } else if (status === SERVICE_STATUSES.PUBLISHED) {
    result = [SERVICE_STATUSES.DRAFT, SERVICE_STATUSES.ARCHIVED];
  } else if (status === SERVICE_STATUSES.DRAFT) {
    result = [SERVICE_STATUSES.PUBLISHED, SERVICE_STATUSES.ARCHIVED];
  } else if (status === SERVICE_STATUSES.ARCHIVED) {
    result = [SERVICE_STATUSES.DRAFT];
  } else {
    throw new Error(`Unknown status ${status}`);
  }

  return result;
}

type ServiceUpdateStatusData = {
  dayDiff: number;
  weekDiff: number;
  monthDiff: number;
  updateStatus: SERVICE_UPDATE_STATUS;
  label: string;
};
export function computeUpdateStatusData(
  service: Service
): ServiceUpdateStatusData {
  const lastUpdateDay = dayjs(service.modificationDate);
  const dayDiff = dayjs().diff(lastUpdateDay, "day");
  const weekDiff = dayjs().diff(lastUpdateDay, "week");
  const monthDiff = dayjs().diff(lastUpdateDay, "month");
  const yearDiff = dayjs().diff(lastUpdateDay, "year");

  let updateStatus = SERVICE_UPDATE_STATUS.NOT_NEEDED;
  if (monthDiff >= 6 && monthDiff < 8)
    updateStatus = SERVICE_UPDATE_STATUS.NEEDED;
  if (monthDiff >= 8) updateStatus = SERVICE_UPDATE_STATUS.REQUIRED;

  let label = "";
  if (dayDiff < 1) {
    label = "Actualisé aujourd'hui";
  } else if (dayDiff < 7) {
    label = `Actualisé il y a ${dayDiff} jour${dayDiff > 1 ? "s" : ""}`;
  } else if (weekDiff <= 5) {
    label = `Actualisé il y a ${weekDiff} semaine${weekDiff > 1 ? "s" : ""}`;
  } else if (monthDiff < 12) {
    label = `Actualisé il y a ${monthDiff} mois`;
  } else {
    label = `Actualisé il y a plus de ${yearDiff} an${yearDiff > 1 ? "s" : ""}`;
  }

  return {
    dayDiff,
    weekDiff,
    monthDiff,
    updateStatus,
    label,
  };
}
