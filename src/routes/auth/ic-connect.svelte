<script context="module">
  import { CANONICAL_URL } from "$lib/env.js";

  export const ssr = false;

  import { token } from "$lib/auth";
  import { goto } from "$app/navigation";
  import { get } from "svelte/store";
  import { getApiURL, defaultAcceptHeader } from "$lib/utils/api";

  function getNextPage(url) {
    const next = url.searchParams.get("next");
    if (next && next.startsWith("/") && !next.startsWith("/auth/")) return next;
    return "/";
  }

  export async function load({ url, fetch }) {
    const nextPage = getNextPage(url);

    // if we already have a token, bypass the page altogether
    if (get(token)) {
      await goto(nextPage);
      // TODO: what should I return here?
      return;
    }

    const targetUrl = `${getApiURL()}/inclusion-connect-get-login-info/`;
    const result = await fetch(targetUrl, {
      method: "POST",
      headers: {
        Accept: defaultAcceptHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        redirect_uri: `${CANONICAL_URL}/auth/ic-callback?next=${encodeURIComponent(
          nextPage
        )}`,
      }),
    });

    if (result.ok) {
      let { url: icUrl, state } = await result.json();
      window.localStorage.setItem("oidcState", state);

      return {
        status: 302,
        redirect: icUrl,
      };
    }
  }
</script>
