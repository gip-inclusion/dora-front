<script>
  import { onMount } from "svelte";
  import { browser } from "$app/env";
  import AutoComplete from "simple-svelte-autocomplete";
  import { getApiURL } from "$lib/utils";

  // Vite will automatically inject it in the page
  import leafletCSS from "leaflet/dist/leaflet.css";
  import leafletMarker from "leaflet/dist/images/marker-icon.png";
  import leafletMarker2x from "leaflet/dist/images/marker-icon-2x.png";
  import leafletMarkerShadow from "leaflet/dist/images/marker-shadow.png";
  leafletCSS; // suppress warning

  let L;
  let map;
  let selectedEstablishment;

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

  async function searchSirene(q) {
    const sireneAPIUrl = `${getApiURL()}/search-sirene/?q=${encodeURIComponent(
      q
    )}`;
    const response = await fetch(sireneAPIUrl, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json; version=1.0",
      },
    });
    const jsonResponse = await response.json();
    console.log(jsonResponse);
    function cleanSpaces(string) {
      return string.replace(/ +/gi, " ").trim();
    }
    let results = jsonResponse.map((r) => {
      const result = {
        siret: r.siret,
        siren: r.siren,
        nic: r.nic,
        addr1: cleanSpaces(
          `${r.numeroVoie} ${r.repetitionIndex} ${r.typeVoie} ${r.libelleVoie}`
        ),
        addr2: r.complementAdresse,
        distrib: r.distributionSpeciale,
        city: r.libelleCedex || r.libelleCommune,
        postcode: r.codeCedex || r.codePostal,
        citycode: r.codeCommune,
        parent: cleanSpaces(
          `${r.denominationParent} ${
            r.sigleParent ? "(" + r.sigleParent + ")" : ""
          }`
        ),
        name: cleanSpaces(
          `${r.denomination} ${
            r.enseigne1 != r.denomination ? r.enseigne1 : ""
          } ${r.enseigne2} ${r.enseigne3}`
        ),
        ape: r.ape,
        latitude: r.latitude,
        longitude: r.longitude,
      };
      result.label = result.name || result.parent;
      return result;
    });
    console.log(results);
    return results;
  }

  let name;
  let parent;
  let ape;
  let siren;
  let nic;
  let addr1;
  let addr2;
  let city;
  let postcode;
  let citycode;
  let currentMarker;
  let lat;
  let long;

  function handleChange(item) {
    console.log(item);
    if (item) {
      if (currentMarker) {
        currentMarker.remove();
        currentMarker = null;
      }
      // mapDiv.classList.remove("hidden");
      name = item.label;
      parent = name !== item.parent ? item.parent : "";
      siren = item.siren;
      nic = item.nic;
      addr1 = item.addr1;
      addr2 = item.addr2;
      city = item.city;
      postcode = item.postcode;
      citycode = item.citycode;
      ape = item.ape;
      lat = item.latitude;
      long = item.longitude;
      if (lat && long) {
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
  }

  function handleSubmit() {}
  let mapDiv;
  /*
diffusable: true
isSiege: true
nic: "00017"
  */
</script>

<svelte:head>
  <title>Recherche SIRET</title>
</svelte:head>
<h1 class="mt-20 text-4xl font-bold text-center mb-14">
  Rechercher un établissement
</h1>
<div class="flex flex-row gap-8">
  <div class="flex-1">
    <AutoComplete
      onChange={handleChange}
      showLoadingIndicator={true}
      html5autocomplete={false}
      placeholder="Pole Emploi Saint-Joseph"
      inputClassName=""
      className="w-full"
      hideArrow
      searchFunction={searchSirene}
      delay="200"
      localFiltering={false}
      minCharactersToSearch="3"
      localSearch={false}
      bind:selectedItem={selectedEstablishment}
      labelFieldName="label"
      valueFieldName="siret"
      __textCleanFunction>
      <div slot="item" let:item let:label class="text-sm">
        {@html label}
        <span
          class="inline-block rounded-md  p-2 text-center bg-orange-300 text-white mx-2">
          {item.city} ({item.postcode})</span>
      </div>
      <div slot="no-results" let:noResultsText>
        <strong>Aucun résultat</strong>
      </div>
    </AutoComplete>
    {#if selectedEstablishment}
      <form
        class="flex flex-col max-w-xl gap-6 p-8 mx-auto mt-8 bg-back2"
        on:submit|preventDefault={handleSubmit}>
        <label class="flex flex-row items-center">
          <span class="inline-block w-40 font-bold">Nom:</span>
          <input
            class="flex-grow inline-block border-gray-300 disabled:bg-gray-100"
            type="text"
            disabled={!selectedEstablishment}
            bind:value={name} />
        </label>
        <label class="flex flex-row items-center">
          <span class="inline-block w-40 font-bold">Siège:</span>
          <input
            class="flex-grow inline-block border-gray-300 disabled:bg-gray-100"
            type="text"
            disabled={!selectedEstablishment}
            bind:value={parent} />
        </label>
        <label class="flex flex-row items-center">
          <span class="inline-block w-40 font-bold">SIREN:</span>
          <input
            class="flex-grow inline-block border-gray-300 disabled:bg-gray-100"
            type="text"
            disabled={!selectedEstablishment}
            bind:value={siren} />
        </label>
        <label class="flex flex-row items-center">
          <span class="inline-block w-40 font-bold">NIC:</span>
          <input
            class="flex-grow inline-block border-gray-300 disabled:bg-gray-100"
            type="text"
            disabled={!selectedEstablishment}
            bind:value={nic} />
        </label>
        <label class="flex flex-row items-center">
          <span class="inline-block w-40 font-bold">APE:</span>
          <input
            class="flex-grow inline-block border-gray-300 disabled:bg-gray-100"
            type="text"
            disabled={!selectedEstablishment}
            bind:value={ape} />
        </label>
        <label class="flex flex-row items-center">
          <span class="inline-block w-40 font-bold">Adresse:</span>
          <input
            class="flex-grow inline-block border-gray-300 disabled:bg-gray-100"
            type="text"
            disabled={!selectedEstablishment}
            bind:value={addr1} />
        </label>
        <label class="flex flex-row items-center">
          <span class="inline-block w-40 font-bold">Cplment Adresse:</span>
          <input
            class="flex-grow inline-block border-gray-300 disabled:bg-gray-100"
            type="text"
            disabled={!selectedEstablishment}
            bind:value={addr2} />
        </label>
        <label class="flex flex-row items-center">
          <span class="inline-block w-40 font-bold">Code postal:</span>
          <input
            class="flex-grow inline-block border-gray-300 disabled:bg-gray-100"
            type="text"
            disabled={!selectedEstablishment}
            bind:value={postcode} />
        </label>
        <label class="flex flex-row items-center">
          <span class="inline-block w-40 font-bold">Ville:</span>
          <input
            class="flex-grow inline-block border-gray-300 disabled:bg-gray-100"
            type="text"
            disabled={!selectedEstablishment}
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
