<script>
  import { goto } from "$app/navigation";

  import { validate } from "$lib/validation.js";
  import serviceSchema from "$lib/schemas/service.js";
  import { createOrModifyService } from "$lib/services";
  import { logException } from "$lib/logger";

  import Button from "$lib/components/button.svelte";
  import CenteredGrid from "$lib/components/layout/centered-grid.svelte";

  export let model;

  async function save() {
    // Validate the whole form
    const { validatedData, valid } = validate(
      model,
      serviceSchema,
      serviceSchema,
      { skipDependenciesCheck: true, noScroll: false }
    );

    if (valid) {
      // Validation OK, let's send it to the API endpoint
      try {
        const result = await createOrModifyService(validatedData);

        goto(`/modeles/${result.slug}`);
      } catch (error) {
        logException(error);
      }
    }
  }
</script>

<CenteredGrid>
  <div class="flex flex-row gap-s12">
    <Button on:click={save} name="publish" label="Enregistrer" />
  </div>
</CenteredGrid>
