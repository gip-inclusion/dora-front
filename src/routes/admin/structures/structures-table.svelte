<script lang="ts">
  import Button from "$lib/components/display/button.svelte";
  import Label from "$lib/components/display/label.svelte";
  import LinkButton from "$lib/components/display/link-button.svelte";
  import Tag from "$lib/components/display/tag.svelte";
  import { eyeIcon, homeIcon, phoneLineIcon } from "$lib/icons";
  import type { AdminShortStructure, ServicesOptions } from "$lib/types";

  import { capitalize, shortenString } from "$lib/utils/misc";
  import StructureModale from "./structure-modale.svelte";

  export let servicesOptions: ServicesOptions;
  export let filteredStructures: AdminShortStructure[];
  export let selectedStructureSlug: string | null;

  let isStructureModalOpen = false;
  let currentStructure: AdminShortStructure;
</script>

{#if currentStructure}
  <StructureModale
    bind:isOpen={isStructureModalOpen}
    structureSlug={currentStructure?.slug}
  />
{/if}

{#each filteredStructures as structure}
  <div
    class="flex flex-row gap-s16 rounded-md border border-gray-01 p-s16 "
    class:highlight={selectedStructureSlug === structure.slug}
    on:mouseenter={() => (selectedStructureSlug = structure.slug)}
    on:mouseleave={() => (selectedStructureSlug = null)}
  >
    <div class="flex grow flex-row items-center">
      <div>
        <div>
          <strong
            ><a href="/admin/structures/{structure.slug}" target="_blank">
              {shortenString(capitalize(structure.name))}
            </a>
          </strong>
          {#if structure.typologyDisplay}<span class="italic"
              >({shortenString(structure.typologyDisplay)})</span
            >{/if}

          <div />

          <div class="flex w-full flex-wrap gap-s4">
            {#each structure.categories as cat}
              <Tag bgColorClass="bg-magenta-brand"
                ><div class="whitespace-nowrap">
                  {servicesOptions.categories.find(
                    (option) => option.value === cat
                  )?.label}
                </div></Tag
              >{/each}
          </div>

          <div class="flex w-full flex-wrap gap-s4">
            {#if structure.hasAdmin}
              <Tag bgColorClass="bg-success"><div>administrée</div></Tag>
            {:else}
              <Tag bgColorClass="bg-error"><div>orpheline</div></Tag>
            {/if}
            {structure.numServices} services, {structure.numOutdatedServices}
            services à mettre à jour
          </div>
        </div>
      </div>
    </div>
    {#if structure.department}
      <Label label={structure.department || " "} smallIcon icon={homeIcon} />
    {/if}

    <LinkButton
      to="/structures/{structure.slug}"
      icon={eyeIcon}
      noBackground
      otherTab
    />
    <Button
      on:click={() => {
        console.log(structure);
        currentStructure = structure;
        isStructureModalOpen = true;
      }}
      icon={phoneLineIcon}
      noBackground
    />
  </div>
{/each}

<style lang="postcss">
  .highlight {
    @apply bg-gray-01 shadow-sm;
  }
</style>
