<script>
  import { onMount } from "svelte";
  import { getPublishedServices } from "$lib/services";

  import { shortenString } from "$lib/utils";
  import { eyeIcon, homeIcon } from "$lib/icons";
  import Label from "$lib/components/label.svelte";
  import LinkButton from "$lib/components/link-button.svelte";
  import ServiceStateLabel from "$lib/components/services/state-label.svelte";
  import CenteredGrid from "$lib/components/layout/centered-grid.svelte";

  let services, filteredServices;

  onMount(async () => {
    services = await getPublishedServices({ kitFetch: fetch });
    filteredServices = services;
  });

  function handleFilterChange(event) {
    const searchString = event.target.value;

    filteredServices = (
      searchString
        ? services.filter(
            (s) =>
              s.name.toLowerCase().includes(searchString) ||
              s.structureInfo.name.toLowerCase().includes(searchString)
          )
        : services
    )
      .filter((s) => !s.parent)
      .sort((s1, s2) =>
        s1.structureInfo.name.toLowerCase() ===
        s2.structureInfo.name.toLowerCase()
          ? s1.name.toLowerCase() > s2.name.toLowerCase()
            ? 1
            : -1
          : s1.structureInfo.name.toLowerCase() >
            s2.structureInfo.name.toLowerCase()
          ? 1
          : -1
      );
  }
</script>

<svelte:head>
  <title>Administration | Services | DORA</title>
</svelte:head>

<CenteredGrid bgColor="bg-gray-bg">
  <h2>Services</h2>

  <div class="flex flex-col gap-s12">
    <div class="mb-s12 flex w-full flex-row items-center gap-s12">
      <div class="grow">
        <input
          on:input={handleFilterChange}
          class="w-full border border-gray-02 p-s8"
          placeholder="rechercher (nom du service ou de sa structure)…"
        />
      </div>
      {#if services?.length !== filteredServices?.length}
        <div class="text-gray-text">
          ({filteredServices.length} / {services.length})
        </div>
      {/if}
    </div>

    {#if services}
      {#each filteredServices as service}
        <div
          class="flex flex-row items-center gap-s16 rounded-md bg-white p-s16"
        >
          <div class="flex-auto basis-1/3">
            <a href="/admin/services/{service.slug}" target="_blank">
              <h5 class="mb-s0">{shortenString(service.name)}</h5>
            </a>

            <Label
              label={`${service.structureInfo.name}`}
              smallIcon
              icon={homeIcon}
            />
          </div>
          <div class="flex flex-none basis-1/6 flex-col">
            {#if service.diffusionZoneType !== "country"}
              <Label label={service.diffusionZoneTypeDisplay} />
            {/if}
            <Label label={service.diffusionZoneDetailsDisplay} bold />
          </div>
          <div class="flex-none basis-s112">
            <ServiceStateLabel {service} />
          </div>
          <div class="flex-none basis-s40">
            <Label
              label={`${new Date(service.modificationDate).toLocaleDateString(
                "fr",
                "short"
              )}`}
            />
          </div>
          <div class="flex-none basis-s32">
            <LinkButton
              to="/services/{service.slug}"
              icon={eyeIcon}
              noBackground
              otherTab
            />
          </div>
        </div>
      {/each}
    {:else}
      Chargement…
    {/if}
  </div>
</CenteredGrid>
