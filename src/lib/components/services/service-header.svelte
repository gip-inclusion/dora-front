<script lang="ts">
  import Breadcrumb from "$lib/components/breadcrumb.svelte";
  import type { Service } from "$lib/types";
  import { capitalize } from "$lib/utils";

  import AvailableIcon from "$lib/assets/services/available.svg";
  import UnavailableIcon from "$lib/assets/services/unavailable.svg";

  export let service: Service;
</script>

<div class="gap-s16 lg:flex-row-reverse lg:justify-between">
  <div class="mb-s48">
    <Breadcrumb
      serviceInfo={service}
      structureInfo={service.structureInfo}
      currentLocation="service"
    />
  </div>
  <h1 class="mb-s14 text-f45 text-white">{service.name}</h1>

  <div class="mb-s48 flex items-center text-f18 text-white">
    <div><strong>{capitalize(service.structureInfo.name)}</strong></div>
    <div class="mx-s8 font-bold" aria-hidden="true">·</div>
    <div>
      <a class="underline" href="/structures/{service.structureInfo.slug}"
        >Voir les autres services ({service.structureInfo.numServices})</a
      >
    </div>
  </div>

  <div class="mb-s32 flex items-center text-f18 text-white">
    <div class="flex items-center">
      {#if service.isAvailable}
        <img src={AvailableIcon} alt="" class="mr-s6" />&nbsp;<span
          class="text-available-service">Service disponible</span
        >
      {:else}
        <img src={UnavailableIcon} alt="" class="mr-s6" />&nbsp;<span
          class="text-unavailable-service">Service indisponible</span
        >
      {/if}
    </div>
    <div class="mx-s8 font-bold" aria-hidden="true">·</div>
    <div>
      Périmètre : <strong>{service.diffusionZoneDetailsDisplay}</strong>
    </div>
  </div>
</div>
