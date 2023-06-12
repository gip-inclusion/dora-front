<script lang="ts">
  import type { ServiceSearchResult } from "$lib/types";
  import logoDataInclusion from "$lib/assets/logos/logo-di-monogram.svg";

  export let id: string;
  export let result: ServiceSearchResult;

  $: hasLocationTag = result.distance || result.location === "À distance";
</script>

<div
  {id}
  class="rounded-ml border border-gray-02  bg-gray-01 shadow-sm"
  tabindex="-1"
>
  <div class="relative p-s32 lg:pr-s64 ">
    <div class="mb-s24 flex items-center justify-between ">
      <div class="flex flex-col justify-between text-f14 md:flex-row md:gap-s8">
        <div>{result.structureInfo.name}</div>

        {#if result.location && result.location !== "À distance"}
          <div class="text-f14 font-bold text-gray-dark">
            {result.location}
          </div>
        {/if}
        <div class="w  flex flex-row">
          <img
            src={logoDataInclusion}
            alt="Data inclusion - Contributeur officiel"
            width="18"
          />
          <div
            class="ml-s8 inline rounded border border-gray-02 px-s4 text-f12 text-gray-text-alt2"
          >
            Source: {result.source}
          </div>
        </div>
      </div>
      <div class="flex items-center gap-s8">
        {#if hasLocationTag}
          <div
            class="whitespace-nowrap rounded-xl bg-france-blue py-s4 px-s10 text-f14 font-bold text-white"
          >
            {#if result.distance}
              à&nbsp;{result.distance}&nbsp;km
            {/if}
            {#if result.location === "À distance"}
              À distance
            {/if}
          </div>
        {/if}
      </div>
    </div>

    <h3 class="mb-s0 text-france-blue lg:mb-s24">
      <a
        class="full-result-link hover:underline"
        href="/services/di/{result.slug}"
      >
        {result.name}
      </a>
    </h3>

    <p class="relative z-10 mt-s16 hidden text-f16 text-gray-text md:block">
      <a href="/services/di/{result.slug}">{@html result.shortDesc}</a>
    </p>
  </div>
</div>

<style lang="postcss">
  /*
  * Link is on <h3> but we want all the card clickable (in an accessible way)
  * Source: http://inclusive-components.design/cards/
  */
  /* .full-result-link::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  } */
</style>
