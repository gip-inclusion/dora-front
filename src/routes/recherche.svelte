<script context="module">
  import { getServicesOptions } from "$lib/services";
  import { getApiURL } from "$lib/utils/api.js";
  import { getQuery } from "./_homepage/_search";

  async function getResults(categoryId, subCategoryId, cityCode) {
    const url = `${getApiURL()}/search/?${getQuery(
      categoryId,
      subCategoryId,
      cityCode
    )}`;

    const res = await fetch(url, {
      headers: {
        Accept: "application/json; version=1.0",
      },
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

  const radiusChoices = [
    { value: "10", label: "10 km" },
    { value: "20", label: "20 km" },
    { value: "50", label: "50 km" },
    { value: "100", label: "100 km" },
  ];

  export async function load({ url }) {
    const query = url.searchParams;
    const categoryId = query.get("cat");
    const subCategoryId = query.get("sub");
    const cityCode = query.get("city");
    const cityLabel = query.get("cl");

    return {
      props: {
        categoryId,
        subCategoryId,
        cityCode,
        cityLabel,
        results: await getResults(categoryId, subCategoryId, cityCode),
        servicesOptions: await getServicesOptions(),
      },
    };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { browser } from "$app/env";
  import CenteredGrid from "$lib/components/layout/centered-grid.svelte";
  import LinkButton from "$lib/components/link-button.svelte";

  import SearchResult from "./_homepage/_search-result.svelte";
  import SearchTweakForm from "./_homepage/_search_tweak_form.svelte";
  import SearchPromo from "./_homepage/_search-promo.svelte";

  import ShareButton from "$lib/components/share-button.svelte";
  import NewsletterButton from "$lib/components/newsletter-button.svelte";
  import Tag from "$lib/components/tag.svelte";

  export let servicesOptions;
  export let categoryId, subCategoryId, cityCode, cityLabel;
  export let results;

  onMount(() => {
    if (browser) {
      plausible("recherche", {
        props: { categoryId, subCategoryId, cityCode, cityLabel },
      });
    }
  });

  let tags = [];

  $: {
    tags = [];

    if (categoryId) {
      tags = [servicesOptions.categories.find((c) => c.value === categoryId)];

      if (subCategoryId) {
        tags = [
          ...tags,
          servicesOptions.subcategories.find((c) => c.value === subCategoryId),
        ];
      }
    }

    if (cityLabel) {
      tags = [...tags, { label: cityLabel }];
    }
  }
</script>

<svelte:head>
  <title>Services d'insertion | Recherche | DORA</title>
</svelte:head>

<CenteredGrid topPadded>
  <div class="col-span-full mb-s48 text-center">
    <p class="text-f16">Recherche</p>
    <h1 class="text-france-blue">Services d'insertion</h1>
    <div class="mt-s8 flex flex-row justify-center gap-s16">
      {#each tags as tag}
        <Tag>{tag.label}</Tag>
      {/each}
    </div>
  </div>
</CenteredGrid>

<CenteredGrid roundedbg>
  <div class="col-span-12 mt-s56 mb-s48 lg:col-span-4">
    <SearchTweakForm
      {categoryId}
      {subCategoryId}
      {cityCode}
      {cityLabel}
      {servicesOptions}
      {radiusChoices}
    />
  </div>
  <div class="col-span-12 mt-s56 lg:col-span-8">
    <div class="mt-s16 text-f14 text-gray-text-alt2">
      {results.length} résultat{#if results.length > 1}s{/if}
    </div>

    {#if results.length}
      <div class="mt-s32 flex flex-col gap-s16">
        {#each results as result}
          <SearchResult {result} />
        {/each}
      </div>
    {:else}
      <p class="text-f16">
        Aucun résultat ne correspond à votre recherche.<br />
        Essayez d’autres filtres.
      </p>
      <div class="lg:flex lg:gap-s24 mt-s48">
        <div class="p-s24 bg-white rounded-md border-gray-01 border lg:flex-1">
          <h4>
            Vous connaissez un service d'insertion qui n'est pas référencé ?
          </h4>
          <div class="flex flex-col gap-s16">
            <LinkButton
              label="Proposer un service"
              wFull
              to="/contribuer"
              secondary
            />
            <ShareButton wFull />
          </div>
        </div>
        <div class="p-s24 bg-white rounded-md border-gray-01 border lg:flex-1">
          <h4>Dora évolue rapidement. Vous souhaiter rester informé ?</h4>
          <div>
            <NewsletterButton wFull />
          </div>
        </div>
      </div>
    {/if}
    {#if categoryId === "CC"}
      <SearchPromo />
    {/if}
  </div>
</CenteredGrid>
