<script>
  import CenteredGrid from "$lib/components/layout/centered-grid.svelte";
  import ServiceLine from "$lib/components/services/line.svelte";

  export let services = [];
  export let onRefresh;
  export let showStructure = true;
  export let readOnly = false;
</script>

<CenteredGrid --col-bg="var(--col-gray-00)" topPadded>
  <div class="col-span-full col-start-1 flex flex-col gap-s12 pb-s40">
    {#each services as service}
      <ServiceLine {service} {onRefresh} {showStructure} {readOnly} />
    {/each}
  </div>
</CenteredGrid>
