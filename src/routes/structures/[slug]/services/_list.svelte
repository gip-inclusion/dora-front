<script>
  import Label from "$lib/components/label.svelte";
  import LinkButton from "$lib/components/link-button.svelte";
  import Tag from "$lib/components/tag.svelte";

  import { mapPinIcon } from "$lib/icons";

  export let structure, services;
  export let hasButton = false;
</script>

<div class="col-span-full md:flex md:items-center md:justify-between">
  <h2 class="mb-s24 text-france-blue">Services</h2>
  <div class="flex gap-s16">
    {#if structure.canWrite}
      <LinkButton label="Ajouter un service…" to="/services/creer" small />
    {/if}
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
  <div class="lg:grid-cols-s24 mb-s48 grid gap-s16 md:grid-cols-2">
    {#each services as service}
      <div class="rounded-md px-s20 py-s24 shadow-md">
        <h4><a href="/services/{service.slug}">{service.name}</a></h4>
        <div class="mt-s8 flex flex-col gap-s16">
          <Tag selfStart>{service.categoryDisplay}</Tag>
          <Label
            label={`${service.postalCode}, ${service.city}`}
            smallIcon
            icon={mapPinIcon}
          />
        </div>
      </div>
    {/each}
  </div>
</div>
