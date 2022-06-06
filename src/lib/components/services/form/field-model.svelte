<script>
  import Button from "$lib/components/button.svelte";

  export let showDiff = false;
  export let value;
  export let propType = "text";

  export let useValue;

  export let paddingTop;
</script>

<div
  class:flex={showDiff}
  class:flex-col={showDiff}
  class:lg:flex-row={showDiff}
  class:gap-s32={showDiff}
>
  <div class="{showDiff ? 'lg:w-2/3' : ''} class">
    <slot />
  </div>
  {#if showDiff}
    <div class="lg:w-1/3" class:pt-s40={paddingTop} class:pt-s6={!paddingTop}>
      {#if !value}
        <p class="text-f14 italic text-gray-text-alt">
          Pas de différence avec le modèle
        </p>
      {:else if propType === "text"}
        <p class="text-f14 text-gray-text">{value}</p>
      {/if}

      {#if value}
        <Button label="Utiliser" small secondary on:click={useValue} />
      {/if}
    </div>
  {/if}
</div>
