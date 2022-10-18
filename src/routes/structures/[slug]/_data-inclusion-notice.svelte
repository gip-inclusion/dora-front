<script lang="ts">
  import type { Structure } from "$lib/types";
  import orphanStructuresImg from "$lib/assets/illu-structures-orphelines.svg";
  import Button from "$lib/components/button.svelte";

  export let structure: Structure;
  export let source; // TODO: type me!

  function handleEditClick() {}

  // TODO: get the value from the backend
  $: sourceName = "XXX";
</script>

<div
  class="mt-s40 flex flex-col gap-s112 rounded-lg bg-info-light px-s24 py-s40 md:flex-row md:px-s112"
>
  <div class="shrink-0 grow self-center">
    <img src={orphanStructuresImg} alt="" width="238" height="227" />
  </div>
  <div>
    <h3>
      Des informations de votre structure provenant de {sourceName} sont déjà préremplies
      pour vous sur DORA&nbsp;!
    </h3>
    <p class="legende mb-s40 text-f14">
      Dora s’associe à <strong
        >Data Inclusion, le référentiel partagé des offres d’insertion</strong
      >. Avec cette démarche de
      <strong>«&nbsp;Dites-le-nous une fois&nbsp;»</strong>, certaines
      informations de votre structure présentes sur la plateforme {sourceName} se
      retrouvent sur DORA. Vous pouvez les conserver à l’identique ou les modifier
      selon vos besoins.
    </p>
    <Button label="Compléter vos informations" on:click={handleEditClick} />
  </div>
</div>
