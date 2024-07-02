<script lang="ts">
  import { page } from "$app/stores";

  import Accordion from "$lib/components/display/accordion.svelte";
  import type { Service } from "$lib/types";
  import { token } from "$lib/utils/auth";
  import { formatFilePath } from "$lib/utils/file";
  import { addlinkToUrls } from "$lib/utils/misc";
  import { trackMobilisation } from "$lib/utils/stats";

  export let service: Service;
  export let isDI = false;

  const searchId = $page.url.searchParams.get("searchId");
  const searchFragment = searchId ? `?searchId=${searchId}` : "";
  const orientationFormUrl = `/services/${isDI ? "di--" : ""}${service.slug}/orienter${searchFragment}`;

  function trackMobilisationIfSignedIn() {
    if ($token) {
      trackMobilisation(service, $page.url, isDI);
    }
  }
</script>

<div id="orientation-modes">
  <Accordion title="Comment mobiliser ce service ?">
    <div class="mb-s32">
      <h3>Les démarches à réaliser</h3>

      <h4>Pour les accompagnateurs</h4>
      <ul>
        {#if Array.isArray(service.coachOrientationModesDisplay)}
          {#each service.coachOrientationModes as mode, i (mode)}
            <li>
              {#if mode === "autre"}
                {@html addlinkToUrls(service.coachOrientationModesOther)}
              {:else}
                {service.coachOrientationModesDisplay[i]}
              {/if}
              {#if mode === "formulaire-dora"}
                <a
                  href={orientationFormUrl}
                  on:click={trackMobilisationIfSignedIn}
                  class="text-magenta-cta underline">Commencer</a
                >
              {/if}
            </li>
          {:else}
            <li>Non renseigné</li>
          {/each}
        {:else}
          <li>Non renseigné</li>
        {/if}
      </ul>

      <h4>Pour les bénéficiaires</h4>
      <ul>
        {#if Array.isArray(service.beneficiariesAccessModesDisplay)}
          {#each service.beneficiariesAccessModesDisplay as mode (mode)}
            <li>
              {#if mode === "Autre (préciser)"}
                {@html addlinkToUrls(service.beneficiariesAccessModesOther)}
              {:else}
                {mode}
              {/if}
            </li>
          {:else}
            <li>Non renseigné</li>
          {/each}
        {:else}
          <li>Non renseigné</li>
        {/if}
      </ul>
    </div>

    <div class="mb-s32">
      <h3>Les documents à fournir</h3>

      <h4>Documents à compléter</h4>
      <ul>
        {#if Array.isArray(service.formsInfo)}
          {#each service.formsInfo as form}
            <li>
              <span class="break-word">
                <a
                  target="_blank"
                  rel="noopener ugc"
                  href={form.url}
                  class="hover:underline"
                  title="Ouverture dans une nouvelle fenêtre"
                  >{formatFilePath(form.name)}</a
                >
              </span>
            </li>
          {/each}
        {/if}
        {#if service.onlineForm}
          <li>
            <span class="break-word">
              <a
                target="_blank"
                class="hover:underline"
                rel="noopener ugc"
                title="Ouverture dans une nouvelle fenêtre"
                href={service.onlineForm}>{service.onlineForm}</a
              >
            </span>
          </li>
        {/if}
        {#if Array.isArray(service.formsInfo)}
          {#if service.formsInfo.length === 0 && !service.onlineForm}
            <li>Aucun</li>
          {/if}
        {:else if !service.onlineForm}
          <li>Non renseigné</li>
        {/if}
      </ul>

      <h4>Justificatifs à fournir</h4>
      <ul>
        {#if Array.isArray(service.credentialsDisplay)}
          {#each service.credentialsDisplay as creds}
            <li><span>{creds}</span></li>
          {:else}
            <li><span>Aucun</span></li>
          {/each}
        {:else}
          <li>Non renseigné</li>
        {/if}
      </ul>
    </div>
  </Accordion>
</div>

<style lang="postcss">
  ul {
    @apply mb-s24 list-disc break-all pl-s20 text-f18 leading-32 text-gray-text;
  }
</style>
