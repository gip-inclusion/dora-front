<script lang="ts">
  import LinkButton from "$lib/components/display/link-button.svelte";
  import StructureCard from "$lib/components/specialized/structure-card.svelte";
  import { home3Icon } from "$lib/icons";
  import Count from "../count.svelte";

  export let structure, branches, total;
  export let tabDisplay = true;
  export let limit;

  const departement = "tous";
  let filters;
  let branchesFiltered = [];

  function branchesFilter(allBranches) {
    let filteredBranches = allBranches.filter(
      (b) =>
        (departement === "tous" || b.department === departement) &&
        (!filters ||
          filters
            .split(" ")
            .every((filter) =>
              b.name.toLowerCase().includes(filter.toLowerCase()),
            )),
    );

    if (limit) {
      filteredBranches = filteredBranches.slice(0, limit);
    }

    return filteredBranches;
  }

  $: branchesFiltered = branchesFilter(branches);
</script>

<div class="mb-s24 md:flex md:items-center md:justify-between">
  <div class="flex flex-row gap-s8">
    <h2 class="mb-s0 text-france-blue">Antennes</h2>
    {#if limit}<Count>{total}</Count>{/if}
  </div>
  <div class="flex gap-s16">
    {#if !!branches.length && !tabDisplay}
      <LinkButton
        label="Voir toutes les antennes"
        to="/structures/{structure.slug}/antennes"
        small
        noBackground
      />
    {/if}
    {#if structure.canEditInformations}
      <LinkButton
        label="Ajouter une antenne"
        to="https://aide.dora.inclusion.beta.gouv.fr/fr/article/creer-une-ou-plusieurs-antennes-1xggiaw/"
        icon={home3Icon}
        otherTab
      />
    {/if}
  </div>
</div>

<div class="mb-s48 grid gap-s16 md:grid-cols-2 lg:grid-cols-3">
  {#each branchesFiltered as branch}
    <StructureCard structure={branch} />
  {/each}
</div>
