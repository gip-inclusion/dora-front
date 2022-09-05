<script context="module">
  import { goto } from "$app/navigation";
  import { CANONICAL_URL } from "$lib/env";
  import { disconnect } from "$lib/auth";
  import { defaultAcceptHeader, getApiURL } from "$lib/utils/api.js";

  export async function load() {
    const targetUrl = `${getApiURL()}/inclusion-connect-get-logout-info/`;
    const result = await fetch(targetUrl, {
      method: "POST",
      headers: {
        Accept: defaultAcceptHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        redirect_uri: CANONICAL_URL,
      }),
    });
    let jsonResult = {};

    if (result.ok) {
      jsonResult = await result.json();

      disconnect();
      // TODO: real redirect, external
      await goto(jsonResult.url);
      // TODO: return something here
    }
    // TODO: surface error
  }
</script>
