<script>
  import Button from "$lib/components/button.svelte";
  import Modal from "$lib/components/modal.svelte";
  import SchemaField from "../forms/schema-field.svelte";
  import schema from "$lib/schemas/service.js";
  import { formErrors } from "$lib/validation.js";
  import { createServiceFromModel } from "$lib/services";

  // import { goto } from "$app/navigation";

  export let structures = [];
  export let modelSlug;

  export let isOpen = false;

  let structure;

  async function createService() {
    if (structure) {
      const service = await createServiceFromModel(modelSlug, structure.slug);

      console.log(service);

      // goto(`/services/${service.slug}/editer/`);
    }
  }
</script>

<Modal bind:isOpen title="Création de service">
  <p>
    Sélectionnez la structure sur laquelle vous souhaitez ajouter un service.
  </p>
  <SchemaField
    type="select"
    schema={schema.structure}
    label={schema.structure.name}
    choices={structures.map((s) => ({ value: s.slug, label: s.name }))}
    name="structure"
    errorMessages={$formErrors.structure}
    bind:value={structure}
    sortSelect
    placeholder="Sélectionner"
  />

  <div class="mt-s32 flex flex-row justify-end gap-s16">
    <Button label="Valider" disabled={!structure} on:click={createService} />
  </div>
</Modal>
