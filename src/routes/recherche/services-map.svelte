<script lang="ts">
  import * as mlgl from "maplibre-gl";
  import type Spiderfy from "@nazka/map-gl-js-spiderfy";
  import insane from "insane";
  import Map from "$lib/components/display/map.svelte";
  import { zoomToResults } from "$lib/utils/map";

  import type { ServiceSearchResult } from "$lib/types";

  export let services: ServiceSearchResult[] = [];
  export let selectedServiceSlug: string | null;

  let map: mlgl.Map;

  let popup: mlgl.Popup;
  let spiderfy: Spiderfy;

  function getPopupContent(feature): string {
    return insane(
      `<strong>${feature.properties.name}</strong><br>${feature.properties.shortDesc}`
    );
  }

  function handleLeafClick(feature: mlgl.GeoJSONFeature) {
    window.open(`/services/${feature.properties.slug}`, "_blank").focus();
  }

  function handleLeafEnter(feature: mlgl.GeoJSONFeature) {
    // console.log("enter", feature);
    map.getCanvas().style.cursor = "pointer";
    const coordinates = feature.geometry.coordinates.slice();
    selectedServiceSlug = feature.properties.slug;
    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates).setHTML(getPopupContent(feature)).addTo(map);
    popup._update();
  }

  function handleLeafExit(_feature: mlgl.GeoJSONFeature) {
    map.getCanvas().style.cursor = "";
    selectedServiceSlug = null;
    popup.remove();
  }

  function handleOnMapLoaded() {
    const servs = services.filter((serv) => !!serv.coordinates);
    map.addSource("servicesSource", {
      type: "geojson",
      promoteId: "slug",
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50,
      data: {
        type: "FeatureCollection",
        features: servs.map((service) => ({
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
    });

    spiderfy.applyTo("clusters");
    zoomToResults(map, servs);
    popup = new mlgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    let lastHovered = null;
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

    map.on("click", (evt) => {
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
        lastHovered = feature;
        handleLeafClick(feature);
      }
    });
  }

  function updateMapContent() {
    if (!map) {
      return;
    }
    const servs = services.filter((serv) => !!serv.coordinates);

    map.getSource("servicesSource").setData({
      type: "FeatureCollection",
      features: servs.map((feat) => ({
        type: "Feature",
        properties: {
          ...feat,
        },
        geometry: {
          type: "Point",
          coordinates: [feat.coordinates[0], feat.coordinates[1]],
        },
      })),
    });
    zoomToResults(map, servs);
  }

  // function updateHoveredFeature(serviceSlug: string | null) {
  //   if (!map) {
  //     return;
  //   }
  //
  //   if (map.getSource("servicesSource")) {
  //     map.removeFeatureState({
  //       source: "servicesSource",
  //     });
  //   }
  //   if (serviceSlug) {
  //     map.setFeatureState(
  //       {
  //         source: "servicesSource",
  //         id: serviceSlug,
  //       },
  //       { hover: true }
  //     );
  //   }
  // }

  // $: updateHoveredFeature(selectedServiceSlug);
  $: services, updateMapContent();
</script>

<Map bind:map bind:spiderfy onMapLoaded={handleOnMapLoaded} />
