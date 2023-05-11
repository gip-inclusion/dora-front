<script lang="ts">
  // TODO: tout accepter - tout refuser - tout montrer - accepter/refuser individuellement

  import Notice from "$lib/components/display/notice.svelte";
  import type { StructureService } from "$lib/types";

  export let services: StructureService[] = [];

  $: servicesToUpdate = services.filter(({ modelChanged }) => modelChanged);
  $: updatedModels = new Set(
    servicesToUpdate.map(({ modelName }) => modelName)
  );
</script>

{#if services.length}
  <Notice
    title="Il existe des mises à jour pour {servicesToUpdate.length} de vos services"
    type="info"
  >
    <div>
      <p class="block">
        Suite à la mise à jour de {Array.from(updatedModels).join(", ")}
      </p>
      <ul class="block">
        {#each servicesToUpdate as service}
          <li>{service.name}</li>
        {/each}
      </ul>
    </div>
  </Notice>
{/if}
