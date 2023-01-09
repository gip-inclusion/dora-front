<script lang="ts">
  import FieldSet from "$lib/components/display/fieldset.svelte";
  import AddableMultiSelectField from "$lib/components/inputs/addable-multiselect-field.svelte";
  import type { Model } from "$lib/types";
  import { getModelInputProps } from "$lib/utils/forms";
  import FieldModel from "./field-model.svelte";

  export let servicesOptions, serviceSchema, service, canAddChoices;
  // TODO: service.model?
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

<FieldSet title="Publics" {showModel}>
  <div slot="help">
    <p class="text-f14">
      Publics auxquels le service s’adresse. Vous pouvez ajouter vos propres
      valeurs avec le bouton « Ajouter une autre option ». Si votre service est
      ouvert à tous, sans critères ou prérequis, laissez les champs avec les
      options par défaut.
    </p>
  </div>

  {#if servicesOptions.concernedPublic.length}
    <FieldModel {...fieldModelProps["concernedPublic"]} type="array">
      <AddableMultiSelectField
        id="concernedPublic"
        bind:values={service.concernedPublic}
        structure={service.structure}
        choices={servicesOptions.concernedPublic}
        label="Profils"
        placeholder="Tous publics"
        placeholderMulti="Sélectionner"
        sort
        description="Plusieurs choix possibles"
        canAdd={canAddChoices}
      />
    </FieldModel>
  {/if}

  {#if servicesOptions.accessConditions.length}
    <FieldModel {...fieldModelProps["accessConditions"]} type="array">
      <AddableMultiSelectField
        id="accessConditions"
        bind:values={service.accessConditions}
        structure={service.structure}
        choices={servicesOptions.accessConditions}
        label="Critères"
        placeholder="Aucun"
        placeholderMulti="Choisir un autre critères d’admission"
        sort
        description="Plusieurs choix possibles"
        canAdd={canAddChoices}
      />
    </FieldModel>
  {/if}

  {#if servicesOptions.requirements.length}
    <FieldModel {...fieldModelProps["requirements"]} type="array">
      <AddableMultiSelectField
        id="requirements"
        bind:values={service.requirements}
        structure={service.structure}
        choices={servicesOptions.requirements}
        label="Pré-requis ou compétences"
        placeholder="Aucun"
        placeholderMulti="Choisir un autre pré-requis"
        sort
        description="Plusieurs choix possibles"
        canAdd={canAddChoices}
      />
    </FieldModel>
  {/if}
</FieldSet>
