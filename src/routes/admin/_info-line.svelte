<script>
  export let condition = true;
</script>

{#if condition}
  <div class="mb-s24">
    <slot />
  </div>
{/if}
