<script>
  import Button from "$lib/components/button.svelte";

  import { arrowRightSIcon, arrowLeftCircleIcon } from "$lib/icons.js";
  export let withBack = false;
  export let withForward = false;
  export let onGoBack, onGoForward, onPublish;
  export let currentPageIsValid;
</script>

<div class="col-span-full col-start-1 ">
  <div class="flex flex-row gap-s48">
    {#if withBack}
      <Button
        on:click={onGoBack}
        name="backward"
        label="Étape précédente"
        icon={arrowLeftCircleIcon}
        noBackground
        iconOnLeft
      />
    {/if}
    <div class="grow" />

    {#if withForward}
      <Button
        on:click={onGoForward}
        name="forward"
        label="Ajouter plus d’informations"
        secondary
        disabled={currentPageIsValid}
        icon={arrowRightSIcon}
        iconOnRight
      />
    {/if}

    <Button
      on:click={onPublish}
      name="validate"
      label="Envoyer la contribution"
      disabled={currentPageIsValid}
      icon={arrowRightSIcon}
      iconOnRight
    />
  </div>
</div>
