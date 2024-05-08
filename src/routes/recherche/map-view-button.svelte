<script lang="ts">
  import mapViewImage from "$lib/assets/illustrations/map-view.jpg";

  import type { ServiceSearchResult } from "$lib/types";
  import Button from "$lib/components/display/button.svelte";
  import Modal from "$lib/components/hoc/modal.svelte";

  import type { PageData } from "./$types";
  import type { Filters } from "./result-filters.svelte";
  import ResultCount from "./result-count.svelte";
  import SearchResults from "./search-results.svelte";

  export let data: PageData;
  export let filters: Filters;
  export let filteredServices: ServiceSearchResult[];

  let isOpen = false;
</script>

<div
  style={`background-image: url('${mapViewImage}'); height: 116px`}
  class="flex items-center justify-center rounded-ml bg-cover"
>
  <Button label="Voir sur la carte" on:click={() => (isOpen = true)} />
  <Modal bind:isOpen hideTitle canClose={false}>
    <div class="flex">
      <div class="flex w-[384px] flex-col gap-s32">
        <div class="flex flex-col gap-s8">
          <Button label="Fermer la carte" on:click={() => (isOpen = false)} />
          <Button label="Affiner la recherche" secondary />
        </div>
        <div class="flex flex-col gap-s24">
          <ResultCount
            resultCount={filteredServices.length}
            cityLabel={data.cityLabel}
          />
          {#if filteredServices.length}
            <SearchResults
              {data}
              {filters}
              {filteredServices}
              summarized
              noAlertButtonBottomGap
            />
          {/if}
        </div>
      </div>
      <div></div>
    </div>
  </Modal>
</div>
