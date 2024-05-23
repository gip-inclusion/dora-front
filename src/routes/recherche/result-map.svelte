<script lang="ts">
  import * as mlgl from "maplibre-gl";
  import Spiderfy from "@nazka/map-gl-js-spiderfy";

  import insane from "insane";

  import circleIcon from "$lib/assets/icons/circle.png";
  import type { ServiceSearchResult } from "$lib/types";
  import Map from "$lib/components/display/map.svelte";

  interface ServiceWithCoords extends ServiceSearchResult {
    coordinates: [number, number];
  }

  export let filteredServices: ServiceSearchResult[];
  export let mapBounds: [number, number, number, number];
  export let onServiceClick: ((slug: string) => void) | undefined = undefined;

  let map: mlgl.Map;
  let popup: mlgl.Popup;
  let spiderfy: Spiderfy;

  $: servicesWithCoords = filteredServices.filter(
    (service) => !!service.coordinates
  ) as ServiceWithCoords[];

  $: mapBoundsObj = new mlgl.LngLatBounds(mapBounds);

  function getPopupContent(feature): string {
    return insane(
      `<strong>${feature.properties.name}</strong><br>${feature.properties.shortDesc}`
    );
  }

  function handleLeafEnter(feature: mlgl.MapGeoJSONFeature) {
    if (feature.geometry.type !== "Point") {
      return;
    }
    map.getCanvas().style.cursor = "pointer";
    const coordinates = feature.geometry.coordinates.slice() as [
      number,
      number,
    ];
    popup.setLngLat(coordinates).setHTML(getPopupContent(feature)).addTo(map);
    popup._update();
  }

  function handleLeafExit(_feature: mlgl.MapGeoJSONFeature) {
    map.getCanvas().style.cursor = "";
    popup.remove();
  }

  async function handleMapLoaded() {
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

    const image = await map.loadImage(circleIcon);
    map.addImage("cluster", image.data);

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

    let lastHovered: mlgl.MapGeoJSONFeature | null = null;
    map.on("mousemove", function (evt) {
      const featuresUnderMouse = map
        .queryRenderedFeatures(evt.point)
        .filter(
          (feat) =>
            (feat.layer.id === "clusters" ||
              feat.layer.id.startsWith("clusters-spiderfy-leaf")) &&
            !feat.properties.cluster
        );
      if (featuresUnderMouse.length > 1) {
        return;
      }
      const feature = featuresUnderMouse[0];
      if (feature) {
        if (
          !lastHovered ||
          feature.source !== lastHovered.source ||
          feature.id !== lastHovered.id
        ) {
          lastHovered = feature;
          handleLeafEnter(feature);
        }
      } else {
        lastHovered = null;
        handleLeafExit(feature);
      }
    });

    popup = new mlgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    spiderfy.applyTo("clusters");

    map.addControl(new mlgl.NavigationControl({ showCompass: false }));

    map.fitBounds(mapBoundsObj);
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

    map.fitBounds(mapBoundsObj);
  }

  $: servicesWithCoords, updateMapContent();
</script>

<Map bind:map on:load={handleMapLoaded} />
