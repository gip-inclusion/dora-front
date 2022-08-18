<script lang="ts">
  import { emotionHappyIcon, closeCircleFillIcon } from "$lib/icons";
  import type { DashboardService, Service } from "$lib/types";

  export let service: Service | DashboardService;
  export let small = false;
  export let dark = false;
  export let bold = false;

  const dimension = small ? "h-s20 w-s20" : "h-s32 w-s32";
  const availableColor = dark
    ? "text-service-available-dark"
    : "text-service-available";
  const unavailableColor = dark
    ? "text-service-unavailable-dark"
    : "text-service-unavailable";
</script>

<div id="service-availability" class="mb-s10 flex items-center md:mb-s0">
  {#if service.isAvailable}
    <div
      class="{availableColor} {dimension} mr-s8 fill-current print:text-service-available-dark"
    >
      {@html emotionHappyIcon}
    </div>

    <span
      class="{availableColor} print:text-service-available-dark"
      class:font-bold={bold}
    >
      Service disponible
    </span>
  {:else}
    <div
      class="{unavailableColor} {dimension} mr-s8 fill-current print:text-service-unavailable-dark"
    >
      {@html closeCircleFillIcon}
    </div>
    <span
      class="{unavailableColor} print:text-service-unavailable-dark"
      class:font-bold={bold}
    >
      Service indisponible
    </span>
  {/if}
</div>
