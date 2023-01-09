<script lang="ts">
  import FieldSet from "$lib/components/display/fieldset.svelte";
  import AddableMultiSelectField from "$lib/components/inputs/addable-multiselect-field.svelte";
  import BasicInputField from "$lib/components/inputs/basic-input-field.svelte";
  import UploadField from "$lib/components/inputs/upload-field.svelte";
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

<FieldSet title="Documents" {showModel}>
  <div slot="help">
    <p class="text-f14">
      Justificatifs à fournir et documents à compléter pour postuler. Le lien
      redirige vers une page web qui présente le service (formulaire, fiche de
      prescription, simulateurs, etc.)
    </p>
  </div>

  <FieldModel {...fieldModelProps["forms"]} type="files">
    <UploadField
      id="forms"
      label="Documents à compléter"
      structureSlug={service.structure}
      on:blur
      bind:fileKeys={service.forms}
    />
  </FieldModel>

  {#if servicesOptions.credentials.length}
    <FieldModel {...fieldModelProps["credentials"]} type="array">
      <AddableMultiSelectField
        id="credentials"
        bind:values={service.credentials}
        structure={service.structure}
        choices={servicesOptions.credentials}
        label="Justificatifs à fournir"
        placeholder="Aucun"
        placeholderMulti="Choisir un autre justificatif"
        sort
        canAdd={canAddChoices}
      />
    </FieldModel>
  {/if}

  <FieldModel {...fieldModelProps["onlineForm"]}>
    <BasicInputField
      id="onlineForm"
      label="Lien"
      placeholder="URL"
      type="url"
      bind:value={service.onlineForm}
    />
  </FieldModel>
</FieldSet>
