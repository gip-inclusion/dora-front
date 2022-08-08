<script>
  export let text;
</script>

<span
  class="cursor-pointer text-f12 underline"
  on:click={() => {
    navigator.clipboard.writeText(text);
  }}>copier</span
>
