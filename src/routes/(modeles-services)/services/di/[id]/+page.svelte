<script lang="ts">
  import CenteredGrid from "$lib/components/display/centered-grid.svelte";
  import ServiceHeader from "../../[slug]/service-header.svelte";
  import ServiceBody from "../../../_common/display/service-body.svelte";
  // import { trackService } from "$lib/utils/plausible";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  onMount(() => {
    // TODO
    // trackService(data.service);
  });
</script>

<!-- TODO: afficher D·I + la source -->
<!-- TODO: corriger le lien de partage -->
<!-- TODO: afficher le lien original ? -->

{#if data.service}
  <CenteredGrid bgColor="bg-france-blue print:bg-white">
    <ServiceHeader service={data.service} isDI />
  </CenteredGrid>

  <ServiceBody
    service={data.service}
    servicesOptions={data.servicesOptions}
    isDI
  />
{/if}
