import serviceSchema from "$lib/schemas/service-contrib";

const defaultServiceCache = Object.fromEntries(
  Object.entries(serviceSchema).map(([fieldName, props]) => [
    fieldName,
    props.default,
  ])
);

export function getNewService() {
  return JSON.parse(JSON.stringify(defaultServiceCache));
}
