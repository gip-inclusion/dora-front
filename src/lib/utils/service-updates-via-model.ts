import { browser } from "$app/environment";
// LOCAL STORAGE
type ModelToService = {
  modelSlug: string;
  serviceSlug: string;
};

const MODEL_NOTICE_HIDDEN_KEY = "modelNoticeHidden";
const SERVICE_TO_UPDATE_VIA_MODELS_IGNORED = "serviceToUpdateViaModelsIgnored";

export function getIgnoredServicesToUpdate(): ModelToService[] {
  if (!browser) {
    return [];
  }

  try {
    const data = JSON.parse(
      window.localStorage.getItem(SERVICE_TO_UPDATE_VIA_MODELS_IGNORED) ?? ""
    );
    if (Array.isArray(data)) {
      return data;
    } else {
      window.localStorage.removeItem(SERVICE_TO_UPDATE_VIA_MODELS_IGNORED);
    }
  } catch {
    /* empty */
  }

  return [];
}

export function addIgnoredServicesToUpdate(
  modelToServiceSlugs: ModelToService[]
): void {
  const data = getIgnoredServicesToUpdate();

  modelToServiceSlugs.forEach((couple) => data.push(couple));

  window.localStorage.setItem(
    SERVICE_TO_UPDATE_VIA_MODELS_IGNORED,
    JSON.stringify(Array.from(new Set(data)))
  );
}

export function removeIgnoredServiceToUpdate(modelSlugToRemove: string): void {
  const data = getIgnoredServicesToUpdate().filter(
    ({ modelSlug }) => modelSlug !== modelSlugToRemove
  );

  window.localStorage.setItem(
    SERVICE_TO_UPDATE_VIA_MODELS_IGNORED,
    JSON.stringify(data)
  );
}

export function isModelNoticeHidden(): boolean {
  if (!browser) {
    return true;
  }

  return window.localStorage.getItem(MODEL_NOTICE_HIDDEN_KEY) === "true";
}
export function hideModelNotice(): void {
  window.localStorage.setItem(MODEL_NOTICE_HIDDEN_KEY, "true");
}
export function showModelNotice(): void {
  window.localStorage.removeItem(MODEL_NOTICE_HIDDEN_KEY);
}
