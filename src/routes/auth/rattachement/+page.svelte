<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/display/button.svelte";
  import EnsureLoggedIn from "$lib/components/hoc/ensure-logged-in.svelte";
  import StructureSearch from "$lib/components/specialized/establishment-search/search.svelte";
  import { defaultAcceptHeader, getApiURL } from "$lib/utils/api";
  import { token, userInfo, refreshUserInfo } from "$lib/utils/auth";
  import { trackJoinStructure } from "$lib/utils/plausible";
  import { get } from "svelte/store";
  import AuthLayout from "../auth-layout.svelte";
  import type { PageData } from "./$types";
  import cguText from "../../(static)/cgu/content.md?raw";
  import StaticMarkdown from "$lib/components/display/static-markdown.svelte";
  import { needToAcceptCgu } from "$lib/utils/cgu";
  import { CGU_VERSION } from "../../(static)/cgu/version";

  export let data: PageData;

  let requirementsAccepted = false;
  let cguCanBeValidated = false;
  let { establishment } = data;
  let ctaLabel = "";

  async function handleJoin() {
    trackJoinStructure();

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
        cguVersion: CGU_VERSION,
      }),
    });

    const result = {
      ok: response.ok,
      status: response.status,
    };

    if (response.ok) {
      result.data = await response.json();

      await refreshUserInfo();
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

  $: alreadyMember = $userInfo?.structures
    ?.map((struct) => struct.siret)
    ?.includes(establishment?.siret);
  $: alreadyRequested = $userInfo?.pendingStructures
    ?.map((struct) => struct.siret)
    ?.includes(establishment?.siret);

  $: {
    if (alreadyRequested) {
      ctaLabel = "Relancer l’administrateur";
    } else if (alreadyMember) {
      ctaLabel = "Accéder à la structure";
    } else {
      ctaLabel = "Adhérer à la structure";
    }
  }
</script>

<EnsureLoggedIn>
  <AuthLayout>
    <StructureSearch bind:establishment title="Identifiez votre structure">
      <div slot="cta">
        {#if establishment?.siret}
          <div>
            {#if alreadyMember}
              Votre compte est déjà rattaché à cette structure.
            {:else if alreadyRequested}
              Votre précédente demande d’adhésion est en attente de validation
              par l’administrateur de la structure.
            {:else if needToAcceptCgu($userInfo)}
              <div
                class="cgu mb-s24 max-h-s512 overflow-auto border border-gray-02 p-s20"
                on:scroll={(evt) => {
                  if (requirementsAccepted) {
                    return;
                  }

                  const { scrollTop, scrollHeight, clientHeight } = evt.target;
                  cguCanBeValidated =
                    scrollTop + clientHeight >= scrollHeight - 100;
                }}
              >
                <StaticMarkdown content={cguText} />
              </div>

              <div class="legend">
                <label
                  class="flex flex-row items-start"
                  class:opacity-50={!cguCanBeValidated}
                >
                  <input
                    bind:checked={requirementsAccepted}
                    type="checkbox"
                    disabled={!cguCanBeValidated}
                    class="hidden"
                  />
                  <div
                    class="flex h-s24 w-s24 shrink-0 justify-center rounded border border-gray-03"
                  >
                    <div
                      class=" h-s12 w-s12 self-center bg-magenta-cta"
                      class:hidden={!requirementsAccepted}
                    />
                  </div>
                  <span class="ml-s16 inline-block  text-f14 text-gray-text">
                    Je déclare avoir lu les
                    <a
                      href="/cgu"
                      class="underline"
                      target="_blank"
                      rel="noopener">Conditions générales d’utilisation</a
                    > et faire partie de la structure mentionnée ci-dessus.</span
                  >
                </label>
              </div>
            {:else}
              <div class="legend">
                <label class="flex flex-row items-start">
                  <input
                    bind:checked={requirementsAccepted}
                    type="checkbox"
                    class="hidden"
                  />
                  <div
                    class="flex h-s24 w-s24 shrink-0 justify-center rounded border border-gray-03"
                  >
                    <div
                      class=" h-s12 w-s12 self-center bg-magenta-cta"
                      class:hidden={!requirementsAccepted}
                    />
                  </div>
                  <span class="ml-s16 inline-block  text-f14 text-gray-text">
                    Je déclare faire partie de la structure mentionnée
                    ci-dessus.
                  </span>
                </label>
              </div>
            {/if}
            <div class="mt-s24 flex justify-end">
              <Button
                type="submit"
                label={ctaLabel}
                on:click={handleJoin}
                preventDefaultOnMouseDown
                disabled={!requirementsAccepted}
              />
            </div>
          </div>
        {/if}
      </div>
    </StructureSearch>
  </AuthLayout>
</EnsureLoggedIn>

<style type="postcss">
  :global(.cgu h1) {
    @apply text-f18;
  }
  :global(.cgu h2) {
    @apply text-f16;
  }
  :global(.cgu p, .cgu li, .cgu a) {
    @apply text-f14;
  }
</style>
