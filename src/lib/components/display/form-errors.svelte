<script lang="ts">
  import Alert from "$lib/components/display/alert.svelte";
  import { formErrors } from "$lib/validation/validation";
</script>

{#if $formErrors.nonFieldErrors && $formErrors.nonFieldErrors.length}
  <div id="nonFieldErrors">
    {#each $formErrors.nonFieldErrors || [] as msg, i}
      <Alert id={`global-errors-${i}`} label={msg} />
    {/each}
  </div>
{/if}
