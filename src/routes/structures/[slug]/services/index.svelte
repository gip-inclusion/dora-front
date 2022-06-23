<script>
  import { getStructure } from "$lib/structures";
  import { capitalize } from "$lib/utils.js";
  import { structure } from "../_store.js";

  import List from "./_list.svelte";

  async function handleRefresh(archiveOnly = false) {
    $structure = await getStructure($structure.slug, archiveOnly);
  }
</script>

<svelte:head>
  <title>Services | {capitalize($structure.name)} | DORA</title>
  <meta name="description" content={$structure.shortDesc} />
</svelte:head>

<List
  services={$structure.services || []}
  structure={$structure}
  total={$structure.services.length}
  onRefresh={handleRefresh}
/>
