<script lang="ts">
  import Button from "$lib/components/display/button.svelte";
  import {
    checkboxCircleFillIcon,
    checkboxBlankCircle,
    closeIcon,
  } from "$lib/icons";
  import {
    canShowQuickStart,
    isStructureInformationsComplete,
    isFirstResearchDone,
    hasOneService,
    hasInviteMembers,
  } from "$lib/requests/structures";
  import type { Structure } from "$lib/types";

  export let structure: Structure;

  $: steps = [
    {
      label: "Compléter le profil de votre structure",
      complete: isStructureInformationsComplete(structure),
    },
    {
      label: "Inviter vos collaborateurs",
      complete: hasInviteMembers(structure),
    },
    {
      label: "Référencer un de vos services",
      complete: hasOneService(structure),
    },
    {
      label: "Faire votre première recherche",
      complete: isFirstResearchDone(structure),
    },
  ];

  $: canCloseQuickStart = steps.filter(({ complete }) => complete).length >= 2;
</script>

{#if canShowQuickStart(structure)}
  <div class="rounded-md border border-gray-03">
    <div
      class="relative flex items-center justify-between gap-s16 border-b border-gray-01 px-s16 pb-s24 pt-s24 sm:flex-row sm:px-s35"
    >
      <div>
        <h2 class="mb-s0 text-f23">Guide de démarrage rapide</h2>
        <p class="m-s0 text-f14">Vos premiers pas sur DORA</p>
      </div>

      {#if canCloseQuickStart}
        <button class="flex">
          <span class="h-s24 w-s24 fill-magenta-cta">
            {@html closeIcon}
          </span>
          <span class="sr-only">Masquer le guide</span>
        </button>
      {/if}
    </div>

    <div class="px-s16 font-bold sm:px-s35">
      <ul>
        {#each steps as { label, complete }}
          <li
            class:line-through={complete}
            class:fill-success={complete}
            class="flex items-center border-b border-gray-01 py-s16 sm:py-s35"
          >
            <span class="mr-s16 h-s24 w-s24">
              {@html complete ? checkboxCircleFillIcon : checkboxBlankCircle}
            </span>
            {label}
          </li>
        {/each}

        <li class="py-s35 text-right">
          <Button label="Masquer le guide" secondary on:click={() => {}} />
        </li>
      </ul>
    </div>
  </div>
{/if}
