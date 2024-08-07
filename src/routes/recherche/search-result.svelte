<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  import Button from "$lib/components/display/button.svelte";
  import LinkButton from "$lib/components/display/link-button.svelte";
  import Bookmarkable from "$lib/components/hoc/bookmarkable.svelte";
  import FavoriteIcon from "$lib/components/specialized/favorite-icon.svelte";
  import type { ServiceSearchResult } from "$lib/types";
  import { token } from "$lib/utils/auth";
  import { registerMatomoExperiment } from "$lib/utils/matomo";
  import { trackMobilisation } from "$lib/utils/stats";

  export let id: string;
  export let result: ServiceSearchResult;
  export let searchId: number | null;
  export let categoryId: string;
  export let subCategoryIds: string[];
  export let selected = false;
  export let summarized = false;

  let element: HTMLDivElement;

  $: isDI = result.type === "di";

  $: onSite =
    result.locationKinds.includes("en-presentiel") &&
    result.distance != null &&
    result.distance <= 50;
  $: remote = result.locationKinds.includes("a-distance");

  $: servicePagePath = `/services/${
    isDI ? "di--" : ""
  }${result.slug}?searchId=${searchId}`;

  $: {
    if (selected) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }

  let redirectToOrientationForm = true;

  function handleOrientationClick() {
    if ($token) {
      const service = isDI
        ? {
            ...result,
            categories: [categoryId],
            subcategories: subCategoryIds,
          }
        : result;
      trackMobilisation(service, $page.url, isDI, searchId || undefined);
    }
    const slug = `${isDI ? "di--" : ""}${result.slug}`;
    const queryString = searchId
      ? new URLSearchParams({ searchId: searchId.toString() }).toString()
      : "";
    goto(`/services/${slug}/orienter?${queryString}`);
  }

  registerMatomoExperiment({
    name: "CTA-Orienter",
    includedTargets: [
      { attribute: "url", inverted: "0", type: "any", value: "" },
    ],
    excludedTargets: [],
    variations: [
      {
        name: "Fiche-service",
        activate: function () {
          redirectToOrientationForm = false;
        },
      },
    ],
  });
</script>

<Bookmarkable slug={result.slug} {isDI} let:onBookmark let:isBookmarked>
  <div
    bind:this={element}
    {id}
    class="rounded-ml border shadow-sm"
    class:border-gray-02={!selected}
    class:border-magenta-cta={selected}
    tabindex="-1"
  >
    <div class="relative p-s32 lg:pr-s64">
      <div class="mb-s4 flex items-center justify-between">
        <div class="text-f14">
          {result.structureInfo.name}
        </div>
        <div class="flex items-center gap-s8">
          <FavoriteIcon on:click={onBookmark} active={isBookmarked} />
        </div>
      </div>

      <h3 class="mb-s12 text-france-blue">
        <a
          class="full-result-link hover:underline"
          href={servicePagePath}
          target="_blank"
        >
          {result.name}
        </a>
      </h3>

      <div class="flex flex-wrap items-baseline gap-s6">
        {#if onSite}
          <div class="text-f16 text-france-blue">
            {result.address1}{#if result.address2}, {result.address2}{/if},
            {result.postalCode}&nbsp;{result.city}
          </div>
          <!-- On n'affiche pas la distance lorsqu'elle n'est pas fournie ou
               lorsqu'il s'agit d'un service DORA et que la distance est de 0. -->
          {#if typeof result.distance === "number" && !(!isDI && result.distance === 0)}
            <div class="tag">
              {#if result.distance === 0}
                &lt; 1 km
              {:else}
                à&nbsp;{result.distance < 10
                  ? Math.round(result.distance * 10) / 10
                  : Math.round(result.distance)} km
              {/if}
            </div>
          {/if}
        {/if}
        {#if remote}
          <div class="tag">
            {#if onSite}
              Également disponible à distance
            {:else}
              À distance
            {/if}
          </div>
        {/if}
      </div>

      {#if !summarized}
        <p class="relative z-10 mt-s16 hidden text-f16 text-gray-text md:block">
          <a href={servicePagePath} target="_blank">{result.shortDesc}</a>
        </p>
        <div
          class={`mt-s24 flex flex-col items-center gap-s24 md:flex-row ${isDI ? "justify-between" : "justify-end"}`}
        >
          {#if isDI}
            <div
              class="inline rounded border border-gray-02 px-s8 py-s2 text-f12 text-gray-text"
            >
              Source&nbsp;: {result.diSourceDisplay}, via data·inclusion
            </div>
          {/if}
          <div class="flex shrink-0 flex-col items-center gap-s24 md:flex-row">
            <a
              href={servicePagePath}
              target="_blank"
              class="text-magenta-cta underline">Voir la fiche détaillée</a
            >
            {#if result.isOrientable && result.coachOrientationModes?.includes("formulaire-dora")}
              {#if redirectToOrientationForm}
                <Button
                  on:click={handleOrientationClick}
                  label="Orienter votre bénéficiaire"
                  secondary
                  small
                />
              {:else}
                <LinkButton
                  to={servicePagePath}
                  label="Orienter votre bénéficiaire"
                  secondary
                  small
                />
              {/if}
            {/if}
          </div>
        </div>
      {/if}
    </div>
  </div>
</Bookmarkable>

<style lang="postcss">
  .tag {
    @apply whitespace-nowrap rounded-xl bg-blue-information px-s8 py-s0 text-f14 text-france-blue;
  }
</style>
