<script>
  import { onDestroy, onMount } from "svelte";

  export let formId;
  export let timeout = 45000;
  let timeoutFn;

  onMount(() => {
    if (window.Tally);

    timeoutFn = setTimeout(() => {
      window.Tally.openPopup(formId, {
        layout: "default",
        width: 420,
        hideTitle: true,
        autoClose: 0,
      });
    }, timeout);
  });

  onDestroy(() => {
    window.Tally.closePopup(formId);
    clearTimeout(timeoutFn);
  });
</script>
