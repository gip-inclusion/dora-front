<script context="module">
  import { getStructuresOptions } from "$lib/structures";

  export async function load() {
    return {
      props: {
        structuresOptions: await getStructuresOptions(),
      },
    };
  }
</script>

<script>
  import { getStructure } from "$lib/structures";
  import EnsureLoggedIn from "$lib/components/ensure-logged-in.svelte";
  import StructureFormWrapper from "$lib/components/structures/form-wrapper.svelte";
  import { structure } from "./_store";

  export let structuresOptions;

  async function handleRefresh() {
    $structure = await getStructure($structure.slug);
  }
</script>

<svelte:head>
  <title>{$structure.name} | Éditer | DORA</title>
</svelte:head>

<EnsureLoggedIn>
  <div class="col-span-8 col-start-1 mb-s32">
    <StructureFormWrapper
      structure={$structure}
      {structuresOptions}
      modify
      formTitle="Informations"
      visible
      onRefresh={handleRefresh}
    />
  </div>
</EnsureLoggedIn>
