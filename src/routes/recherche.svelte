<script context="module" lang="ts">
  import { getServicesOptions } from "$lib/services";
  import { getApiURL } from "$lib/utils/api.js";
  import { getQuery } from "./_homepage/_search";
  import { trackSearch } from "$lib/utils/plausible.js";

  async function getResults({
    categoryIds,
    subCategoryIds,
    cityCode,
    cityLabel,
    kindId,
    fee,
  }) {
    const query = getQuery({
      categoryIds,
      subCategoryIds,
      cityCode,
      cityLabel,
      kindId,
      fee,
    });
    const url = `${getApiURL()}/search/?${query}`;

    const res = await fetch(url, {
      headers: { Accept: "application/json; version=1.0" },
    });

    if (res.ok) {
      return await res.json();
    }

    // TODO: log errors
    try {
      console.error(await res.json());
    } catch (err) {
      console.error(err);
    }
    return [];
  }
  export async function load({ url }) {
    const query = url.searchParams;
    const categoryIds = query.get("cat") ? query.get("cat").split(",") : [];
    const subCategoryIds = query.get("sub") ? query.get("sub").split(",") : [];
    const cityCode = query.get("city");
    const cityLabel = query.get("cl");
    const kindId = query.get("kinds");
    const fee = query.get("fee") ? query.get("fee").split(",") : [];

    const services = await getResults({
      categoryIds,
      subCategoryIds,
      cityCode,
      cityLabel,
      kindId,
      fee,
    });
    trackSearch(
      categoryIds,
      subCategoryIds,
      cityCode,
      cityLabel,
      kindId,
      fee,
      services.length
    );
    return {
      props: {
        categoryIds,
        subCategoryIds,
        cityCode,
        cityLabel,
        kindId,
        fee,
        services,
        servicesOptions: await getServicesOptions(),
      },
    };
  }
</script>

<script lang="ts">
  import CenteredGrid from "$lib/components/layout/centered-grid.svelte";

  import SearchResult from "./_homepage/_search-result.svelte";
  import SearchPromo from "./_homepage/_search-promo.svelte";

  import NewsletterButton from "$lib/components/newsletter-button.svelte";
  import TallyNpsPopup from "$lib/components/tally-nps-popup.svelte";
  import { NPS_SEEKER_FORM_ID } from "$lib/const";
  import type { FeeCondition, ServicesOptions } from "$lib/types";
  import Breadcrumb from "$lib/components/breadcrumb.svelte";
  import SearchForm from "./_homepage/_search-form.svelte";
  import ServiceSuggestionNotice from "./_homepage/_service-suggestion-notice.svelte";
  import DoraDeploymentNotice from "./_homepage/_dora-deployment-notice.svelte";
  import { isInDeploymentDepartments } from "$lib/utils/city";
  // import OnlyNationalResultsNotice from "./_homepage/_only-national-results-notice.svelte";

  export let servicesOptions: ServicesOptions;
  export let categoryIds: string[];
  export let subCategoryIds: string[];
  export let cityCode: string;
  export let cityLabel: string;
  export let kindId: string;
  export let fee: FeeCondition[];
  export let services;

  let tags = [];

  function computeCategoryId(
    categoryIds: string[],
    subCategoryIds: string[]
  ): string | undefined {
    if (categoryIds.length) return categoryIds[0]; // TODO: fix later

    if (subCategoryIds.length) {
      return subCategoryIds[0].split("--")[0];
    }
  }

  /*
  function hasOnlyNationalResults(services: Service[]) {
    return false;
  }
  */

  $: showDeploymentNotice = !isInDeploymentDepartments(cityCode);
  $: {
    tags = [];

    if (categoryIds.length) {
      let categoryValue = computeCategoryId(categoryIds, subCategoryIds);

      const categoryTag = servicesOptions.categories.find(
        (c) => c.value === categoryValue
      );

      if (categoryTag) {
        tags = [categoryTag];
      }

      if (categoryTag && subCategoryIds) {
        const subCategoryTag = servicesOptions.subcategories.find(
          (c) => c.value === subCategoryIds[0] // TODO: fix search
        );

        if (subCategoryTag) {
          tags = [...tags, subCategoryTag];
        }
      }
    }

    if (cityLabel) {
      tags = [...tags, { label: cityLabel }];
    }

    if (kindId) {
      const kindTag = servicesOptions.kinds.find((c) => c.value === kindId);

      if (kindTag) {
        tags = [...tags, kindTag];
      }
    }

    if (fee.length) {
      tags = [...tags, { label: "Frais à charge" }];
    }
  }
</script>

<svelte:head>
  <title>
    Services d’insertion : {tags.map((t) => t.label).join(", ")} | Recherche | DORA
  </title>
</svelte:head>

<CenteredGrid bgColor="bg-blue-light">
  <div>
    <h1 class="sr-only">
      Résultats de votre recherche de services d’insertion
    </h1>

    <div class="mb-s24">
      <Breadcrumb currentLocation="search" />
    </div>

    <SearchForm
      {servicesOptions}
      {cityCode}
      {cityLabel}
      subCategoryIds={[
        ...subCategoryIds,
        ...categoryIds.map((c) => `${c}--all`),
      ]}
      showDeploymentWarning={false}
      useAdditionalFilters
    />
  </div>
</CenteredGrid>

<CenteredGrid>
  <div class="mt-s16 text-f21 font-bold text-gray-dark">
    {#if services.length > 0}
      {services.length}
      {services.length > 1 ? "résultats" : "résultat"}
    {:else}
      Aucun résultat
    {/if}
  </div>

  {#if showDeploymentNotice}
    <div class="mt-s24">
      <DoraDeploymentNotice />
    </div>
  {/if}
  <!--
    {#if hasOnlyNationalResults(services)}
      <div class="mt-s24">
        <OnlyNationalResultsNotice />
      </div>
    {/if}
  -->

  {#if services.length}
    <div class="mt-s32 flex flex-col gap-s16">
      {#each services as service}
        <SearchResult result={service} />
      {/each}
    </div>
  {/if}

  <div class="mt-s48 mb-s24 lg:flex lg:gap-s24">
    <ServiceSuggestionNotice />
  </div>

  {#if subCategoryIds.includes("famille--garde-enfants") || subCategoryIds.includes("famille--accompagnement-parents")}
    <SearchPromo />
  {/if}
</CenteredGrid>

<div class="bg-gray-bg p-s24">
  <div class="px-s32r m-auto flex max-w-7xl items-center justify-between">
    <div class="flex items-center">
      <h2 class="m-s0 text-f14 text-gray-dark">Infolettre</h2>
      &nbsp;•&nbsp;
      <p class="m-s0 text-f14">
        Une fois par mois, recevez un courriel pour être informé des évolutions
        de DORA.
      </p>
    </div>
    <div>
      <NewsletterButton extraClass="border-0 bg-transparent" />
    </div>
  </div>
</div>

<TallyNpsPopup formId={NPS_SEEKER_FORM_ID} />
