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
    map.on("mouseenter", "clusters", function (evt) {
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = "pointer";
      const features = map.queryRenderedFeatures(evt.point, {
        layers: ["clusters"],
      });
      if (features.length === 1 && !features[0].properties.cluster) {
        const feature = features[0];
        const coordinates = feature.geometry.coordinates.slice();
        selectedServiceSlug = feature.properties.slug;

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup
          .setLngLat(coordinates)
          .setHTML(getPopupContent(feature))
          .addTo(map);
        popup._update();
      }
    });
    map.on("mouseleave", "clusters", function () {
      map.getCanvas().style.cursor = "";
      selectedServiceSlug = null;
      popup.remove();
    });

    map.on("click", "clusters", (evt) => {
      const features = map.queryRenderedFeatures(evt.point, {
        layers: ["clusters"],
      });
      if (features.length === 1 && !features[0].properties.cluster) {
        console.log(features[0]);
      }
    });
  }

  function updateMapContent() {
    if (!map) {return;}
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

  function handleLeafClick(
    feature: mlgl.GeoJSONFeature,
    event: mlgl.MapMouseEvent
  ) {
    console.log(feature, event);
  }

  function handleLeafHover(
    feature: mlgl.GeoJSONFeature,
    event: mlgl.MapMouseEvent
  ) {
    console.log(feature, event);
  }

  // $: updateHoveredFeature(selectedServiceSlug);
  $: services, updateMapContent();
</script>

<Map
  bind:map
  bind:spiderfy
  onMapLoaded={handleOnMapLoaded}
  onLeafClick={handleLeafClick}
  onLeafHover={handleLeafHover}
/>
