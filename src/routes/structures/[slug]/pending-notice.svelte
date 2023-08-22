<script lang="ts">
  import Button from "$lib/components/display/button.svelte";
  import Info from "$lib/components/display/info.svelte";
  import Notice from "$lib/components/display/notice.svelte";
  import { adminIcon } from "$lib/icons";
  import type { StructureMember } from "$lib/types";

  const requestResent = false;

  export let admins: StructureMember[] = [];

  const resendRequestFlag = false;
</script>

<Notice
  title="Votre accès à cette structure est en attente de validation"
  type="warning"
>
  <p class="text-f14">
    Si au bout de quelques jours vous n’avez pas de réponse, vous pouvez
    {#if admins.length}
      relancer {admins
        .map(
          (admin) => `${admin.user.firstName.charAt(0)}. ${admin.user.lastName}`
        )
        .join(", ")}.
    {:else}
      les relancer.
    {/if}
    En cas de difficultés, n’hésitez pas à nous contacter.
  </p>

  {#if resendRequestFlag}
    {#if requestResent}
      <Info
        label="Votre demande a été enregistrée"
        icon={adminIcon}
        info
        whiteBg
        leftBorder
      >
        Un message à été envoyé aux responsables de votre structure.
      </Info>
    {:else}
      <Button label="Relancer les administrateurs" disabled />
    {/if}
  {/if}
</Notice>
