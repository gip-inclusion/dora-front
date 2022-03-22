<script>
  import LinkButton from "$lib/components/link-button.svelte";
  import StructureCard from "$lib/components/structures/card.svelte";
  import { addCircleIcon } from "$lib/icons";
  export let structure, antennes;
  export let hasButton = false;
</script>

<div class="col-span-full md:flex md:items-center md:justify-between">
  <h2 class="mb-s24 text-france-blue">Antennes</h2>
  <div class="flex gap-s16">
    {#if !!antennes.length && hasButton}
      <LinkButton
        label={`Voir toutes les antennes (${antennes.length})`}
        to="/structures/{structure.slug}/antennes"
        small
        secondary
      />
    {/if}
  </div>
</div>
<div class="col-span-full">
  <div class="mb-s48 grid gap-s16 md:grid-cols-2 lg:grid-cols-4">
    {#if structure.canWrite}
      <div
        class="flex items-center justify-center rounded-md px-s20 py-s24 shadow-md"
      >
        <LinkButton
          label="Ajouter une antenne…"
          to="/structures/creer"
          icon={addCircleIcon}
          noBackground
        />
      </div>
    {/if}
    {#each antennes as antenne}
      <StructureCard structure={antenne} readOnly={!structure.canWrite} />
    {/each}
  </div>
</div>
