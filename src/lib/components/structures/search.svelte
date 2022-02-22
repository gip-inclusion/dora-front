<script>
  import Tabs from "$lib/components/tabs.svelte";
  import FieldSet from "$lib/components/forms/fieldset.svelte";
  import SearchBySiret from "$lib/components/structures/search-by-siret.svelte";

  import SearchByCommune from "$lib/components/structures/search-by-commune.svelte";
  import ModelField from "$lib/components/forms/model-field.svelte";
  import serviceSchema from "$lib/schemas/service-contrib.js";
  import { formErrors } from "$lib/validation.js";

  export let onCityChange = null;
  export let onEstablishmentChange = null;

  let establishment = {};

  function handleCityChange(newCity) {
    establishment = null;

    if (onCityChange) onCityChange(newCity);
  }

  async function handleEstablishmentChange(newEstablishment) {
    establishment = newEstablishment;
    if (onEstablishmentChange) onEstablishmentChange(newEstablishment);
  }

  let structureSearchTab = "siret";
  const structureSearchTabs = [
    { id: "siret", name: "Son numéro de SIRET" },
    { id: "nom", name: "Son nom" },
  ];
</script>

<FieldSet
  title="Identifiez la structure"
  headerBg="bg-france-blue"
  noHeaderBorder
>
  <div slot="description">
    <p class="text-f14 text-white">
      Choisissez une méthode d'identification. En cas de doute, contactez-nous.
    </p>

    <Tabs items={structureSearchTabs} bind:selected={structureSearchTab} />
  </div>

  {#if structureSearchTab === "siret"}
    <SearchBySiret onEstablishmentChange={handleEstablishmentChange} />
  {:else if structureSearchTab === "nom"}
    <SearchByCommune
      onEstablishmentChange={handleEstablishmentChange}
      onCityChange={handleCityChange}
    />
  {/if}

  {#if establishment?.siret}
    <div class="border border-gray-01 p-s24">
      <h4 class="text-gray-text">{establishment.name}</h4>
      <div class="legend">{establishment.siret}</div>
      <div class="legend">{establishment.address1}</div>
      <div class="legend">{establishment.address2}</div>
      <div class="legend">
        {establishment.postalCode}
        {establishment.city}
      </div>
    </div>
  {/if}
  <ModelField
    type="hidden"
    schema={serviceSchema.siret}
    name="siret"
    errorMessages={$formErrors.siret}
    bind:value={establishment.siret}
  />
</FieldSet>
