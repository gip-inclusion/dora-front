import { browser } from "$app/environment";

const MODEL_NOTICE_HIDDEN_KEY = "modelNoticeHidden";

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
