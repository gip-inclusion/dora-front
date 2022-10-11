export function isInDeploymentDepartments(cityCode: string) {
  return (
    cityCode.startsWith("08") ||
    cityCode.startsWith("11") ||
    cityCode.startsWith("974")
  );
}
