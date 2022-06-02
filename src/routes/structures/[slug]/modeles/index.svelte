<script>
  import { capitalize } from "$lib/utils.js";
  import { structure } from "../_store.js";

  import List from "./_list.svelte";
</script>

<svelte:head>
  <title>Modèles | {capitalize($structure.name)} | DORA</title>
  <meta name="description" content={$structure.shortDesc} />
</svelte:head>

<List
  models={$structure.models || []}
  structure={$structure}
  total={$structure.models.length}
/>
