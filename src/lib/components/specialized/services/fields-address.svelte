<script lang="ts">
  import Button from "$lib/components/display/button.svelte";
  import AddressSearchField from "$lib/components/inputs/address-search-field.svelte";
  import BasicInputField from "$lib/components/inputs/basic-input-field.svelte";

  import CitySearchField from "$lib/components/inputs/city-search-field.svelte";
  import HiddenField from "$lib/components/inputs/hidden-field.svelte";
  import type { Service, Structure } from "$lib/types";
  import { tick } from "svelte";

  export let entity: Service | Structure;
  export let parent: Structure | null = null;
  export let required = false;

  function handleAddressChange(address) {
    const props = address?.properties;
    const coords = address?.geometry.coordinates;
    const lat = coords?.[1];
    const long = coords?.[0];
    entity.address1 = props?.name;
    entity.postalCode = props?.postcode;
    entity.longitude = long;
    entity.latitude = lat;
  }

  let showServiceAddress = true;

  async function fillAddress() {
    showServiceAddress = false;

    if (parent) {
      const {
        city,
        address1,
        address2,
        postalCode,
        cityCode,
        latitude,
        longitude,
      } = parent;
      entity.city = city;
      entity.address1 = address1;
      entity.address2 = address2;
      entity.postalCode = postalCode;
      entity.cityCode = cityCode;
      entity.latitude = latitude;
      entity.longitude = longitude;
    }
    await tick();
    showServiceAddress = true;
  }

  function handleCityChange(city) {
    entity.city = city?.name;
    entity.cityCode = city?.code;
  }
</script>

{#if showServiceAddress}
  {#if parent}
    <Button
      on:click={fillAddress}
      secondary
      small
      label="Utiliser l'adresse de la structure"
    />
  {/if}
  <CitySearchField
    id="city"
    label="Ville"
    initialValue={entity.city}
    onChange={handleCityChange}
    {required}
    placeholder="Saisissez et validez votre ville"
  />

  <AddressSearchField
    id="address1"
    label="Adresse"
    initialValue={entity.address1}
    onChange={handleAddressChange}
    cityCode={entity.cityCode}
    {required}
    placeholder="3 rue du parc"
    disabled={!entity.cityCode}
  />

  <BasicInputField
    id="address2"
    label="Complément d’adresse"
    bind:value={entity.address2}
    placeholder="batiment, escalier, etc."
  />

  <BasicInputField
    id="postalCode"
    label="Code postal"
    bind:value={entity.postalCode}
    {required}
    placeholder="00000"
  />

  <HiddenField id="cityCode" bind:value={entity.cityCode} />

  <HiddenField id="longitude" bind:value={entity.longitude} />

  <HiddenField id="latitude" bind:value={entity.latitude} />
{/if}
