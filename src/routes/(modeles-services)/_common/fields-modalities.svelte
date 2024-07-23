<script lang="ts">
  import FieldSet from "$lib/components/display/fieldset.svelte";
  import Notice from "$lib/components/display/notice.svelte";
  import BasicInputField from "$lib/components/forms/fields/basic-input-field.svelte";
  import RadioButtonsField from "$lib/components/forms/fields/radio-buttons-field.svelte";
  import TextareaField from "$lib/components/forms/fields/textarea-field.svelte";
  import type { Model, Service, ServicesOptions } from "$lib/types";
  import { getModelInputProps } from "$lib/utils/forms";
  import { isNotFreeService } from "$lib/utils/service";
  import FieldModel from "$lib/components/specialized/services/field-model.svelte";
  import FieldWrapper from "$lib/components/forms/field-wrapper.svelte";
  import Checkbox from "$lib/components/inputs/checkbox.svelte";
  import {
    currentFormData,
    currentSchema,
    formatErrors,
    isRequired,
  } from "$lib/validation/validation";

  import FieldsModalitiesBeneficiary from "./fields-modalities-beneficiary.svelte";
  import {
    orderedBeneficiariesAccessModeValues,
    orderedCoachOrientationModeValues,
  } from "./modalities-order";

  export let servicesOptions: ServicesOptions, service: Service;
  export let model: Model | undefined = undefined;

  let coachOrientationModesFocusValue: string | undefined = undefined;

  function handleUseModelValue(fieldName) {
    service[fieldName] = model ? model[fieldName] : undefined;
  }

  $: showModel = !!service.model;

  $: fieldModelProps = model
    ? getModelInputProps({
        service,
        servicesOptions,
        showModel,
        onUseModelValue: handleUseModelValue,
        model,
      })
    : {};

  $: servicesOptions.coachOrientationModes.sort(
    (a, b) =>
      orderedCoachOrientationModeValues[a.value] -
      orderedCoachOrientationModeValues[b.value]
  );
  $: fieldModelProps.coachOrientationModes?.value.sort((a, b) => {
    return (
      orderedCoachOrientationModeValues[a] -
      orderedCoachOrientationModeValues[b]
    );
  });
  $: fieldModelProps.coachOrientationModes?.serviceValue.sort((a, b) => {
    return (
      orderedCoachOrientationModeValues[a] -
      orderedCoachOrientationModeValues[b]
    );
  });
  $: fieldModelProps.beneficiariesAccessModes?.value.sort((a, b) => {
    return (
      orderedBeneficiariesAccessModeValues[a] -
      orderedBeneficiariesAccessModeValues[b]
    );
  });
  $: fieldModelProps.beneficiariesAccessModes?.serviceValue.sort((a, b) => {
    return (
      orderedBeneficiariesAccessModeValues[a] -
      orderedBeneficiariesAccessModeValues[b]
    );
  });
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
    {#if $currentSchema && "coachOrientationModes" in $currentSchema && "coachOrientationModesExternalFormLink" in $currentSchema && "coachOrientationModesExternalFormLinkText" in $currentSchema && "coachOrientationModesOther" in $currentSchema}
      <FieldModel
        {...fieldModelProps.coachOrientationModes ?? {}}
        subFields={fieldModelProps.coachOrientationModes
          ? {
              "completer-le-formulaire-dadhesion": [
                {
                  label:
                    $currentSchema.coachOrientationModesExternalFormLink.label,
                  ...fieldModelProps.coachOrientationModesExternalFormLink,
                },
                {
                  label:
                    $currentSchema.coachOrientationModesExternalFormLinkText
                      .label,
                  ...fieldModelProps.coachOrientationModesExternalFormLinkText,
                },
              ],
              autre: [fieldModelProps.coachOrientationModesOther],
            }
          : undefined}
        type="array"
      >
        {@const id = "coachOrientationModes"}
        <FieldWrapper
          {id}
          let:onChange
          let:errorMessages
          label={$currentSchema[id].label}
          required={isRequired($currentSchema[id], $currentFormData)}
          description="Plusieurs choix possibles."
          readonly={$currentSchema?.[id]?.readonly}
        >
          <div class="flex flex-col gap-s8">
            {#each servicesOptions.coachOrientationModes as choice}
              {#if choice.value === "completer-le-formulaire-dadhesion" && service.coachOrientationModes.includes("completer-le-formulaire-dadhesion")}
                <Checkbox
                  name={id}
                  bind:group={service.coachOrientationModes}
                  label={choice.label}
                  value={choice.value}
                  readonly={$currentSchema?.[id]?.readonly}
                  errorMessage={formatErrors(id, errorMessages)}
                  focused={coachOrientationModesFocusValue === choice.value}
                  on:change={onChange}
                  on:focus={() =>
                    (coachOrientationModesFocusValue = choice.value)}
                  on:blur={() => (coachOrientationModesFocusValue = undefined)}
                >
                  <BasicInputField
                    id="coachOrientationModesExternalFormLinkText"
                    description="Par exemple : Orienter votre bénéficiaire, Faire une simulation, Prendre rendez-vous, etc."
                    placeholder="Orienter votre bénéficiaire"
                    vertical
                    bind:value={service.coachOrientationModesExternalFormLinkText}
                  />
                  <BasicInputField
                    id="coachOrientationModesExternalFormLink"
                    description="Lien vers votre formulaire ou plateforme. Format attendu : https://exemple.fr"
                    type="url"
                    vertical
                    bind:value={service.coachOrientationModesExternalFormLink}
                  />
                </Checkbox>
              {:else if choice.value === "autre" && service.coachOrientationModes.includes("autre")}
                <Checkbox
                  name={id}
                  bind:group={service.coachOrientationModes}
                  label={choice.label}
                  value={choice.value}
                  readonly={$currentSchema?.[id]?.readonly}
                  errorMessage={formatErrors(id, errorMessages)}
                  focused={coachOrientationModesFocusValue === choice.value}
                  on:change={onChange}
                  on:focus={() =>
                    (coachOrientationModesFocusValue = choice.value)}
                  on:blur={() => (coachOrientationModesFocusValue = undefined)}
                >
                  <BasicInputField
                    id="coachOrientationModesOther"
                    hideLabel
                    vertical
                    bind:value={service.coachOrientationModesOther}
                  />
                </Checkbox>
              {:else}
                <Checkbox
                  name={id}
                  bind:group={service.coachOrientationModes}
                  label={choice.label}
                  value={choice.value}
                  readonly={$currentSchema?.[id]?.readonly}
                  errorMessage={formatErrors(id, errorMessages)}
                  focused={coachOrientationModesFocusValue === choice.value}
                  on:change={onChange}
                  on:focus={() =>
                    (coachOrientationModesFocusValue = choice.value)}
                  on:blur={() => (coachOrientationModesFocusValue = undefined)}
                />
              {/if}
            {/each}
          </div>
        </FieldWrapper>
      </FieldModel>
    {/if}
  </div>

  <div class="flex flex-col lg:gap-s8">
    {#if $currentSchema && "beneficiariesAccessModes" in $currentSchema && "beneficiariesAccessModesExternalFormLink" in $currentSchema && "beneficiariesAccessModesExternalFormLinkText" in $currentSchema && "beneficiariesAccessModesOther" in $currentSchema}
      <FieldModel
        {...fieldModelProps.beneficiariesAccessModes ?? {}}
        subFields={fieldModelProps.beneficiariesAccessModes
          ? {
              "completer-le-formulaire-dadhesion": [
                {
                  label:
                    $currentSchema.beneficiariesAccessModesExternalFormLink
                      .label,
                  ...fieldModelProps.beneficiariesAccessModesExternalFormLink,
                },
                {
                  label:
                    $currentSchema.beneficiariesAccessModesExternalFormLinkText
                      .label,
                  ...fieldModelProps.beneficiariesAccessModesExternalFormLinkText,
                },
              ],
              autre: [fieldModelProps.beneficiariesAccessModesOther],
            }
          : undefined}
        type="array"
      >
        <FieldsModalitiesBeneficiary
          id="beneficiariesAccessModes"
          {service}
          {servicesOptions}
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
