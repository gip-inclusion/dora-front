<script>
  import Modal from "$lib/components/modal.svelte";
  import CenteredGrid from "$lib/components/layout/centered-grid.svelte";
  import { formTrackStore } from "$lib/stores/form-track";

  export let service;
</script>

<Modal title="Donnez votre avis" isOpen on:close={() => formTrackStore.clear()}>
  <CenteredGrid bgColor="bg-gray-bg">
    <div class="h-s512">
      <iframe
        src={`https://tally.so/embed/mRGdpK?alignLeft=1&hideTitle=1&transparentBackground=1&service=${service.slug}&temps=${service.fillingDuration}`}
        width="100%"
        height="512"
        frameborder="0"
        marginheight="0"
        marginwidth="0"
        title="Formulaire d'évaluation de la saisie d'un service"
      />
    </div>
  </CenteredGrid>
</Modal>
