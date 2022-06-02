<script>
  import { token } from "$lib/auth";

  import ModelMenu from "$lib/components/services/model-menu.svelte";
  import StateButtonMenu from "$lib/components/services/state-button-menu.svelte";

  export let service;
  export let onRefresh;
</script>

<div class="inline-flex flex-wrap items-start gap-s8">
  {#if $token && service.canWrite}
    <StateButtonMenu {service} {onRefresh} />
    <ModelMenu {service} secondary {onRefresh} inline />
  {/if}
</div>
