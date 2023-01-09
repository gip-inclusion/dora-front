<script lang="ts">
  import FieldSet from "$lib/components/display/fieldset.svelte";
  import BasicInputField from "$lib/components/inputs/basic-input-field.svelte";
  import type { Model } from "$lib/types";
  import { getModelInputProps } from "$lib/utils/forms";
  import FieldModel from "./field-model.svelte";

  export let servicesOptions, serviceSchema, service, canAddChoices;
  export let isModel = false;
  export let model: Model | undefined = undefined;
  export let typologyFieldDisabled = false;

  let showModel;

  $: showModel = !!service.model;

  function useModelValue(fieldName) {
    return () => {
      service[fieldName] = model ? model[fieldName] : undefined;
    };
  }

  $: fieldModelProps = getModelInputProps(
    serviceSchema,
    service,
    servicesOptions,
    showModel,
    useModelValue,
    model
  );
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
