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
  import LinkButton from "$lib/components/link-button.svelte";

  import SearchResult from "./_homepage/_search-result.svelte";
  import SearchTweakForm from "./_homepage/_search_tweak_form.svelte";
  import SearchPromo from "./_homepage/_search-promo.svelte";

  import EmailButton from "$lib/components/email-button.svelte";
  import NewsletterButton from "$lib/components/newsletter-button.svelte";
  import Tag from "$lib/components/tag.svelte";
  import TallyNpsPopup from "$lib/components/tally-nps-popup.svelte";
  import { NPS_SEEKER_FORM_ID } from "$lib/const";
  import type { FeeCondition, ServicesOptions } from "$lib/types";

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
  <meta name="robots" content="noindex" />
</svelte:head>

<CenteredGrid>
  <div class="text-center">
    <p class="text-f16">Recherche</p>
    <h1 class="text-france-blue">Services d’insertion</h1>
    <div class="mt-s8 flex flex-row justify-center gap-s16">
      {#each tags as tag}
        <Tag>{tag.label}</Tag>
      {/each}
    </div>
  </div>
</CenteredGrid>

<CenteredGrid bgColor="bg-gray-bg">
  <div class="flex flex-col gap-s24 lg:flex-row">
    <div class="lg:mb-s48 lg:w-1/3">
      <SearchTweakForm
        categoryId={computeCategoryId(categoryIds, subCategoryIds)}
        subCategoryId={subCategoryIds[0]}
        {cityCode}
        {cityLabel}
        {fee}
        {kindId}
        {servicesOptions}
      />
    </div>
    <div class="lg:w-2/3">
      <div class="mt-s16 text-f14 text-gray-text-alt2">
        {services.length}
        {services.length > 1 ? "résultats" : "résultat"}
      </div>

      {#if services.length}
        <div class="mt-s32 flex flex-col gap-s16">
          {#each services as service}
            <SearchResult result={service} />
          {/each}
        </div>
      {:else}
        <p class="mt-s32 text-f16">
          Aucun résultat ne correspond à votre recherche.<br />
          Essayez d’autres filtres.
        </p>
        <div class="mt-s48 lg:flex lg:gap-s24">
          <div
            class="mb-s24 rounded-md border border-gray-01 bg-white p-s24 lg:flex-1"
          >
            <h4>
              Vous connaissez un service d’insertion qui n'est pas référencé ?
            </h4>
            <div class="flex flex-col gap-s16">
              <LinkButton
                label="Proposer un service"
                wFull
                to="/contribuer"
                secondary
              />
              <EmailButton wFull />
            </div>
          </div>
          <div
            class="mb-s24 rounded-md border border-gray-01 bg-white p-s24 lg:flex-1"
          >
            <h4>Dora évolue rapidement. Vous souhaitez rester informé ?</h4>
            <div>
              <NewsletterButton wFull />
            </div>
          </div>
        </div>
      {/if}
      {#if subCategoryIds.includes("famille--garde-enfants") || subCategoryIds.includes("famille--accompagnement-parents")}
        <SearchPromo />
      {/if}
    </div>
  </div>
</CenteredGrid>

<TallyNpsPopup formId={NPS_SEEKER_FORM_ID} />
