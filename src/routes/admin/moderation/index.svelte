<script>
  import { onMount } from "svelte";
  import { getStructuresToModerate, getServicesToModerate } from "$lib/admin";

  import { capitalize, shortenString } from "$lib/utils";
  import LinkButton from "$lib/components/link-button.svelte";
  import { eyeIcon } from "$lib/icons";
  import CenteredGrid from "$lib/components/layout/centered-grid.svelte";
  import ModerationLabel from "../_moderation-label.svelte";

  let services, structures, entities, filteredEntities;

  onMount(async () => {
    structures = await getStructuresToModerate();
    structures.forEach((s) => (s.isStructure = true));
    console.log(structures[0]);
    services = await getServicesToModerate();
    console.log(services[0]);
    entities = [...structures, ...services];
    filteredEntities = entities;
  });

  function handleFilterChange(event) {
    const searchString = event.target.value;
    // TODO:
    // order by moderation status, structures first, then name
    // for services: group them by structures

    // TODO:
    // make filter work on both structures and services
    filteredEntities = (
      searchString
        ? structures.filter(
            (s) =>
              s.name.toLowerCase().includes(searchString.toLowerCase()) ||
              s.department === searchString
          )
        : structures
    )
      .filter((s) => !s.parent)
      .sort((s1, s2) =>
        s1.department === s2.department
          ? s1.name.toLowerCase() > s2.name.toLowerCase()
            ? 1
            : -1
          : s1.department - s2.department
      );
  }
</script>

<svelte:head>
  <title>Admin | Structures | DORA</title>
</svelte:head>

<CenteredGrid bgColor="bg-gray-bg">
  <h2>Moderation</h2>

  <div class="flex flex-col gap-s12">
    <div class="mb-s12 flex w-full flex-row items-center gap-s12">
      <div class="grow">
        <input
          on:input={handleFilterChange}
          class="w-full border border-gray-02 p-s8"
          placeholder="rechercher (nom du service, de la structure ou du département)…"
        />
      </div>

      {#if entities?.length !== filteredEntities?.length}
        <div class="text-gray-text">
          ({filteredEntities.length} / {entities.length})
        </div>
      {/if}
    </div>

    {#if entities}
      {#if !entities.length}
        Rien à modérer 🎉
      {:else}
        {#each filteredEntities as entity}
          <div
            class="flex flex-row items-center gap-s16 rounded-md bg-white p-s16"
          >
            {#if entity.isStructure}
              <div class="grow">
                <a href="/admin/structures/{entity.slug}" target="_blank">
                  <span class="font-bold">
                    🏢 {shortenString(capitalize(entity.name))}
                  </span><br />
                  <span class="text-f12">{entity.department}</span>
                </a>
              </div>
              <ModerationLabel moderationStatus={entity.moderationStatus} />
              <LinkButton
                to="/structures/{entity.slug}"
                icon={eyeIcon}
                noBackground
                otherTab
              />
            {:else}
              <div class="grow ">
                <a href="/admin/services/{entity.slug}" target="_blank">
                  <span class="mb-s0 font-bold">
                    {shortenString(entity.name)}
                  </span><br />
                  <span class="text-f12">{entity.structureName}</span>
                </a>
              </div>
              <ModerationLabel moderationStatus={entity.moderationStatus} />
              <div class="flex-none basis-s32">
                <LinkButton
                  to="/services/{entity.slug}"
                  icon={eyeIcon}
                  noBackground
                  otherTab
                />
              </div>
            {/if}
          </div>
        {/each}
      {/if}
    {:else}
      Chargement…
    {/if}
  </div>
</CenteredGrid>
