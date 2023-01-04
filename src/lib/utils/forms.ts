import type { Model, Service, ServicesOptions } from "$lib/types";
import { modelSchema, serviceSchema } from "$lib/validation/schemas/service";

const defaultServiceCache = Object.fromEntries(
  Object.entries(serviceSchema).map(([fieldName, props]) => [
    fieldName,
    props.default,
  ])
);

export function getNewService() {
  return JSON.parse(JSON.stringify(defaultServiceCache));
}

const defaultModelCache = Object.fromEntries(
  Object.entries(modelSchema).map(([fieldName, props]) => [
    fieldName,
    props.default,
  ])
);

export function getNewModel() {
  return JSON.parse(JSON.stringify(defaultModelCache));
}

export function createModelFromService(service) {
  return JSON.parse(
    JSON.stringify(
      Object.fromEntries(
        Object.keys(modelSchema).map((fieldName) => [
          fieldName,
          service[fieldName],
        ])
      )
    )
  );
}

export function getModelInputProps(
  schema,
  service: Service,
  servicesOptions: ServicesOptions,
  showModel: boolean,
  useModelValue: (fieldName: string) => () => void,
  model?: Model
) {
  const result = Object.fromEntries(
    Object.keys(schema).map((fieldName) => [
      fieldName,
      {
        showModel,
        value: model ? model[fieldName] : null,
        serviceValue: service[fieldName],
        options:
          fieldName in servicesOptions ? servicesOptions[fieldName] : null,
        useValue: useModelValue(fieldName),
      },
    ])
  );
  console.log(result);
  return result;
}
