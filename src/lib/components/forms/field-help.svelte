<script>
  import { lightBulbIcon } from "$lib/icons.js";
  export let title;
</script>

<style lang="postcss">
  .help {
    position: absolute;
    right: -472px;
    width: 384px;
  }

  .help-content :global(p) {
    @apply mb-s16 last:mb-0;
  }
</style>

<div
  class="px-2 pt-2 pb-3 bg-white border-l-4 rounded-r help border-information"
>
  {#if title}
    <div
      class="flex font-bold flex-row items-center mb-1 text-lg leading-normal text-information"
    >
      <div class="w-3 h-3 mr-1 fill-current">
        {@html lightBulbIcon}
      </div>
      {title}
    </div>
  {/if}
  <div class="help-content text-sm leading-large text-gray-text">
    <slot />
  </div>
</div>
