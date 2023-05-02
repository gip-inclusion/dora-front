<script lang="ts">
  import { arrowDownSIcon, arrowUpSIcon } from "$lib/icons";
  import { clickOutside } from "$lib/utils/misc";
  import { randomId } from "$lib/utils/random";

  export let mobileDesign = false;
  export let buttonClass = mobileDesign
    ? "py-s16 text-f18 font-bold text-gray-dark w-full flex justify-between"
    : "text-f14 text-gray-text p-s16";

  export let label: string;
  export let links: { href: string; label: string }[] = [];
  let isOpen = false;

  const id = `sub-dropdown-menu-${randomId()}`;

  function handleClickOutside(_event) {
    isOpen = false;
  }
</script>

<div
  class="relative {mobileDesign ? 'border-b border-gray-03' : ''}"
  use:clickOutside
  on:click_outside={handleClickOutside}
>
  <button
    aria-expanded={isOpen}
    aria-controls={id}
    class="flex h-full items-center {buttonClass}"
    on:click={() => (isOpen = !isOpen)}
  >
    <span>{label}</span>
    <span class="ml-s8 inline-block h-s24 w-s24 fill-current text-gray-text">
      {#if isOpen}
        {@html arrowUpSIcon}
      {:else}
        {@html arrowDownSIcon}
      {/if}
    </span>
  </button>

  <ul
    {id}
    class="{mobileDesign ? '' : 'absolute top-[100%]'} z-10 bg-white"
    class:hidden={!isOpen}
  >
    {#each links as link, index}
      <li class="whitespace-nowrap px-s16 text-f14 text-gray-text">
        <a
          href={link.href}
          class="inline-block w-full border-gray-03 py-s16
          {index === links.length - 1 || mobileDesign
            ? 'border-b-none'
            : 'border-b'}"
        >
          {link.label}
        </a>
      </li>
    {/each}
  </ul>
</div>
