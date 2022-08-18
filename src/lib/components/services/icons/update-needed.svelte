<script>
  import { errorWarningLineIcon } from "$lib/icons";

  export let small = false;

  const dimension = small ? "h-s16 w-s16" : "h-s24 w-s24";
  const padding = small ? "p-s8" : "p-s12";
</script>

<div class={`rounded-full bg-wait-dark ${padding}`}>
  <div class={`${dimension} fill-current text-white`}>
    {@html errorWarningLineIcon}
  </div>
</div>
