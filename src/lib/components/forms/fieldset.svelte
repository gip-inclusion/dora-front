<script>
  export let title = "";
  export let description = "";
  export let noTopPadding = false;
  export let headerBg = "bg-white";
  export let noHeaderBorder = false;
</script>

<div
  class="flex max-w-4xl flex-col rounded-md shadow-md"
  class:mt-s48={!noTopPadding}
>
  <slot name="prefix" />
  {#if title}
    <div
      class="px-s40 pt-s32 rounded-t-md {headerBg} {noHeaderBorder
        ? ''
        : 'border-gray-01 pb-s24 border-b'}"
    >
      <h3
        class="mb-s8 {headerBg !== 'bg-white'
          ? 'text-white'
          : 'text-france-blue'}"
      >
        {title}
      </h3>
      <slot name="description">
        {#if description}
          <p class="text-f14 text-gray-text-alt2">{description}</p>
        {/if}
      </slot>
    </div>
  {/if}
  <div class="px-s40 pb-s40 pt-s24" class:pt-s32={!title}>
    <slot />
  </div>
</div>
