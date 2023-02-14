<script lang="ts">
  export let textTopIcon = "";
  export let title = "";
  export let rightImage = "";
</script>

<div class="flex rounded-md border border-gray-03 p-s40">
  <div class="flex flex-[4] flex-col">
    <div class="mb-s14 text-center">
      <span
        class="ml-s10 inline-block h-s24 w-s24 fill-current text-gray-text-alt2"
      >
        {@html textTopIcon}
      </span>
    </div>
    <h3 class="text-center text-f30 leading-40 text-gray-text">{title}</h3>

    <div class="text-gray-text">
      <slot />
    </div>
  </div>

  <div class="flex flex-[3] items-center justify-center">
    <img alt="" src={rightImage} />
  </div>
</div>
