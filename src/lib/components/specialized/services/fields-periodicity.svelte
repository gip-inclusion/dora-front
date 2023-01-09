<script lang="ts">
  import FieldSet from "$lib/components/display/fieldset.svelte";
  import BasicInputField from "$lib/components/inputs/basic-input-field.svelte";
  import type { Model } from "$lib/types";
  import { getModelInputProps } from "$lib/utils/forms";
  import FieldModel from "./field-model.svelte";

  export let servicesOptions, serviceSchema, service;
  export let model: Model | undefined = undefined;

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

<FieldSet title="Périodicité" {showModel}>
  <div slot="help">
    <p class="text-f14">
      La durée limitée permet de supendre automatiquement la visibilité du
      service dans les résultat de recherche.
    </p>
  </div>
  <FieldModel {...fieldModelProps["recurrence"]}>
    <BasicInputField
      id="recurrence"
      label="Fréquence et horaires"
      placeholder="Ex. Tous les jours à 14h, une fois par mois, etc."
      bind:value={service.recurrence}
    />
  </FieldModel>

  <FieldModel {...fieldModelProps["suspensionDate"]}>
    <BasicInputField
      id="suspensionDate"
      label="Date de fin"
      type="date"
      bind:value={service.suspensionDate}
    />
  </FieldModel>
</FieldSet>
