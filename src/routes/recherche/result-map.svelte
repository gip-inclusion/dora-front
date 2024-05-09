<script lang="ts">
  import * as mlgl from "maplibre-gl";
  import Map from "$lib/components/display/map.svelte";

  let map: mlgl.Map;
</script>

<Map bind:map />
