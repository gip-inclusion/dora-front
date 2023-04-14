<script lang="ts">
  export let position: "left" | "right";
  export let bgColor: string;
</script>

<div
  class="top-0 container absolute h-[60px] w-[60px] overflow-hidden {bgColor} print:hidden {position}"
  class:left-s0={position === "left"}
  class:right-s0={position === "right"}
>
  <div
    class="h-[120px] w-[120px] rounded-[100%] bg-white"
    class:-translate-x-[60px]={position === "right"}
  />
</div>

<style lang="postcss">
  .left,
  .right {
    zoom: 0.6;
  }

  @screen xl {
    .left,
    .right {
      zoom: 1;
    }
  }
</style>
