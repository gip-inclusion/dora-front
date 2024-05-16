<script lang="ts">
  import * as mlgl from "maplibre-gl";
  import Spiderfy from "@nazka/map-gl-js-spiderfy";

  import circleIcon from "$lib/assets/icons/circle.png";
  import type { ServiceSearchResult } from "$lib/types";
  import Map from "$lib/components/display/map.svelte";
  import { zoomToResults } from "$lib/utils/map";

  interface ServiceWithCoords extends ServiceSearchResult {
    coordinates: [number, number];
  }

  export let filteredServices: ServiceSearchResult[];
  export let onServiceClick: ((slug: string) => void) | undefined = undefined;

  let map: mlgl.Map;
  let spiderfy: Spiderfy;

  $: servicesWithCoords = filteredServices.filter(
    (service) => !!service.coordinates
  ) as ServiceWithCoords[];

  function handleMapLoaded() {
    spiderfy = new Spiderfy(map, {
      minZoomLevel: 10,
      zoomIncrement: 2,
      renderMethod: "3d",
      closeOnLeafClick: false,
      onLeafClick: (feature: mlgl.Feature) => {
        if (onServiceClick) {
          onServiceClick(feature.properties.slug);
        }
      },
    });

    const image = new Image(24, 24);
    image.src = circleIcon;
    map.addImage("cluster", image);

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
      id: "clusters",
      type: "symbol",
      source: "servicesSource",
      layout: {
        "icon-image": "cluster",
        "icon-allow-overlap": true,
      },
    });

    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "servicesSource",
      layout: {
        "text-field": ["get", "point_count"],
        "text-size": 12,
        "text-allow-overlap": true,
      },
      paint: {
        "text-color": "#ffffff",
      },
    });

    map.on("click", "clusters", (evt) => {
      const feature = evt.features && evt.features[0];
      const serviceSlug = feature?.properties.slug;
      if (onServiceClick && serviceSlug) {
        onServiceClick(serviceSlug);
      }
    });

    spiderfy.applyTo("clusters");

    map.addControl(new mlgl.NavigationControl({ showCompass: false }));

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
