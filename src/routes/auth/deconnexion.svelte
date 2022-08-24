<script context="module">
  import { goto } from "$app/navigation";
  import { CANONICAL_URL, IC_BASE_URL, IC_CLIENT_ID } from "$lib/env";
  import { disconnect } from "$lib/auth";

  export async function load() {
    const icLogoutURL = `${IC_BASE_URL}/logout/?client_id=${IC_CLIENT_ID}&post_logout_redirect_uri=${CANONICAL_URL}`;
    disconnect();
    // TODO: real redirect, external
    goto(icLogoutURL);
    // TODO: return something here
    // }
  }
</script>
