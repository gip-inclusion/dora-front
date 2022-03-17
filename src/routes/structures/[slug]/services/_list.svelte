<script>
  import LinkButton from "$lib/components/link-button.svelte";
  import ServiceCard from "$lib/components/services/card.svelte";

  export let structure, services;
  export let hasButton = false;
</script>

<div class="col-span-full md:flex md:items-center md:justify-between">
  <h2 class="mb-s24 text-france-blue">Services</h2>
  <div class="flex gap-s16">
    {#if !!services.length && hasButton}
      <LinkButton
        label={`Voir tous les services (${services.length})`}
        to="/structures/{structure.slug}/services"
        small
      />
    {/if}
  </div>
</div>
<div class="col-span-full">
  <div class="mb-s48 grid gap-s16 md:grid-cols-2 lg:grid-cols-4">
    {#if structure.canWrite}
      <div
        class="flex items-center justify-center rounded-md px-s20 py-s24 shadow-md"
      >
        <LinkButton
          label="Ajouter un service…"
          to="/services/creer"
          noBackground
        />
      </div>
    {/if}
    {#each services as service}
      <ServiceCard {service} />
    {/each}
  </div>
</div>
