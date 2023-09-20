<script lang="ts">
  import Info from "$lib/components/display/info.svelte";
  import Modal from "$lib/components/hoc/modal.svelte";

  export let reinvitedUsers;
  export let isOpen = false;

  $: numSent = reinvitedUsers?.reinvited?.length;
  $: numNotSent = reinvitedUsers?.blacklisted?.length;
</script>

<Modal bind:isOpen title="Relance effectuée">
  <Info label="Merci" positiveMood>
    {#if numSent}
      <p>
        {#if numSent === 1}
          Un utilisateur a été relancé.
        {:else}
          {numSent} utilisateurs ont été relancés.
        {/if}
      </p>
    {/if}
    {#if numNotSent}
      <p>
        {#if numNotSent === 1}
          Un utilisateur n’a pas été relancé car il l’a déjà été récemment.
        {:else}
          {numNotSent} utilisateurs n’ont pas été relancés car ils l’ont déjà été
          récemment.
        {/if}
      </p>
    {/if}
  </Info>
</Modal>
