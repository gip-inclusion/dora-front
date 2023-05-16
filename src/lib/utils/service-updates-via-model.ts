import { browser } from "$app/environment";
import type { Model, Service } from "$lib/types";
import { klona } from "klona";
import { modelSchema } from "$lib/validation/schemas/service";
import { arraysEquals, htmlToMarkdown, markdownToHTML } from "./misc";

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

// COMPARATOR
export function equals(type, val1, val2) {
  if (type === "array" || type === "files") {
    return arraysEquals(val1, val2);
  }

  // tiptap insère des caractères en fin de chaine.
  // on les supprime pour faire la comparaison
  if (type === "markdown") {
    // la description du service est passée par l'éditeur, ce qui réécrit les liens.
    // on le simule ainsi:
    const rewrittenVal1 = htmlToMarkdown(markdownToHTML(val1));
    return rewrittenVal1.trim() === val2.trim();
  }

  return val1 === val2;
}

export function updateServiceFromModel(
  model: Model,
  service: Service
): Service {
  const fields = Object.keys(modelSchema);

  const newService = klona(service);

  fields.forEach((field) => {
    let type = "text";
    if (field === "fullDesc") {
      type = "markdown";
    } else if (Array.isArray(model[field])) {
      type = "array";
    }

    if (!equals(type, model[field], newService[field])) {
      newService[field] = model[field];
    }
  });

  newService.markSynced = true;
  return newService;
}
