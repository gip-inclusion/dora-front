<script lang="ts">
  import Button from "$lib/components/display/button.svelte";
  import { setModerationState } from "$lib/requests/admin";
  import type { ModerationStatus } from "$lib/types";

  export let entity; // either a Service or a Structure
  export let onRefresh;
  let moderationStatus: ModerationStatus;

  async function handleInProgress() {
    await setModerationState(entity, "IN_PROGRESS");
    if (onRefresh) {
      await onRefresh();
    }
  }

  async function handleValidate() {
    await setModerationState(entity, "VALIDATED");
    if (onRefresh) {
      await onRefresh();
    }
  }

  async function handleRemoderate() {
    await setModerationState(entity, "NEED_NEW_MODERATION");
    if (onRefresh) {
      await onRefresh();
    }
  }

  $: moderationStatus = entity.moderationStatus;
</script>

<div class="flex flex-col items-end">
  {#if moderationStatus === "NEED_INITIAL_MODERATION"}
    <Button label="En progrès" on:click={handleInProgress} small noBackground />
    <Button label="Validé" on:click={handleValidate} small noBackground />
  {:else if moderationStatus === "NEED_NEW_MODERATION"}
    <Button label="En progrès" on:click={handleInProgress} small noBackground />
    <Button label="Validé" on:click={handleValidate} small noBackground />
  {:else if moderationStatus === "IN_PROGRESS"}
    <Button label="Validé" on:click={handleValidate} small noBackground />
  {:else if moderationStatus === "VALIDATED"}
    <Button
      label="À remodérer"
      on:click={handleRemoderate}
      small
      noBackground
    />
  {:else}
    <Button
      label="À remodérer"
      on:click={handleRemoderate}
      small
      noBackground
    />
    <Button label="En progrès" on:click={handleInProgress} small noBackground />
    <Button label="Validé" on:click={handleValidate} small noBackground />
  {/if}
</div>
