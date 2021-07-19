<script>
  import { onMount } from "svelte";
  import { browser } from "$app/env";
  import AutoComplete from "simple-svelte-autocomplete";

  // Vite will automatically inject it in the page
  import leafletCSS from "leaflet/dist/leaflet.css";
  import leafletMarker from "leaflet/dist/images/marker-icon.png";
  import leafletMarker2x from "leaflet/dist/images/marker-icon-2x.png";
  import leafletMarkerShadow from "leaflet/dist/images/marker-shadow.png";
  leafletCSS; // suppress warning

  let L;
  let map;
  let selectedAddress, selectedCity;
  onMount(async () => {
    if (browser) {
      L = await import("leaflet");

      map = L.map(mapDiv);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
    }
  });

  const banAPIUrl = "https://api-adresse.data.gouv.fr/search/";

  async function searchAddress(q) {
    const url = `${banAPIUrl}?q=${encodeURIComponent(
      q
    )}&limit=10&citycode=${citycode}`;
    const response = await fetch(url);
    const jsonResponse = await response.json();
    let results = jsonResponse.features.map((feature) => ({
      value: feature,
      label: feature.properties.name,
    }));
    return results;
  }

  async function searchCity(q) {
    const url = `${banAPIUrl}?q=${encodeURIComponent(
      q
    )}&limit=10&type=municipality`;
    const response = await fetch(url);
    const jsonResponse = await response.json();
    let results = jsonResponse.features.map((feature) => ({
      value: feature,
      label: `${feature.properties.label} (${feature.properties.postcode})`,
    }));
    return results;
  }

  let addressObj;
  let addr1;
  let city;
  let postcode;
  let citycode;
  let currentMarker;
  let lat;
  let long;

  function handleChange(item) {
    if (item) {
      if (currentMarker) {
        currentMarker.remove();
        currentMarker = null;
      }
      mapDiv.classList.remove("hidden");
      addressObj = item.value;
      const addressProps = addressObj.properties;
      addr1 = addressProps.name;
      city = addressProps.city;
      postcode = addressProps.postcode;
      console.log(addressObj);
      const coords = addressObj.geometry.coordinates;
      lat = coords[1];
      long = coords[0];
      const latLng = L.latLng(lat, long);
      const icon = L.icon({
        iconUrl: leafletMarker,
        iconRetinaUrl: leafletMarker2x,
        shadowUrl: leafletMarkerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41],
      });
      currentMarker = L.marker(latLng, {
        draggable: true,
        autoPan: true,
        icon: icon,
      });
      currentMarker.addTo(map);
      currentMarker.on("move", (evt) => {
        const latLng = evt.latlng;
        lat = latLng.lat;
        long = latLng.lng;
      });
      map.setView(latLng, 18);
    }
  }

  function handleCityChange(item) {
    if (item) {
      selectedAddress = null;
      addressObj = item.value;
      const addressProps = addressObj.properties;
      city = addressProps.city;
      citycode = addressProps.citycode;
      addr1 = null;
      postcode = null;
      if (currentMarker) {
        currentMarker.remove();
        currentMarker = null;
      }
      lat = null;
      long = null;
    }
  }
  function handleSubmit() {}
  let mapDiv;
</script>

<svelte:head>
  <title>Recherche d’adresse</title>
</svelte:head>
<h1 class="mt-20 text-4xl font-bold text-center mb-14">
  Rechercher une adresse
</h1>
<div class="flex flex-row gap-8">
  <div class="flex-1">
    <AutoComplete
      onChange={handleCityChange}
      showLoadingIndicator
      html5autocomplete={false}
      placeholder="Toulouse"
      inputClassName=""
      className="w-full"
      hideArrow
      searchFunction={searchCity}
      delay="200"
      localFiltering="false"
      bind:selectedItem={selectedCity}
      labelFieldName="label"
      valueFieldName="value">
      <div slot="no-results">
        <strong>Aucun résultat</strong>
      </div>
      <div slot="loading">
        <strong>Chargement…</strong>
      </div>
    </AutoComplete>

    <AutoComplete
      disabled={!selectedCity}
      onChange={handleChange}
      showLoadingIndicator
      html5autocomplete={false}
      placeholder="2 rue du taur"
      inputClassName="disabled:bg-gray-100"
      className="w-full mt-4"
      hideArrow
      searchFunction={searchAddress}
      delay="200"
      localFiltering="false"
      bind:selectedItem={selectedAddress}
      labelFieldName="label"
      valueFieldName="value">
      <div slot="no-results">
        <strong>Aucun résultat</strong>
      </div>
      <div slot="loading">
        <strong>Chargement…</strong>
      </div>
    </AutoComplete>
    {#if true}
      <form
        class="flex flex-col max-w-xl gap-6 p-8 mx-auto mt-4 bg-back2"
        on:submit|preventDefault={handleSubmit}>
        <label class="flex flex-row items-center">
          <span class="inline-block w-40 font-bold">Addresse:</span>
          <input
            class="flex-grow inline-block border-gray-300 disabled:bg-gray-100"
            type="text"
            disabled={!addressObj}
            bind:value={addr1} />
        </label>
        <label class="flex flex-row items-center">
          <span class="inline-block w-40 font-bold">Code postal:</span>
          <input
            class="flex-grow inline-block border-gray-300 disabled:bg-gray-100"
            type="text"
            disabled={!addressObj}
            bind:value={postcode} />
        </label>
        <label class="flex flex-row items-center">
          <span class="inline-block w-40 font-bold">Ville:</span>
          <input
            class="flex-grow inline-block border-gray-300 disabled:bg-gray-100"
            type="text"
            disabled={!addressObj}
            bind:value={city} />
        </label>

        <label class="flex flex-row items-center">
          <span class="inline-block w-40 text-gray-400">Code insee:</span>
          <input
            class="flex-grow inline-block bg-gray-100 border-gray-300"
            type="text"
            disabled={true}
            bind:value={citycode} />
        </label>
        <div class="flex flex-row gap-10">
          <label class="flex flex-row items-center">
            <span class="inline-block w-10 text-gray-400">lat:</span>
            <input
              class="flex-grow inline-block text-gray-400 bg-gray-100 border-gray-300 w-28"
              type="text"
              disabled
              bind:value={lat} />
          </label>
          <label class="flex flex-row items-center">
            <span class="inline-block w-10 text-gray-400">long:</span>
            <input
              class="flex-grow inline-block text-gray-400 bg-gray-100 border-gray-300 w-28"
              type="text"
              disabled={true}
              bind:value={long} />
          </label>
        </div>
        <button
          type="submit"
          disabled={!postcode || !city}
          class="self-end block w-32 p-2 px-4 text-white border-2 rounded bg-action disabled:bg-back2 ">
          Valider
        </button>
      </form>
    {/if}
  </div>
  <div bind:this={mapDiv} class="flex-1 border h-72 nothidden" />
</div>
