<script lang="ts">
  import Label from "$lib/components/label.svelte";
  import type { ModerationStatus } from "$lib/enums";

  export let moderationStatus: ModerationStatus;
</script>

{#if moderationStatus === "NEED_INITIAL_MODERATION"}
  <Label label="Première modération nécessaire" bold error />
{:else if moderationStatus === "NEED_NEW_MODERATION"}
  <Label label="Nouvelle modération nécessaire" bold error />
{:else if moderationStatus === "IN_PROGRESS"}
  <Label label="En cours" bold wait />
{:else if moderationStatus === "VALIDATED"}
  <Label label="Validé" bold success />
{/if}
