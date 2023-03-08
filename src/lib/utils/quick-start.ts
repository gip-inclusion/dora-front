import type { Structure } from "$lib/types";
import { structureSchema } from "$lib/validation/schemas/structure";
import { validate } from "$lib/validation/validation";
import type { UserInfo } from "$lib/utils/auth";

export function isStructureInformationsComplete(structure) {
  return validate(structure, structureSchema, {
    noScroll: true,
    showErrors: false,
  }).valid;
}

const quickStartKey = "quickStartsDone";

export function getQuickStartDoneValues(): string[] {
  const localStorageValue = window.localStorage.getItem(quickStartKey);
  return localStorageValue ? JSON.parse(localStorageValue) : [];
}

export function saveQuickStartDone(structureSlug: string) {
  const quickStartsAlreadyDone = getQuickStartDoneValues();
  window.localStorage.setItem(
    quickStartKey,
    JSON.stringify([...quickStartsAlreadyDone, structureSlug])
  );
}
export function clearQuickStartsDoneValues() {
  window.localStorage.removeItem(quickStartKey);
}

export function canShowQuickStart(structure: Structure): boolean {
  return !getQuickStartDoneValues().includes(structure.slug);
}
export function isFirstResearchDone(userInfos: UserInfo): boolean {
  return userInfos.extraInfos.hasDoneASearch;
}
export function hasOneService(structure: Structure): boolean {
  return structure.numServices > 0;
}
export function hasMembers(members: Array<any>): boolean {
  return members.length >= 2;
}
