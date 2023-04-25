<script lang="ts">
  import { arrowDownSIcon, arrowUpSIcon } from "$lib/icons";
  import { clickOutside } from "$lib/utils/misc";
  import { randomId } from "$lib/utils/random";

  export let icon: string | undefined = undefined;
  export let label: string | undefined = undefined;
  export let hideLabel = false;

  let isOpen = false;
  const id = `button-menu-${randomId()}`;

  function handleClickOutside(_event) {
    isOpen = false;
  }
</script>

<div use:clickOutside on:click_outside={handleClickOutside}>
  <div class="wrapper">
    <button
      aria-expanded={isOpen}
      aria-controls={id}
      class:bg-magenta-10={isOpen}
      class:border-magenta-cta={isOpen}
      class="flex items-center justify-between rounded border border-gray-03 py-s12 px-s16 text-left"
      on:click={() => (isOpen = !isOpen)}
    >
      {#if icon}
        <span class="mr-s10 h-s24 w-s24 fill-current text-magenta-cta">
          {@html icon}
        </span>
      {/if}
      <span class:sr-only={hideLabel} class="text-gray-text">
        {label}
      </span>

      <span class="ml-s10 h-s24 w-s24 fill-current text-magenta-cta">
        {#if isOpen}
          {@html arrowUpSIcon}
        {:else}
          {@html arrowDownSIcon}
        {/if}
      </span>
    </button>

    <div {id} class="children top-[100%] p-s12" class:open={isOpen}>
      <slot />
    </div>
  </div>
</div>

<style lang="postcss">
  .wrapper {
    position: relative;
  }

  .children {
    position: absolute;
    z-index: 1000;
    right: 0;
    display: none;
    flex-direction: column;
    align-items: flex-end;
    background-color: var(--col-white);
    border-radius: var(--s8);
    box-shadow: var(--shadow-md);
  }

  .open {
    display: flex;
  }
</style>
