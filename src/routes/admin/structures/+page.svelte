<script lang="ts">
  import CenteredGrid from "$lib/components/display/centered-grid.svelte";
  import { getStructuresAdmin } from "$lib/requests/admin";
  import type { AdminShortStructure } from "$lib/types";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import Filters from "./filters.svelte";
  import StructuresMap from "./structures-map.svelte";
  import StructuresTable from "./structures-table.svelte";

  export let data: PageData;
  let structures: AdminShortStructure[] = [];
  let filteredStructures: AdminShortStructure[] = [];
  let department: number;
  let selectedStructureSlug: string | null = null;
  onMount(async () => {
    structures = await getStructuresAdmin();
  });
</script>

<CenteredGrid>
  <h2>Structures</h2>

  <Filters
    {structures}
    bind:filteredStructures
    servicesOptions={data.servicesOptions}
    structuresOptions={data.structuresOptions}
    bind:department
  />
  {#if structures?.length !== filteredStructures?.length}
    <div class="text-gray-text">
      ({filteredStructures.length} / {structures.length})
    </div>
  {/if}

  <div class="flex flex-col gap-s12">
    {#if structures}
      <div class="flex flex-col gap-s16 lg:flex-row">
        <div class="relative h-s512 w-full shrink-0 lg:h-[800px] lg:w-s512">
          <StructuresMap
            {filteredStructures}
            {department}
            bind:selectedStructureSlug
          />
        </div>
        <div>
          <StructuresTable
            {filteredStructures}
            servicesOptions={data.servicesOptions}
            bind:selectedStructureSlug
          />
        </div>
      </div>
    {:else}
      Chargement…
    {/if}
  </div>
</CenteredGrid>
