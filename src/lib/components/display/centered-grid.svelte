<script lang="ts">
  export let noPadding = false;
  export let extraClass = "";
  export let bgColor = "bg-white";
  export let roundedColor = "";
</script>

<div class={roundedColor}>
  <div
    class="{extraClass} {bgColor} {roundedColor
      ? 'md:rounded-tl-[30px] md:rounded-tr-[30px] lg:rounded-tl-[45px] lg:rounded-tr-[45px] xl:rounded-tl-[60px] xl:rounded-tr-[60px]'
      : ''}"
  >
    <div class="px-s16 md:px-s40">
      <div
        class="mx-auto max-w-6xl"
        class:pt-s40={!noPadding}
        class:pb-s40={!noPadding}
      >
        <slot />
      </div>
    </div>
  </div>
</div>
