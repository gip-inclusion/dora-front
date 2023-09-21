<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import * as mlgl from "maplibre-gl";
  import Spiderfy from "@nazka/map-gl-js-spiderfy";

  import "maplibre-gl/dist/maplibre-gl.css";
  import circleIcon from "$lib/assets/icons/circle-yellow.png";
  import mapStyle from "./map-style.json?raw"; // Basé sur https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json

  const METROPOLE_BB: mlgl.LngLatBoundsLike = [-5, 42, 8, 51];

  export let map: mlgl.Map;
  export let spiderfy: Spiderfy;

  export let onLeafClick: (
    feature: mlgl.GeoJSONFeature,
    event: mlgl.MapMouseEvent
  ) => void;
  export let onLeafHover: (
    feature: mlgl.GeoJSONFeature,
    event: mlgl.MapMouseEvent
  ) => void;

  export let onMapLoaded;

  let mapDiv: HTMLElement;

  onMount(() => {
    map = new mlgl.Map({
      container: mapDiv,
      style: JSON.parse(mapStyle),
      center: [1.5, 46.5],
      zoom: 4,
      maxZoom: 17,
    });
    map.fitBounds(METROPOLE_BB, {
      padding: 20,
    });

    map.on("load", () => {
      spiderfy = new Spiderfy(map, {
        minZoomLevel: 12,
        zoomIncrement: 2,
        renderMethod: "3d",
        closeOnLeafClick: false,
        onLeafClick: onLeafClick,
        onLeafHover: onLeafHover,
      });
      map.loadImage(circleIcon, (error, image) => {
        if (error) {
          throw error;
        }
        if (!image) {
          throw new Error("Impossible de charger l'image");
        }
        map.addImage("cluster", image);
        onMapLoaded();
      });
    });
  });

  onDestroy(() => {
    map.remove();
  });
</script>

<div class="h-full w-full" bind:this={mapDiv} />
