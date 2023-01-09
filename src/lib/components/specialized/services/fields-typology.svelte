<script lang="ts">
  import FieldSet from "$lib/components/display/fieldset.svelte";
  import CheckboxesField from "$lib/components/inputs/checkboxes-field.svelte";
  import MultiSelectField from "$lib/components/inputs/multi-select-field.svelte";
  import ToggleField from "$lib/components/inputs/toggle-field.svelte";
  import type { Model } from "$lib/types";
  import { getModelInputProps } from "$lib/utils/forms";

  import FieldCategory from "./field-category.svelte";
  import FieldModel from "./field-model.svelte";

  export let servicesOptions, serviceSchema, service;
  export let model: Model | undefined = undefined;
  export let noTopPadding = false;
  export let subcategories = [];
  let showModelSubcategoriesUseValue = true;

  let showModel;

  $: showModel = !!service.model;

  function useModelValue(fieldName) {
    return () => {
      service[fieldName] = model ? model[fieldName] : undefined;
    };
  }

  $: fieldModelProps = service.model
    ? getModelInputProps(
        serviceSchema,
        service,
        servicesOptions,
        showModel,
        useModelValue,
        service.model
      )
    : {};
</script>

<FieldSet title="Typologie" {showModel} {noTopPadding}>
  <FieldCategory
    bind:service
    bind:subcategories
    {servicesOptions}
    {model}
    {serviceSchema}
  />
  <div slot="help">
    <p class="text-f14">
      Classez le service par thématiques et besoins pour faciliter son
      référencement.
    </p>
  </div>

  <FieldModel
    {...fieldModelProps["subcategories"]}
    showUseValue={showModelSubcategoriesUseValue}
    type="array"
  >
    <MultiSelectField
      id="subcategories"
      label="Besoins"
      bind:value={service.subcategories}
      required
      choices={subcategories}
      placeholder="Sélectionner"
      placeholderMulti="Sélectionner"
    />
  </FieldModel>

  <FieldModel {...fieldModelProps["kinds"]} type="array">
    <CheckboxesField
      id="kinds"
      label="Types"
      bind:value={service.kinds}
      required
      choices={servicesOptions.kinds}
    />
  </FieldModel>

  <FieldModel {...fieldModelProps["isCumulative"]} type="boolean">
    <ToggleField
      id="isCumulative"
      label="Cumulable"
      bind:value={service.isCumulative}
      description="Cumulable avec d’autres services"
    />
  </FieldModel>
</FieldSet>
