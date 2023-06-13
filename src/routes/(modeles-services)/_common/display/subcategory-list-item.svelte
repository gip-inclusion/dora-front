<script lang="ts">
  import { addIcon, substractIcon } from "$lib/icons";
  import type { ServicesOptions } from "$lib/types";
  import {
    getCategoryIcon,
    getCategoryLabel,
    getSubCategoryLabel,
  } from "$lib/utils/service";

  export let categorySlug: string;
  export let subCategorySlugs: string[];
  export let servicesOptions: ServicesOptions;

  let expanded = false;
</script>

<div
  class="inline-flex flex-wrap items-center rounded-md bg-service-blue-light py-s8 px-s16 text-f14 text-magenta-dark"
>
  <div class="mr-s4 inline-flex items-center self-start">
    <span class="mr-s8 inline-block h-s24 w-s24 fill-current text-france-blue">
      {@html getCategoryIcon(categorySlug)}
    </span>

    <strong>
      {getCategoryLabel(categorySlug, servicesOptions).toUpperCase()}
    </strong>

    <button
      class="ml-s10 h-s24 w-s24 fill-current text-magenta-cta print:hidden"
      on:click={() => (expanded = !expanded)}
    >
      {#if !expanded}
        {@html addIcon}
      {:else}
        {@html substractIcon}
      {/if}
    </button>
  </div>

  <div class:hidden={!expanded} class="print:!block">
    {#each subCategorySlugs as subCategorySlug}
      {getSubCategoryLabel(subCategorySlug, servicesOptions)}
    {/each}
  </div>
</div>
