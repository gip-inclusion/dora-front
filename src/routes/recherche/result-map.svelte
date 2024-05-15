<script lang="ts">
  import * as mlgl from "maplibre-gl";

  import type { ServiceSearchResult } from "$lib/types";
  import Map from "$lib/components/display/map.svelte";
  import { zoomToResults } from "$lib/utils/map";

  interface ServiceWithCoords extends ServiceSearchResult {
    coordinates: [number, number];
  }

  export let filteredServices: ServiceSearchResult[];

  let map: mlgl.Map;

  $: servicesWithCoords = filteredServices.filter(
    (service) => !!service.coordinates
  ) as ServiceWithCoords[];

  function handleMapLoaded() {
    map.addSource("servicesSource", {
      type: "geojson",
      promoteId: "slug",
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50,
      data: {
        type: "FeatureCollection",
        features: servicesWithCoords.map((service) => ({
          type: "Feature",
          properties: {
            ...service,
          },
          geometry: {
            type: "Point",
            coordinates: [service.coordinates[0], service.coordinates[1]],
          },
        })),
      },
    });

    map.addLayer({
      id: "servicesLayer",
      type: "circle",
      source: "servicesSource",
      paint: {
        "circle-radius": 7,
        "circle-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          "#6CB6EB",
          "#3887be",
        ],
        "circle-stroke-color": "#efefef",
        "circle-stroke-width": 0.4,
        "circle-stroke-opacity": 0.5,
        "circle-opacity": 0.8,
      },
    });

    zoomToResults(map, servicesWithCoords);
  }

  function updateMapContent() {
    if (!map) {
      return;
    }

    const servicesSource = map.getSource("servicesSource") as
      | mlgl.GeoJSONSource
      | undefined;

    if (!servicesSource) {
      return;
    }

    servicesSource.setData({
      type: "FeatureCollection",
      features: servicesWithCoords.map((service) => ({
        type: "Feature",
        properties: {
          ...service,
        },
        geometry: {
          type: "Point",
          coordinates: [service.coordinates[0], service.coordinates[1]],
        },
      })),
    });
    zoomToResults(map, servicesWithCoords);
  }

  $: servicesWithCoords, updateMapContent();
</script>

<Map bind:map onMapLoaded={handleMapLoaded} />
