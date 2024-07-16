<script lang="ts">
  import { page } from "$app/stores";

  import Accordion from "$lib/components/display/accordion.svelte";
  import Button from "$lib/components/display/button.svelte";
  import Linkify from "$lib/components/display/linkify.svelte";
  import {
    copyIcon,
    externalLinkIcon,
    mailLineIcon,
    mapPinFillIcon,
    phoneFillIcon,
  } from "$lib/icons";
  import type { Model, Service } from "$lib/types";
  import { token } from "$lib/utils/auth";
  import { formatFilePath } from "$lib/utils/file";
  import { trackMobilisation } from "$lib/utils/stats";

  export let service: Service | Model;
  export let isDI = false;

  const searchId = $page.url.searchParams.get("searchId");
  const searchFragment = searchId ? `?searchId=${searchId}` : "";
  const orientationFormUrl = `/services/${isDI ? "di--" : ""}${service.slug}/orienter${searchFragment}`;

  let isContactInfoForProfessionalShown = false;
  let isContactInfoForIndividualShown = false;

  function trackMobilisationIfSignedIn() {
    if ($token) {
      trackMobilisation(service, $page.url, isDI);
    }
  }

  function trackMobilisationUnconditionally() {
    trackMobilisation(service, $page.url, isDI);
  }

  function showContactInfoForProfessional() {
    trackMobilisation(service, $page.url, isDI);
    isContactInfoForProfessionalShown = true;
  }

  function showContactInfoForIndividual() {
    trackMobilisation(service, $page.url, isDI);
    isContactInfoForIndividualShown = true;
  }

  $: contactInfoForIndividualAddress = [
    service.structureInfo.address1,
    service.structureInfo.address2,
  ]
    .filter(Boolean)
    .join(", ");
  $: contactInfoForIndividualPhone =
    service.contactPhone || service.structureInfo.phone;
  $: contactInfoForIndividualEmail =
    service.contactEmail || service.structureInfo.email;
</script>

