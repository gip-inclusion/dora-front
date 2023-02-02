<script lang="ts">
  import CenteredGrid from "$lib/components/display/centered-grid.svelte";
  import Label from "$lib/components/display/label.svelte";
  import LinkButton from "$lib/components/display/link-button.svelte";
  import Tag from "$lib/components/display/tag.svelte";
  import AdminDivisionSearch from "$lib/components/inputs/geo/admin-division-search.svelte";
  import Select from "$lib/components/inputs/select/select.svelte";
  import { eyeIcon, homeIcon } from "$lib/icons";
  import { getStructuresAdmin } from "$lib/requests/admin";
  import type { ServiceCategory, AdminShortStructure } from "$lib/types";
  import { capitalize, shortenString } from "$lib/utils/misc";
  import { onDestroy, onMount } from "svelte";
  import type { PageData } from "./$types";
  import * as mlgl from "maplibre-gl";

  export let data: PageData;
  let structures: AdminShortStructure[] = [];
  let filteredStructures: AdminShortStructure[] = [];
  let searchString = "";
  let department: number;
  let selectedCategories: ServiceCategory[] = [];
  let map;
  let popup;
  let mapDiv;

  const METROPOLE_BB = [
    [-5, 42],
    [8, 51],
  ];

  function filterAndSortEntities(query: string, dept, categories = []) {
    console.log("refilter");
    return structures
      .filter((struct) => !dept || struct.department === dept.code)
      .filter((struct) => !query || struct.name.toLowerCase().includes(query))
      .filter((struct) => {
        return (
          !categories.length ||
          struct.categories.some((structureCat: ServiceCategory) =>
            categories.includes(structureCat)
          )
        );
      })
      .sort((structure1, structure2) =>
        structure1.department === structure2.department
          ? structure1.name
              .toLowerCase()
              .localeCompare(structure2.name.toLowerCase(), "fr")
          : structure1.department.localeCompare(structure2.department, "fr", {
              numeric: true,
            })
      );
  }

  function handleFilterChange(event) {
    searchString = event.target.value.toLowerCase().trim();
  }

  onMount(async () => {
    structures = await getStructuresAdmin();
    filteredStructures = filterAndSortEntities("");
    const urlStyle =
      "https://raw.githack.com/etalab/cadastre.data.gouv.fr/master/components/react-map-gl/styles/vector.json";
    map = new mlgl.Map({
      container: mapDiv,
      style: urlStyle,
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 6, // starting zoom
    });
    map.fitBounds(METROPOLE_BB, {
      padding: 20,
    });
  });

  onDestroy(() => {
    map.remove();
  });

  async function updateMapContent(structs: AdminShortStructure[]) {
    if (!map) {return;}
    console.log("updating");
    // structs.forEach((struct) => {
    //   // console.table(struct)
    //   let marker = new maplibregl.Marker()
    //     .setLngLat([struct.longitude, struct.latitude])
    //     .setPopup(new maplibregl.Popup({ offset: 25 }).setText(struct.name)) // sets a popup on this marker

    //     .addTo(map);
    // });

    if (map.getLayer("places")) {map.removeLayer("places");}
    if (map.getSource("places")) {map.removeSource("places");}

    await new Promise((resolve, reject) => {
      map.loadImage(
        "https://maplibre.org/maplibre-gl-js-docs/assets/custom_marker.png",
        (error, image) => {
          if (error) {return reject(error);}
          if (!map.hasImage("custom-marker"))
            {map.addImage("custom-marker", image);}
          return resolve();
        }
      );
    });
    map.addSource("places", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: structs.map((struct) => ({
          type: "Feature",
          properties: {
            description: struct.name,
          },
          geometry: {
            type: "Point",
            coordinates: [struct.longitude, struct.latitude],
          },
        })),
      },
    });

    // Add a layer showing the places.
    map.addLayer({
      id: "places",
      type: "symbol",
      source: "places",
      layout: {
        "icon-image": "custom-marker",
        "icon-overlap": "always",
      },
    });

    // });

    popup = new mlgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.on("mouseenter", "places", function (evt) {
      console.log("mouseenter");
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = "pointer";

      const coordinates = evt.features[0].geometry.coordinates.slice();
      const description = evt.features[0].properties.description;
      console.log(coordinates, description);
      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(evt.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += evt.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      console.log(coordinates, description);
      popup.setLngLat(coordinates).setHTML(description).addTo(map);
      popup._update();
    });

    map.on("mouseleave", "places", function () {
      map.getCanvas().style.cursor = "";
      popup.remove();
    });
  }

  function zoomToDepartment(dept) {
    if (dept) {
      console.log(dept);
      const coordinates = dept.geom.coordinates[0];
      const bounds = coordinates.reduce(function (acc, coord) {
        return acc.extend(coord);
      }, new mlgl.LngLatBounds(coordinates[0], coordinates[0]));

      map.fitBounds(bounds, {
        padding: 20,
      });
    }
  }
  $: filteredStructures = filterAndSortEntities(
    searchString,
    department,
    selectedCategories
  );

  $: updateMapContent(filteredStructures);
  $: zoomToDepartment(department);
  // $: console.table(filteredStructures);
</script>

<svelte:head>
  <link
    href="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css"
    rel="stylesheet"
  />
</svelte:head>
<CenteredGrid>
  <h2>Structures</h2>
  <div class="mb-s16 flex gap-s8">
    <AdminDivisionSearch
      searchType="department"
      bind:value={department}
      placeholder="Haute-Garonne"
      withGeom
    />
    <div class="flex max-w-sm flex-col">
      <Select
        multiple
        bind:value={selectedCategories}
        choices={data.servicesOptions.categories}
        placeholder="Thématiques"
        placeholderMulti="Thématiques"
        sort
      />
    </div>
  </div>

  <div class="flex flex-col gap-s12">
    <div class="mb-s12 flex w-full flex-row items-center gap-s12">
      <div class="grow">
        <input
          on:input={handleFilterChange}
          class="w-full border border-gray-02 p-s8"
          placeholder="Rechercher…"
        />
      </div>
      {#if structures?.length !== filteredStructures?.length}
        <div class="text-gray-text">
          ({filteredStructures.length} / {structures.length})
        </div>
      {/if}
    </div>

    {#if structures}
      <div class="relative">
        <div id="map" class=" h-s512 w-full" bind:this={mapDiv} />
      </div>

      {#each filteredStructures as structure}
        <div
          class="flex flex-row gap-s16 rounded-md border border-gray-01 p-s16"
        >
          <div class="flex grow flex-row items-center">
            <div>
              <div>
                <strong
                  ><a href="/admin/structures/{structure.slug}" target="_blank">
                    {shortenString(capitalize(structure.name))}
                  </a></strong
                >

                <div>
                  {#if structure.typologyDisplay}({shortenString(
                      structure.typologyDisplay
                    )}){/if}
                </div>

                <div class="flex w-full flex-wrap gap-s4">
                  {#each structure.categories as cat}
                    <Tag bgColorClass="bg-magenta-brand"
                      ><div class="whitespace-nowrap">
                        {data.servicesOptions.categories.find(
                          (option) => option.value === cat
                        )?.label}
                      </div></Tag
                    >{/each}
                </div>
              </div>
            </div>
          </div>
          {#if structure.department}
            <Label
              label={structure.department || " "}
              smallIcon
              icon={homeIcon}
            />
          {/if}

          <LinkButton
            to="/structures/{structure.slug}"
            icon={eyeIcon}
            noBackground
            otherTab
          />
        </div>
      {/each}
    {:else}
      Chargement…
    {/if}
  </div>
</CenteredGrid>
