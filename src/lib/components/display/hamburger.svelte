<script lang="ts">
  import { closeIcon, menuIcon } from "$lib/icons";

  let isOpen = true;
</script>

<div class="flex lg:hidden">
  <div>
    <button on:click={() => (isOpen = true)} class="text-gray-text">
      <span class="inline-block h-s24 w-s24 text-gray-text">
        {@html menuIcon}
      </span>
    </button>

    {#if isOpen}
      <div
        class="fixed top-s0 right-s0 left-s0 z-20 h-[100%] overflow-y-auto bg-white p-s32"
      >
        <div class="flex justify-end">
          <button
            class="flex items-center p-s20 text-magenta-cta"
            on:click={() => (isOpen = false)}
          >
            Fermer
            <span class="inline-block h-s24 w-s24 fill-current">
              {@html closeIcon}
            </span>
          </button>
        </div>

        <div>
          <slot />
        </div>
      </div>
    {/if}
  </div>
</div>

<div class="hidden lg:flex">
  <slot />
</div>
