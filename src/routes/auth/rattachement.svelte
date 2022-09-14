<script>
  import { page } from "$app/stores";
  import { defaultAcceptHeader, getApiURL } from "$lib/utils/api.js";
  import EnsureLoggedIn from "$lib/components/ensure-logged-in.svelte";

  import AuthLayout from "./_auth_layout.svelte";
  import StructureSearch from "$lib/components/structures/search.svelte";
  import { get } from "svelte/store";
  import { token } from "$lib/auth";
  import { goto } from "$app/navigation";

  let siret = $page.url.searchParams.get("siret");

  let establishment;
  let tabId;

  async function handleJoin() {
    plausible("inscription", { props: { step: "Adhésion structure" } });
    const targetUrl = `${getApiURL()}/auth/join-structure/`;
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        Accept: defaultAcceptHeader,
        "Content-Type": "application/json",
        Authorization: `Token ${get(token)}`,
      },
      body: JSON.stringify({
        siret: establishment.siret,
      }),
    });

    const result = {
      ok: response.ok,
      status: response.status,
    };

    if (response.ok) {
      result.data = await response.json();
      await goto(`/structures/${result.data.slug}`);
    } else {
      try {
        result.error = await response.json();
      } catch (err) {
        console.error(err);
      }
    }
    return result;
  }
</script>

<svelte:head>
  <title>Rattachement à votre structure | DORA</title>
</svelte:head>

<EnsureLoggedIn>
  <AuthLayout>
    <StructureSearch
      hasValidation
      onValidate={handleJoin}
      {siret}
      bind:establishment
      bind:tabId
    />
  </AuthLayout>
</EnsureLoggedIn>
