<script lang="ts">
  import FieldSet from "$lib/components/display/fieldset.svelte";
  import BasicInputField from "$lib/components/inputs/basic-input-field.svelte";
  import RichTextField from "$lib/components/inputs/rich-text-field.svelte";
  import TextareaField from "$lib/components/inputs/textarea-field.svelte";
  import type { Model } from "$lib/types";
  import { getModelInputProps } from "$lib/utils/forms";
  import FieldModel from "./field-model.svelte";

  export let servicesOptions, serviceSchema, service;
  // TODO: service.model?
  export let model: Model | undefined = undefined;
  export let noTopPadding = false;

  let fullDesc;

  function useModelValue(fieldName) {
    return () => {
      service[fieldName] = model ? model[fieldName] : undefined;

      if (fieldName === "fullDesc") {
        fullDesc.updateValue(service.fullDesc);
      }
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

  let showModel;

  $: showModel = !!service.model;
</script>

<FieldSet title="Présentation" {showModel} {noTopPadding}>
  <div slot="help">
    <p class="text-f14">
      Le <b>Résumé</b> présente le service en une phrase courte. Il apparait dans
      les résultats de recherche.
    </p>
    <p class="text-f14">
      <strong>Exemple</strong> :
      <i>
        Faciliter vos déplacements en cas de reprise d’emploi ou de formation
        (entretien d’embauche, concours public…)
      </i>
    </p>
    <p class="text-f14">
      Si besoin, détaillez dans la partie
      <b>Description</b>.
    </p>
  </div>

  <FieldModel {...fieldModelProps["name"]}>
    <BasicInputField
      id="name"
      label="Titre"
      placeholder="Compléter"
      bind:value={service.name}
      required
    />
  </FieldModel>

  <FieldModel {...fieldModelProps["shortDesc"]}>
    <TextareaField
      id="shortDesc"
      description="280 caractères maximum"
      placeholder="Compléter"
      label="Résumé"
      bind:value={service.shortDesc}
      required
    />
  </FieldModel>

  <FieldModel {...fieldModelProps["fullDesc"]} paddingTop type="markdown">
    <RichTextField
      id="fullDesc"
      bind:this={fullDesc}
      label="Description"
      placeholder="Informations concernant le service et ses spécificités."
      vertical
      bind:value={service.fullDesc}
    />
  </FieldModel>
</FieldSet>
