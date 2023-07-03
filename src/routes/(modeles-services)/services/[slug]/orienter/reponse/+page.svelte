<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  onMount(() => {
    // trackOrientationConsultation(data.id, $page.url);
  });
</script>
