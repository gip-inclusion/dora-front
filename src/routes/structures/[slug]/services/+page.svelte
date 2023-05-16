<script lang="ts">
  import { getStructure } from "$lib/requests/structures";
  import { structure } from "../store";
  import type { PageData } from "./$types";
  import List from "./list.svelte";

  export let data: PageData;
  async function handleRefresh() {
    console.log("handleRefresh1");
    $structure = await getStructure($structure.slug);
    console.log("handleRefresh2");
  }
</script>

<List
  servicesOptions={data.servicesOptions}
  serviceStatus={data.serviceStatus}
  updateStatus={data.updateStatus}
  structure={$structure}
  total={$structure.services.length}
  onRefresh={handleRefresh}
  withEmptyNotice
/>
