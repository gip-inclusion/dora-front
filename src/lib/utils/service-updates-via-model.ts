import { browser } from "$app/environment";

const MODEL_NOTICES_HIDDEN_KEY = "modelNoticesHidden";

function getModelNoticeHidden(): string[] {
  const data = window.localStorage.getItem(MODEL_NOTICES_HIDDEN_KEY) ?? "[]";

  try {
    return JSON.parse(data);
  } catch (_err) {
    return [];
  }
}

export function isModelNoticeHidden(structureSlug: string): boolean {
  if (!browser) {
    return true;
  }

  return (
    getModelNoticeHidden().find((slug) => slug === structureSlug) !== undefined
  );
}

export function hideModelNotice(structureSlug: string): void {
  window.localStorage.setItem(
    MODEL_NOTICES_HIDDEN_KEY,
    JSON.stringify([...getModelNoticeHidden(), structureSlug])
  );
}

export function showModelNotice(structureSlug: string): void {
  window.localStorage.setItem(
    MODEL_NOTICES_HIDDEN_KEY,
    JSON.stringify(
      getModelNoticeHidden().filter((slug) => slug !== structureSlug)
    )
  );
}
