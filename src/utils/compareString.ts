function compareStrings(a: string, b: string): boolean {
  return a.localeCompare(b, "gl", { sensitivity: "base" }) === 0;
}

function isStringInArray(array: string[], value: string): boolean {
  return array.some((item) => compareStrings(item, value));
}

function isStringInArrays(arrays: string[][], value: string): boolean {
  return arrays.some((array) => isStringInArray(array, value));
}

function areDifferentSolutions(a: string[] | undefined, b: string[]): boolean {
  return a === undefined
    ? false
    : a.length !== b.length || a.some((item) => !isStringInArray(b, item));
}

export {
  compareStrings,
  isStringInArray,
  isStringInArrays,
  areDifferentSolutions,
};
