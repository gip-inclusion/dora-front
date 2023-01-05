<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/display/button.svelte";
  import CenteredGrid from "$lib/components/display/centered-grid.svelte";
  import FormErrors from "$lib/components/display/form-errors.svelte";
  import Form from "$lib/components/hoc/form.svelte";
  import FieldsCommon from "$lib/components/specialized/services/fields-common.svelte";
  import FieldsStructure from "$lib/components/specialized/services/fields-structure.svelte";
  import { createOrModifyModel } from "$lib/requests/services";
  import type { Model, ServicesOptions, ShortStructure } from "$lib/types";
  import { modelSchema } from "$lib/validation/schemas/service";

  export let model: Model;
  export let servicesOptions: ServicesOptions;
  export let structures: ShortStructure[];
  export let structure: ShortStructure;

  let requesting = false;

  function handleChange(validatedData) {
    structure = { ...model, ...validatedData };
  }

  function handleSubmit(validatedData) {
    return createOrModifyModel(validatedData);
  }

  async function handleSuccess(result) {
    goto(`/modeles/${result.slug}`);
  }
</script>

<Form
  data={model}
  schema={modelSchema}
  {servicesOptions}
  onChange={handleChange}
  onSubmit={handleSubmit}
  onSuccess={handleSuccess}
  bind:requesting
>
  <hr />
  <CenteredGrid bgColor="bg-info-light">
    <FormErrors />

    {#if structures.length}
      <div class="lg:w-2/3">
        <FieldsStructure
          bind:structure
          bind:service={model}
          bind:servicesOptions
          {structures}
          isModel
        />
      </div>
    {/if}
  </CenteredGrid>

  <hr />

  <CenteredGrid bgColor={"bg-info-light"}>
    <div class="lg:w-2/3">
      {#if model?.structure}
        <FieldsCommon
          bind:service={model}
          {servicesOptions}
          isModel
          serviceSchema={modelSchema}
          canAddChoices={!model.customizableChoicesSet}
          typologyFieldDisabled={model && model.canUpdateCategories === false}
        />
      {/if}
    </div>
  </CenteredGrid>

  <hr />

  {#if model?.structure}
    <CenteredGrid>
      <div class="flex flex-row gap-s12">
        <Button name="save" label="Enregistrer" disabled={requesting} />
      </div></CenteredGrid
    >
  {/if}
</Form>
