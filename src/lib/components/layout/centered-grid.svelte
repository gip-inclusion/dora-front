<script>
  export let noPadding = false;
  export let borderTop = false;
  export let extraClass = "";
  export let bgColor = "bg-white";
</script>

<div class="{extraClass} wrapper {bgColor} print:bg-white">
  <div class="px-s16 md:px-s40" class:borderTop>
    <div
      class="mx-auto max-w-6xl"
      class:pt-s40={!noPadding}
      class:pb-s40={!noPadding}
    >
      <slot />
    </div>
  </div>
</div>

<style lang="postcss">
  .borderTop {
    border-color: var(--col-gray-03);
    border-top-width: 1px;
  }
</style>
