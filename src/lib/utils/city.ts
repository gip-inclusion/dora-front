import type { ServicesOptions } from "$lib/types";

export function isInDeploymentDepartments(
  cityCode: string,
  servicesOptions: ServicesOptions
): boolean {
  console.log({ servicesOptions });
  return (
    servicesOptions.deploymentDepartments.filter((department) =>
      cityCode.startsWith(department)
    ).length > 0
  );
}
