<script>
  import { page } from "$app/stores";

  import CenteredGrid from "$lib/components/layout/centered-grid.svelte";
  import LinkButton from "$lib/components/link-button.svelte";
  import Fieldset from "$lib/components/forms/fieldset.svelte";
  import Info from "$lib/components/info.svelte";
  import AuthLayout from "./_auth_layout.svelte";

  import logoIC from "$lib/assets/inclusion_connect_button.svg";
  import { get } from "svelte/store";
  import { token } from "$lib/auth.js";
  import { goto } from "$app/navigation";
  import { informationLineIcon } from "$lib/icons.js";

  // TODO: factorize

  // if we already have a token, bypass the page altogether

  function getNextPage() {
    const next = $page.url.searchParams.get("next");
    if (next && next.startsWith("/") && !next.startsWith("/auth/")) return next;
    return "/";
  }

  if (get(token)) {
    goto(getNextPage());
    // TODO: what should I return here?
  }
</script>

<svelte:head>
  <title>Accédez à votre compte | DORA</title>
</svelte:head>

<CenteredGrid>
  <div class="text-center">
    <h1 class="text-france-blue">Accédez à votre compte</h1>
  </div>
</CenteredGrid>

<AuthLayout>
  <Fieldset title="Connexion">
    <Info
      label="DORA passe à Inclusion Connect&nbsp;!"
      leftBorder
      info
      icon={informationLineIcon}
    >
      Si vous avez déjà un compte DORA, créez un compte Inclusion Connect avec
      la même adresse e-mail.
    </Info>
    <div class="mb-s40">
      <a href="/auth/ic-connect?next={encodeURIComponent(getNextPage())}">
        <img src={logoIC} alt="Se connecter avec Inclusion Connect" />
      </a>
      <a
        href="https://kindly-sunscreen-95c.notion.site/Simplifions-l-utilisation-des-services-destination-des-professionnels-de-l-inclusion-ded9135197654da590f5dde41d8bb68b"
        class=" text-f12 text-gray-text-alt2 underline"
        target="_blank"
        rel="noopener nofollow"
      >
        Qu’est-ce que Inclusion Connect&nbsp;?
      </a>
    </div>
  </Fieldset>

  <Fieldset title="S’inscrire">
    <LinkButton label="Créer un compte" nofollow to={`/auth/inscription`} />
  </Fieldset>
</AuthLayout>
