<script lang="ts">
  import { arrowDownSIcon, arrowUpSIcon } from "$lib/icons";
  import { uid } from "uid";

  export let title: string;
  let expanded = true;

  const id = uid();
</script>

<h2 class="mb-s40">
  <button
    aria-expanded={expanded}
    aria-controls={id}
    class="flex w-full items-center justify-between"
    on:click={() => (expanded = !expanded)}
  >
    {title}

    <span class="ml-s10 h-s24 w-s24 fill-current text-magenta-cta">
      {#if expanded}
        {@html arrowDownSIcon}
      {:else}
        {@html arrowUpSIcon}
      {/if}
    </span>
  </button>
</h2>

<div {id} class:hidden={!expanded}><slot /></div>
