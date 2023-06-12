<script lang="ts">
  import Button from "$lib/components/display/button.svelte";
  import type { Service, ServicesOptions } from "$lib/types";
  import SubcategoryListItem from "./subcategory-list-item.svelte";

  export let service: Service;
  export let servicesOptions: ServicesOptions;

  let categoriesRecord: Record<string, string[]> = {};
  $: {
    categoriesRecord = {};

    service.subcategories.forEach((subCategorySlug) => {
      const [category, subcategory] = subCategorySlug.split("--");

      if (!categoriesRecord[category]) {
        categoriesRecord[category] = [];
      }
      categoriesRecord[category].push(subcategory);
    });
  }
</script>

<ul>
  {#each Object.entries(categoriesRecord) as [category, subcategory]}
    {category} => {subcategory}
    <hr />
  {/each}
</ul>
