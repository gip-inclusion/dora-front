<script context="module">
  import TallyNpsPopup from "$lib/components/tally-nps-popup.svelte";
  import { NPS_OFFEROR_FORM_ID } from "$lib/const.js";
  import { getServicesOptions } from "$lib/services";

  export async function load() {
    return {
      props: {
        servicesOptions: await getServicesOptions(),
      },
    };
  }
</script>

<script>
  import { getStructure } from "$lib/structures";
  import { capitalize } from "$lib/utils.js";
  import { structure } from "../_store.js";

  import List from "./_list.svelte";

  async function handleRefresh() {
    $structure = await getStructure($structure.slug);
  }

  export let servicesOptions;
</script>

<svelte:head>
  <title>Services | {capitalize($structure.name)} | DORA</title>
  <meta name="description" content={$structure.shortDesc} />
</svelte:head>

<List
  services={$structure.services || []}
  {servicesOptions}
  structure={$structure}
  total={$structure.services.length}
  onRefresh={handleRefresh}
/>

{#if $structure.canWrite}
  <TallyNpsPopup formId={NPS_OFFEROR_FORM_ID} timeout={30000} />
{/if}
