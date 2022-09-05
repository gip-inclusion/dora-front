<script context="module">
  import { token, setToken, validateCredsAndFillUserInfo } from "$lib/auth";
  import { goto } from "$app/navigation";
  import { get } from "svelte/store";
  import { getApiURL, defaultAcceptHeader } from "$lib/utils/api";

  export async function load({ url, fetch }) {
    function getNextPage() {
      const next = url.searchParams.get("next");
      if (next && next.startsWith("/") && !next.startsWith("/auth/"))
        return next;
      return "/";
    }

    // if we already have a token, bypass the page altogether
    if (get(token)) {
      await goto(getNextPage());
      // TODO: what should I return here?
    }

    const query = url.searchParams;
    const code = query.get("code");
    if (!code) {
      // First arrival on the page
      const targetUrl = `${getApiURL()}/inclusion-connect-get-login-info/`;
      const result = await fetch(targetUrl, {
        method: "POST",
        headers: {
          Accept: defaultAcceptHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          redirect_uri: url.href,
        }),
      });

      if (result.ok) {
        let { url: icUrl, state } = await result.json();
        window.localStorage.setItem("oidcState", state);
        return {
          props: {
            icUrl,
          },
        };
      }
      // TODO return errors
    } else {
      // back from IC, with a code
      const state = query.get("state");
      const storedState = window.localStorage.getItem("oidcState");
      window.localStorage.removeItem("oidcState");

      const targetUrl = `${getApiURL()}/inclusion-connect-authenticate/`;
      const result = await fetch(targetUrl, {
        method: "POST",
        headers: {
          Accept: defaultAcceptHeader,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          code,
          state,
          frontendState: storedState,
        }),
      });

      let jsonResult = {};

      if (result.ok) {
        jsonResult = await result.json();
        setToken(jsonResult.token);
        await validateCredsAndFillUserInfo();
        goto(getNextPage());

        return {
          props: {},
        };
      }
      // TODO return error
    }
  }
</script>

<script>
  import CenteredGrid from "$lib/components/layout/centered-grid.svelte";
  import LinkButton from "$lib/components/link-button.svelte";

  import AuthLayout from "./_auth_layout.svelte";
  import Notice from "$lib/components/notice.svelte";

  import logoIC from "$lib/assets/inclusion_connect_button.svg";

  export let icUrl;
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
    <a href={icUrl}>
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
