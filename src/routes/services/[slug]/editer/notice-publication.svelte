<script lang="ts">
  import Notice from "$lib/components/display/notice.svelte";
  import { serviceSchema } from "$lib/validation/schemas/service";
  import { validate } from "$lib/validation/validation";
  import { onMount } from "svelte";

  export let service, servicesOptions;

  let invalidFields = [];
  let errors = 1;
  onMount(() => {
    const validation = validate(service, serviceSchema, {
      noScroll: true,
      showErrors: false,
      servicesOptions,
    });
    invalidFields = validation?.errorFields;
  });
</script>

{#if invalidFields.length}
  <Notice
    title={`Information${errors ? "s" : ""} requise${
      errors ? "s" : ""
    } pour publier`}
    type="warning"
  >
    <p class="text-f14 first-letter:capitalize">
      {invalidFields.join(", ")}.
    </p>
  </Notice>
{/if}
