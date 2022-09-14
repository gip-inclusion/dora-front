<script>
  import { page } from "$app/stores";
  import FieldSet from "$lib/components/forms/fieldset.svelte";
  import AuthLayout from "./_auth_layout.svelte";
  import { informationLineIcon } from "$lib/icons.js";
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

<AuthLayout>
  <FieldSet headerBg="bg-magenta-brand" noHeaderBorder noTopPadding>
    <div class="flex-1">
      <h2 class="mb-s32 text-france-blue">Accédez à votre compte</h2>

      <div class="rounded-lg bg-info-light p-s16">
        <h4 class="flex text-info">
          <div class="mr-s8 inline-block h-s24 w-s24 fill-current">
            {@html informationLineIcon}
          </div>
          <div>DORA passe à Inclusion Connect&nbsp!</div>
        </h4>
        <div class="legend mb-s16 text-gray-text">
          Si vous avez un Compte DORA, il vous suffit de créer un compte
          Inclusion Connect avec la même adresse e-mail afin de retrouver les
          mêmes droits et données.
        </div>
      </div>

      <p class="mt-s24 mb-s24" />
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
        <div class="my-s24 text-center">
          <a
            class="text-magenta-cta underline"
            target="_blank"
            title="Ouverture dans une nouvelle fenêtre"
            rel="noopener nofollow noreferrer"
            href="https://aide.dora.fabrique.social.gouv.fr/fr/"
          >
            Besoin d’aide&nbsp;? Contactez-nous</a
          >
        </div>

        <hr class="my-s24 " />
        <img
          src={logosICPartners}
          alt="Les emplois de l'inclusion, la communauté de l'inclusion, DORA"
        />
        <div class="my-s24 text-center">
          Avec <strong>Inclusion Connect</strong> vous pouvez accéder aux différents
          services partenaires avec le même identifiant et mot de passe.
        </div>
        <div class="text-center">
          <a
            class="text-magenta-cta underline"
            target="_blank"
            rel="noopener nofollow noreferrer"
            href="https://kindly-sunscreen-95c.notion.site/Simplifions-l-utilisation-des-services-destination-des-professionnels-de-l-inclusion-ded9135197654da590f5dde41d8bb68b"
          >
            En savoir plus
          </a>
        </div>
      </div>
    </div>
  </FieldSet>
</AuthLayout>
