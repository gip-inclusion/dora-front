<script>
  import { copyIcon } from "$lib/icons";

  export let orange = false;

  const presentation = orange
    ? "bg-service-orange-darker text-white"
    : "bg-service-blue text-service-blue-dark";
</script>

<div class={`rounded-full p-s8 ${presentation}`}>
  <div class="h-s16 w-s16 fill-current ">
    {@html copyIcon}
  </div>
</div>
