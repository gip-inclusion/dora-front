<script>
  import { page } from "$app/stores";

  import CenteredGrid from "$lib/components/layout/centered-grid.svelte";
  import LinkButton from "$lib/components/link-button.svelte";

  import AuthLayout from "./_auth_layout.svelte";
  import Notice from "$lib/components/notice.svelte";

  import logoIC from "$lib/assets/inclusion_connect_button.svg";

  // TODO: factorize
  function getNextPage() {
    const next = $page.url.searchParams.get("next");
    if (next && next.startsWith("/") && !next.startsWith("/auth/")) return next;
    return "/";
  }
</script>

<svelte:head>
  <title>Se connecter | DORA</title>
</svelte:head>

<CenteredGrid>
  <div class="text-center">
    <h1 class="text-france-blue">Connexion</h1>
  </div>
</CenteredGrid>

<AuthLayout>
  <div class="mb-s40">
    <a href="/auth/ic-connect?next={encodeURIComponent(getNextPage())}">
      <img src={logoIC} alt="Se connecter avec Inclusion Connect" />
    </a>
  </div>

  <Notice title="Vous n'avez pas encore de compte ?">
    <LinkButton
      slot="button"
      label="Créer un compte"
      secondary
      nofollow
      small
      to={`/auth/inscription`}
    />
  </Notice>
</AuthLayout>
