<script lang="ts">
  import ServiceKeyInformations from "$lib/components/specialized/services/service-key-informations.svelte";
  import type { Service, ServicesOptions } from "$lib/types";
  import ServiceDescription from "../service-description.svelte";

  export let service: Service;
  export let servicesOptions: ServicesOptions;
</script>

<h2 class="mb-s40">Présentation du service</h2>

<p class="mb-s40 font-bold">
  {service.shortDesc}
</p>

<div class="rounded-lg border border-gray-02 p-s32 pb-s48">
  <ServiceKeyInformations {service} {servicesOptions} display="sidebar" />
</div>

<div class="mb-s40" />

{#if service.fullDesc}
  <div class="mb-s40">
    <h3>Description du service</h3>
    <ServiceDescription {service} />
  </div>
{/if}

<style lang="postcss">
  li.separator::before {
    content: "•";
    @apply mx-s6;
  }
</style>
