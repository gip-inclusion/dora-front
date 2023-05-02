<script lang="ts">
  import { afterNavigate } from "$app/navigation";
  import { arrowDownSIcon, arrowUpSIcon } from "$lib/icons";
  import { clickOutside } from "$lib/utils/misc";
  import { randomId } from "$lib/utils/random";

  export let icon: string | undefined = undefined;
  export let label: string | undefined = undefined;
  export let hideLabel = false;
  export let mobileDesign = false;
  export let minWidth: string | undefined = undefined;

  let isOpen = false;
  const id = `dropdown-menu-${randomId()}`;

  function handleClickOutside(_event) {
    isOpen = false;
  }

  afterNavigate(() => {
    isOpen = false;
  });
</script>

<div
  use:clickOutside
  on:click_outside={handleClickOutside}
  class="w-full lg:w-auto"
>
  <div class="wrapper flex w-full lg:w-auto">
    <button
      aria-expanded={isOpen}
      aria-controls={id}
      class:bg-magenta-10={isOpen}
      class="flex w-full items-center justify-between rounded border border-gray-03 text-left lg:w-auto"
      class:border-magenta-cta={isOpen}
      on:click={() => (isOpen = !isOpen)}
    >
      {#if $$slots.label}
        <div class="px-s20">
          <slot name="label" />
        </div>
      {/if}

      <span class="flex items-center" class:pl-s20={!$$slots.label}>
        {#if icon}
          <span class="mr-s10 h-s24 w-s24 fill-current text-magenta-cta">
            {@html icon}
          </span>
        {/if}

        {#if !$$slots.label}
          <span
            class:sr-only={hideLabel}
            class="whitespace-nowrap text-left text-gray-text"
          >
            {label}
          </span>
        {/if}
      </span>

      <span
        class="flex border-gray-03 px-s16 py-s12"
        class:border-l={$$slots.label}
      >
        <span class="h-s24 w-s24 fill-current text-magenta-cta">
          {#if isOpen}
            {@html arrowUpSIcon}
          {:else}
            {@html arrowDownSIcon}
          {/if}
        </span>
      </span>
    </button>

    <div
      {id}
      class="children top-[100%] {minWidth ? `min-w-[${minWidth}]` : ''}"
      class:fullWidth={mobileDesign}
      class:open={isOpen}
    >
      <div class="w-full p-s12">
        <slot />
      </div>

      {#if $$slots.bottom}
        <div class="w-full border-t border-gray-03 px-s24 py-s20">
          <slot name="bottom" />
        </div>
      {/if}
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
  .children.fullWidth {
    left: 0;
  }

  .open {
    display: flex;
  }
</style>
