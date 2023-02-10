<script lang="ts">
  import Select from "$lib/components/inputs/select/select.svelte";
  import type {
    AdminShortStructure,
    ServiceCategory,
    ServicesOptions,
    StructuresOptions,
  } from "$lib/types";

  export let servicesOptions: ServicesOptions;
  export let structuresOptions: StructuresOptions;
  export let structures: AdminShortStructure[] = [];
  export let filteredStructures: AdminShortStructure[] = [];
  let searchString = "";
  let selectedCategories: ServiceCategory[] = [];
  let selectedTypologies: string[] = [];

  let administrationKind = "all";
  const administrationChoices = [
    { value: "all", label: "Toutes" },
    { value: "withAdmin", label: "Administrées" },
    { value: "withoutAdmin", label: "Orphelines" },
  ];

  let freshnessChoice = "all";
  const freshnessChoices = [
    { value: "all", label: "Toutes" },
    { value: "uptodate", label: "À jour" },
    { value: "toupdate", label: "Avec des services à mettre à jour" },
  ];

  let numServicesChoice = "all";
  const numServicesChoices = [
    { value: "all", label: "Toutes" },
    { value: "withServices", label: "Avec des services publiés" },
    { value: "withoutServices", label: "Sans services publiés" },
  ];

  function filterAndSortEntities(
    structs: AdminShortStructure[],
    query: string,
    categories = [],
    typologies = [],
    adminKind = "all",
    freshChoice = "all",
    numServChoice = "all"
  ) {
    return structs
      .filter((struct) => !query || struct.name.toLowerCase().includes(query))
      .filter((struct) => {
        return (
          !categories.length ||
          struct.categories.some((structureCat: ServiceCategory) =>
            categories.includes(structureCat)
          )
        );
      })
      .filter((struct) => {
        return !typologies.length || typologies.includes(struct.typology);
      })
      .filter((struct) => {
        if (adminKind === "withAdmin") {
          return struct.hasAdmin;
        }
        if (adminKind === "withoutAdmin") {
          return !struct.hasAdmin;
        }
        return true;
      })
      .filter((struct) => {
        if (freshChoice === "uptodate") {
          return struct.numOutdatedServices === 0;
        }
        if (freshChoice === "toupdate") {
          return struct.numOutdatedServices > 0;
        }
        return true;
      })
      .filter((struct) => {
        if (numServChoice === "withServices") {
          return struct.numServices > 0;
        }
        if (numServChoice === "withoutServices") {
          return struct.numServices === 0;
        }
        return true;
      })
      .sort((structure1, structure2) =>
        structure1.department === structure2.department
          ? structure1.name
              .toLowerCase()
              .localeCompare(structure2.name.toLowerCase(), "fr")
          : structure1.department.localeCompare(structure2.department, "fr", {
              numeric: true,
            })
      );
  }

  function handleFilterChange(event) {
    searchString = event.target.value.toLowerCase().trim();
  }

  $: filteredStructures = filterAndSortEntities(
    structures,
    searchString,
    selectedCategories,
    selectedTypologies,
    administrationKind,
    freshnessChoice,
    numServicesChoice
  );
</script>

<div class="mb-s16 flex flex-col gap-s24">
  <div class="flex justify-between gap-s16">
    <div class="flex grow flex-col">
      <label for="typologies">Typologies</label>
      <Select
        id="typologies"
        multiple
        bind:value={selectedTypologies}
        choices={structuresOptions.typologies}
        placeholder="Choisir…"
        placeholderMulti="Choisir…"
        sort
      />
    </div>
    <div class="flex grow flex-col">
      <label for="categories">Thématiques</label>
      <Select
        id="categories"
        multiple
        bind:value={selectedCategories}
        choices={servicesOptions.categories}
        placeholder="Choisir…"
        placeholderMulti="Choisir…"
        sort
      />
    </div>
  </div>
  <div class="flex justify-between gap-s16">
    <div class="flex grow flex-col">
      <label for="administration">Administration</label>
      <Select
        id="administration"
        bind:value={administrationKind}
        choices={administrationChoices}
      />
    </div>
    <div class="flex grow flex-col">
      <label for="freshness">Fraicheur</label>
      <Select
        id="freshness"
        bind:value={freshnessChoice}
        choices={freshnessChoices}
      />
    </div>
    <div class="flex grow flex-col">
      <label for="num-services">Services</label>
      <Select
        id="num-services"
        bind:value={numServicesChoice}
        choices={numServicesChoices}
      />
    </div>
  </div>
</div>

<div class="flex flex-col gap-s12">
  <div class="mb-s12 flex w-full flex-row items-center gap-s12">
    <div class="grow">
      <input
        on:input={handleFilterChange}
        class="w-full border border-gray-02 p-s8"
        placeholder="Rechercher…"
      />
    </div>
    {#if structures?.length !== filteredStructures?.length}
      <div class="text-gray-text">
        ({filteredStructures.length} / {structures.length})
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  label {
    @apply font-bold;
  }
</style>
