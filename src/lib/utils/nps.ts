export function hasAnswerNpsForm(formId: string): boolean {
  const key = formatNpsAnswerLocalStorageKey(formId);
  return !!localStorage.getItem(key);
}

export function formatNpsAnswerLocalStorageKey(formId: string): string {
  return `popup_${formId}`;
}
