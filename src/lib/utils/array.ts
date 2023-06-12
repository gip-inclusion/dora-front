export function shuffleArray(array: Array<any>): Array<any> {
  return array
    .map((value) => ({ value, sortWeight: Math.random() }))
    .sort((a, b) => a.sortWeight - b.sortWeight)
    .map(({ value }) => value);
}

export function difference(array1: string[], array2: string[]): string[] {
  return array1.filter((x) => !array2.includes(x));
}
