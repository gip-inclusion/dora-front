import type { Choice } from "$lib/types";

export function getChoiceFromValue(value: string, choices: Choice[]): Choice {
  return choices.find((c) => c.value === value);
}
export function getLabelFromValue(value: string, choices: Choice[]): string {
  return getChoiceFromValue(value, choices).label;
}
export function getChoicesFromKey(key: string, choices: Choice[]) {
  const results = choices.filter((choice) => choice.value.startsWith(key));

  return results;
}
export function getKeyFromChoice(choice: Choice): string {
  return choice.value.split("--")[0];
}
export function injectOptGroupInSubCategories(choices: Choice[]): Choice[] {
  choices.forEach((choice) => {
    choice.optGroupKey = getKeyFromChoice(choice);
  });
  return choices;
}

export function injectOptGroupAllOptionInSubCategories(
  optGroups: Choice[],
  choices: Choice[],
  allOptionLabel = "Tous"
) {
  optGroups.forEach((optGroup: Choice) => {
    const allKey = `${optGroup.value}--all`;

    const currentValues = choices.map((v) => v.value);
    if (currentValues.includes(allKey)) return;

    choices.push({
      value: allKey,
      label: allOptionLabel,
      optGroupKey: optGroup.value,
      icon: optGroup.icon,
      selectedLabel: optGroup.label,
    });
  });
  return choices;
}
