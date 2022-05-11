<script>
  import Notice from "$lib/components/notice.svelte";
  import LinkButton from "$lib/components/link-button.svelte";

  import { userInfo } from "$lib/auth";

  export let structure;
</script>

<Notice title="Vous gérez cette structure ?">
  <p class="text-f14">Mettez à jour vos services.</p>

  <div slot="button">
    {#if $userInfo}
      <LinkButton
        label="Demander l’accès…"
        to="https://itou.typeform.com/doracontactsupp"
        otherTab
        nofollow
        secondary
        small
      />
    {:else}
      <LinkButton
        label="Créer un compte…"
        to="/auth/inscription?siret={structure.siret}"
        otherTab
        nofollow
        small
        secondary
      />
    {/if}
  </div>
</Notice>
