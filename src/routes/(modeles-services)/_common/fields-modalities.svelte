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
  import FieldWrapper from "$lib/components/forms/field-wrapper.svelte";
  import Checkbox from "$lib/components/inputs/checkbox.svelte";
  import {
    currentFormData,
    currentSchema,
    formatErrors,
    isRequired,
  } from "$lib/validation/validation";

  export let servicesOptions: ServicesOptions, service: Service;
  export let model: Model | undefined = undefined;

  const orderedCoachOrientationModeValues = {
    "formulaire-dora": 0,
    "formulaire-externe": 1,
    "envoyer-fiche-prescription": 2,
    "envoyer-courriel": 3,
    telephoner: 4,
    autre: 5,
  };
  const orderedCoachOrientationModes =
    servicesOptions.coachOrientationModes.sort(
      (a, b) =>
        orderedCoachOrientationModeValues[a.value] -
        orderedCoachOrientationModeValues[b.value]
    );
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
      {#if $currentSchema && "coachOrientationModes" in $currentSchema}
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
            {#each orderedCoachOrientationModes as choice}
              {#if choice.value === "formulaire-externe" && service.coachOrientationModes.includes("formulaire-externe")}
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
                    description="Lien vers votre formulaire ou plateforme. Format attendu : https://example.fr"
                    type="url"
                    vertical
                    bind:value={service.coachOrientationModesExternalFormLink}
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
      {/if}
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
