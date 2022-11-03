<script>
  import List from "./_list.svelte";

  import { structure } from "../_store";
  import { capitalize } from "$lib/utils";
  import TallyNpsPopup from "$lib/components/tally-nps-popup.svelte";
  import { NPS_OFFEROR_FORM_ID } from "$lib/const";
</script>

<svelte:head>
  <title>Antennes | {capitalize($structure.name)} | DORA</title>
  <meta name="description" content={$structure.shortDesc} />
</svelte:head>

<List
  branches={$structure.branches}
  structure={$structure}
  total={$structure.branches.length}
/>

{#if $structure.canWrite}
  <TallyNpsPopup formId={NPS_OFFEROR_FORM_ID} timeout={30000} />
{/if}
