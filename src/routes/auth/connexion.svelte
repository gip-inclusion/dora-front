<script>
  import { page } from "$app/stores";

  import CenteredGrid from "$lib/components/layout/centered-grid.svelte";

  import connexionPic from "$lib/assets/illu_connexion-optimise.svg";
  import boutonIC from "$lib/assets/inclusion_connect_button.png";
  import logosICPartners from "$lib/assets/logos-partenaires-inclusion-connect.png";
  import { get } from "svelte/store";
  import { token } from "$lib/auth.js";
  import { goto } from "$app/navigation";
  // TODO: factorize

  // if we already have a token, bypass the page altogether

  function getNextPage() {
    const next = $page.url.searchParams.get("next");
    if (next && next.startsWith("/") && !next.startsWith("/auth/")) return next;
    return "/";
  }

  function getLoginHint() {
    const loginHint = $page.url.searchParams.get("login_hint");

    if (loginHint) {
      $page.url.searchParams.delete("login_hint");
      return `&login_hint=${encodeURIComponent(loginHint)}`;
    }
    return "";
  }

  const loginHint = getLoginHint();
  const nextPage = getNextPage();

  if (get(token)) {
    goto(getNextPage());
    // TODO: what should I return here?
  }
</script>

<svelte:head>
  <title>Connexion / Inscription | DORA</title>
</svelte:head>

<CenteredGrid extraClass="bg-gradient-to-b from-magenta-10 to-magenta-10/0">
  <div class="flex gap-s40">
    <img class="flex-none" src={connexionPic} width="587" height="532" alt="" />
    <div class="flex-1">
      <h1 class="text-france-blue">DORA passe à Inclusion Connect&nbsp;!</h1>

      <p class="mt-s24 mb-s24">
        Lorem ipsum <strong>Inclusion Connect</strong> dolor sit amet, consectetur
        adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
        aliqua. Sem nulla pharetra diam sit amet nisl suscipit adipiscing bibendum.
        Sollicitudin tempor id eu nisl nunc. Egestas maecenas pharetra convallis
        posuere morbi.
      </p>
      <img
        src={logosICPartners}
        alt="Les emplois de l'inclusion, la communauté de l'inclusion, DORA"
      />
      <p class="mt-s24 mb-s24">
        <strong>
          Si vous avez déjà un compte DORA, vous pouvez recréer un compte
          Inclusion Connect avec la même adresse e-mail, et conserver toutes vos
          données Dora.
        </strong>
      </p>

      <div class="mb-s40">
        <a
          href="/auth/ic-connect?next={encodeURIComponent(nextPage)}{loginHint}"
        >
          <img
            src={boutonIC}
            alt="S’identifier avec Inclusion Connect"
            width="516"
            height="59"
          />
        </a>
      </div>
    </div>
  </div>
</CenteredGrid>