<div id="orientation-modes">
  <Accordion title="Comment mobiliser ce service ?">
    <div class="mb-s32">
      <h3>Les démarches à réaliser</h3>

      <h4>Pour les professionnels d’insertion</h4>
      <ul class="typographic-list">
        {#if Array.isArray(service.coachOrientationModes)}
          {#each service.coachOrientationModes as mode, i (mode)}
            <li>
              {#if mode === "formulaire-externe"}
                <a
                  href={service.coachOrientationModesExternalFormLink}
                  target="_blank"
                  on:click={trackMobilisationUnconditionally}
                  class="text-magenta-cta underline"
                  >{service.coachOrientationModesExternalFormLinkText}
                  <span
                    class="inline-block h-s20 w-s20 fill-current pl-s4 pt-s6"
                    >{@html externalLinkIcon}</span
                  ></a
                >
              {:else if mode === "autre"}
                <Linkify
                  text={service.coachOrientationModesOther}
                  trackMobilisationOnLinkClick={{
                    service,
                    isDI,
                  }}
                />
              {:else}
                {service.coachOrientationModesDisplay[i]}
              {/if}
              {#if mode === "formulaire-dora"}
                <a
                  href={orientationFormUrl}
                  on:click={trackMobilisationIfSignedIn}
                  class="text-magenta-cta underline">Commencer</a
                >
              {:else if mode === "envoyer-fiche-prescription"}
                {#if isContactInfoForProfessionalShown}
                  <a
                    href={`mailto:${service.contactEmail}`}
                    class="text-magenta-cta underline">{service.contactEmail}</a
                  >
                {:else}
                  <button
                    on:click={showContactInfoForProfessional}
                    class="text-magenta-cta underline"
                    >Voir l’adresse email</button
                  >
                {/if}
              {:else if mode === "envoyer-courriel"}
                {#if isContactInfoForProfessionalShown}
                  <a
                    href={`mailto:${service.contactEmail}`}
                    class="text-magenta-cta underline">{service.contactEmail}</a
                  >
                {:else}
                  <button
                    on:click={showContactInfoForProfessional}
                    class="text-magenta-cta underline"
                    >Voir l’adresse email</button
                  >
                {/if}
              {:else if mode === "telephoner"}
                {#if isContactInfoForProfessionalShown}
                  <a
                    href={`tel:${service.contactPhone}`}
                    class="text-magenta-cta underline">{service.contactPhone}</a
                  >
                {:else}
                  <button
                    on:click={showContactInfoForProfessional}
                    class="text-magenta-cta underline"
                    >Voir le numéro de téléphone</button
                  >
                {/if}
              {/if}
            </li>
          {:else}
            <li>Non renseigné</li>
          {/each}
        {:else}
          <li>Non renseigné</li>
        {/if}
      </ul>

      <h4>Pour les particuliers</h4>
      <ul class="typographic-list">
        {#if Array.isArray(service.beneficiariesAccessModes)}
          {#each service.beneficiariesAccessModes as mode, i (mode)}
            <li>
              {#if mode === "formulaire-externe"}
                <a
                  href={service.beneficiariesAccessModesExternalFormLink}
                  target="_blank"
                  on:click={trackMobilisationUnconditionally}
                  class="text-magenta-cta underline"
                  >{service.beneficiariesAccessModesExternalFormLinkText}
                  <span
                    class="inline-block h-s20 w-s20 fill-current pl-s4 pt-s6"
                    >{@html externalLinkIcon}</span
                  ></a
                >
              {:else if mode === "autre"}
                <Linkify
                  text={service.beneficiariesAccessModesOther}
                  trackMobilisationOnLinkClick={{
                    service,
                    isDI,
                  }}
                />
              {:else}
                {service.beneficiariesAccessModesDisplay[i]}
              {/if}
            </li>
          {:else}
            <li>Non renseigné</li>
          {/each}
        {:else}
          <li>Non renseigné</li>
        {/if}
      </ul>
      {#if contactInfoForIndividualPhone || contactInfoForIndividualEmail}
        <div class="rounded-ml border border-gray-02 p-s24 shadow-sm">
          {#if isContactInfoForIndividualShown}
            <h5>{service.structureInfo.name}</h5>
            <ul class="space-y-s8 text-gray-text">
              {#if contactInfoForIndividualAddress}
                <li class="flex items-center gap-s16">
                  <span
                    class="inline-block h-s28 w-s28 rounded-full bg-service-blue p-s6 text-france-blue"
                    role="img"
                    aria-label="Adresse">{@html mapPinFillIcon}</span
                  >
                  {contactInfoForIndividualAddress}
                </li>
              {/if}
              {#if contactInfoForIndividualPhone}
                <li class="flex items-center gap-s16">
                  <span
                    class="inline-block h-s28 w-s28 rounded-full bg-service-blue p-s6 text-france-blue"
                    role="img"
                    aria-label="Téléphone">{@html phoneFillIcon}</span
                  >
                  <span class="flex items-center gap-s6"
                    >{contactInfoForIndividualPhone}<Button
                      on:click={() =>
                        navigator.clipboard.writeText(
                          contactInfoForIndividualPhone
                        )}
                      icon={copyIcon}
                      label="Copier le numéro de téléphone"
                      hideLabel
                      small
                      noBackground
                      noPadding
                    /></span
                  >
                </li>
              {/if}
              {#if contactInfoForIndividualEmail}
                <li class="flex items-center gap-s16">
                  <span
                    class="inline-block h-s28 w-s28 rounded-full bg-service-blue p-s6 text-france-blue"
                    role="img"
                    aria-label="Email">{@html mailLineIcon}</span
                  >
                  <span class="flex items-center gap-s6"
                    >{contactInfoForIndividualEmail}<Button
                      on:click={() =>
                        navigator.clipboard.writeText(
                          contactInfoForIndividualEmail
                        )}
                      icon={copyIcon}
                      label="Copier l’adresse email'"
                      hideLabel
                      small
                      noBackground
                      noPadding
                    /></span
                  >
                </li>
              {/if}
            </ul>
          {:else}
            <Button
              on:click={showContactInfoForIndividual}
              label="Afficher les coordonnées"
            />
          {/if}
        </div>
      {/if}
    </div>

    <div class="mb-s32">
      <h3>Les documents à fournir</h3>

      <h4>Documents à compléter</h4>
      <ul class="typographic-list">
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
      <ul class="typographic-list">
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
  .typographic-list {
    @apply mb-s24 list-disc break-all pl-s20 text-f18 leading-32 text-gray-text;
  }
</style>
