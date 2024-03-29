<script lang="ts">
  import FieldSet from "$lib/components/display/fieldset.svelte";
  import Notice from "$lib/components/display/notice.svelte";
  import BasicInputField from "$lib/components/forms/fields/basic-input-field.svelte";
  import CheckboxesField from "$lib/components/forms/fields/checkboxes-field.svelte";
  import RadioButtonsField from "$lib/components/forms/fields/radio-buttons-field.svelte";
  import TextareaField from "$lib/components/forms/fields/textarea-field.svelte";
  import type { Model, Service, ServicesOptions } from "$lib/types";
  import { getModelInputProps } from "$lib/utils/forms";
  import { moveToTheEnd } from "$lib/utils/misc";
  import { isNotFreeService } from "$lib/utils/service";
  import FieldModel from "$lib/components/specialized/services/field-model.svelte";

  export let servicesOptions: ServicesOptions, service: Service;
  export let model: Model | undefined = undefined;

  $: showModel = !!service.model;

  function handleUseModelValue(fieldName) {
    service[fieldName] = model ? model[fieldName] : undefined;
  }

  $: fieldModelProps = model
    ? getModelInputProps({
        service,
        servicesOptions,
        showModel,
        onUseModelValue: handleUseModelValue,
        model,
      })
    : {};
</script>

<FieldSet title="Modalités" {showModel}>
  <div slot="help">
    <p class="text-f14">Modalités pour mobiliser le service.</p>
  </div>
  <Notice
    type="warning"
    title="Modalités d’orientation"
    showIcon={false}
    titleLevel="h3"
  >
    Afin que le service puisse être mobilisable, merci de choisir au moins une
    méthode d’orientation – soit pour l’accompagnateur, soit pour le
    bénéficiaire.
  </Notice>

  <div class="flex flex-col lg:gap-s8">
    <FieldModel {...fieldModelProps.coachOrientationModes ?? {}} type="array">
      <CheckboxesField
        id="coachOrientationModes"
        choices={moveToTheEnd(
          servicesOptions.coachOrientationModes,
          "value",
          "autre"
        )}
        bind:value={service.coachOrientationModes}
        description="Plusieurs choix possibles."
      />
    </FieldModel>

    {#if service.coachOrientationModes.includes("autre")}
      <FieldModel {...fieldModelProps.coachOrientationModesOther ?? {}}>
        <BasicInputField
          id="coachOrientationModesOther"
          hideLabel
          description="Merci de préciser la modalité"
          bind:value={service.coachOrientationModesOther}
        />
      </FieldModel>
    {/if}
  </div>

  <div class="flex flex-col lg:gap-s8">
    <FieldModel
      {...fieldModelProps.beneficiariesAccessModes ?? {}}
      type="array"
    >
      <CheckboxesField
        id="beneficiariesAccessModes"
        choices={moveToTheEnd(
          servicesOptions.beneficiariesAccessModes,
          "value",
          "autre"
        )}
        bind:value={service.beneficiariesAccessModes}
        description="Plusieurs choix possibles."
      />
    </FieldModel>

    {#if service.beneficiariesAccessModes.includes("autre")}
      <FieldModel {...fieldModelProps.beneficiariesAccessModesOther ?? {}}>
        <BasicInputField
          id="beneficiariesAccessModesOther"
          hideLabel
          description="Merci de préciser la modalité"
          bind:value={service.beneficiariesAccessModesOther}
        />
      </FieldModel>
    {/if}
  </div>

  <div class="flex flex-col gap-s24">
    <FieldModel
      {...fieldModelProps.feeCondition ?? {}}
      serviceValue={service.feeCondition}
      type="text"
    >
      <RadioButtonsField
        id="feeCondition"
        bind:value={service.feeCondition}
        choices={servicesOptions.feeConditions.filter(
          (fee) => fee.value !== "pass-numerique"
        )}
        description="Précisez si le service est gratuit ou payant pour les bénéficiaires."
      />
    </FieldModel>

    {#if isNotFreeService(service.feeCondition)}
      <FieldModel {...fieldModelProps.feeDetails ?? {}}>
        <TextareaField
          id="feeDetails"
          description="Détaillez les frais à la charge des bénéficiaires, y compris leurs montants."
          bind:value={service.feeDetails}
        />
      </FieldModel>
    {/if}
  </div>
</FieldSet>
