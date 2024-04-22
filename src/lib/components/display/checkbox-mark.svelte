<script lang="ts">
  export let checked = false;
</script>

<div
  class="checkbox flex h-s24 w-s24 shrink-0 justify-center rounded border border-gray-03"
>
  <div
    class="checkbox-mark h-s12 w-s12 self-center bg-magenta-cta"
    class:invisible={!checked}
  />
</div>

<style>
  /* Handle "checked state" with CSS when adjacent to checkbox input */
  :global(input[type="checkbox"]:checked + .checkbox .checkbox-mark) {
    @apply visible;
  }
</style>
