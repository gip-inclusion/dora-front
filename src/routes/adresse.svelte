<script>
  import { onMount } from "svelte";
  import { browser } from "$app/env";
  import AutoComplete from "simple-svelte-autocomplete";

  // Vite will automatically inject it in the page
  import leafletCSS from "leaflet/dist/leaflet.css";
  leafletCSS; // suppress warning

  let L;
  let map;
  let selectedAddress;

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

  function getAddressLabel(addressObj) {
    const data = addressObj.properties;
    if (data.type === "municipality") {
      return `${data.label} (${data.postcode})`;
    }
    return data.label;
  }

  function getAddressType(addressObj) {
    const type = addressObj.properties.type;
    switch (type) {
      case "municipality":
        return { label: "Ville", priority: 4, classes: "bg-orange-300" };
      case "locality":
        return { label: "Lieu-dit", priority: 3, classes: "bg-green-300" };
      case "street":
        return { label: "Rue", priority: 2, classes: "bg-back1" };
      case "housenumber":
        return { label: "Adresse", priority: 1, classes: "bg-back2" };
      default:
        return { label: "Autres", priority: 5, classes: "bg-white" };
    }
  }

  async function searchAddress(q) {
    const url = `${banAPIUrl}?q=${encodeURIComponent(q)}&limit=10`;
    const response = await fetch(url);
    const jsonResponse = await response.json();
    let results = jsonResponse.features.map((feature) => ({
      value: feature,
      label: getAddressLabel(feature),
      type: getAddressType(feature),
    }));
    // .sort((a, b) => {
    //   var prioA = a.type.priority;
    //   var prioB = b.type.priority;
    //   return prioA - prioB;
    // });
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
      citycode = addressProps.citycode;
      console.log(addressObj);
      const coords = addressObj.geometry.coordinates;
      lat = coords[1];
      long = coords[0];
      const latLng = L.latLng(lat, long);
      currentMarker = L.marker(latLng, { draggable: true, autoPan: true });
      currentMarker.addTo(map);
      currentMarker.on("move", (evt) => {
        const latLng = evt.latlng;
        lat = latLng.lat;
        long = latLng.lng;
      });
      map.setView(latLng, 18);
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
      onChange={handleChange}
      html5autocomplete={false}
      placeholder="2 rue du taur toulouse"
      inputClassName=""
      className="w-full"
      hideArrow
      searchFunction={searchAddress}
      delay="200"
      localFiltering="false"
      bind:selectedItem={selectedAddress}
      labelFieldName="label"
      valueFieldName="value">
      <div slot="item" let:item let:label class="text-sm">
        <span
          class="inline-block rounded-md {item.type
            .classes} w-20 p-2 text-center text-blue-dora mx-2">
          {item.type.label}</span>
        {@html label}
      </div>
      <div slot="no-results" let:noResultsText>
        <strong>Aucun résultat</strong>
      </div>
    </AutoComplete>
    {#if true}
      <form
        class="flex flex-col max-w-xl gap-6 p-8 mx-auto mt-8 bg-back2"
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
