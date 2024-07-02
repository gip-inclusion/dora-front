<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  import Button from "$lib/components/display/button.svelte";
  import LinkButton from "$lib/components/display/link-button.svelte";
  import ServiceContact from "$lib/components/specialized/services/display/service-contact.svelte";
  import { externalLinkIcon } from "$lib/icons";
  import type { Service } from "$lib/types";
  import { token } from "$lib/utils/auth";
  import { trackMobilisation } from "$lib/utils/stats";

  import SharingModal from "./modals/sharing-modal.svelte";

  export let service: Service;
  // Si il n'y a pas d'information de contact, on n'affiche pas le bouton
  export let contactBoxOpen = !(service.contactEmail || service.contactPhone);
  export let isDI = false;

  $: hasExternalForm =
    service.coachOrientationModes.includes("formulaire-externe");

  let sharingModalIsOpen = false;
  function showContact() {
    if (!$token && !service.isContactInfoPublic) {
      goto(
        `/auth/connexion?next=${encodeURIComponent(
          $page.url.pathname + $page.url.search
        )}`
      );
      return;
    }
    contactBoxOpen = true;
    // on tracke comme une MER si les contacts du service sont publics
    trackMobilisation(service, $page.url, isDI);
  }

  function handleOrientationClick() {
    if (!service.isOrientable) {
      showContact();
    } else {
      if ($token) {
        trackMobilisation(service, $page.url, isDI);
      }
      const searchId = $page.url.searchParams.get("searchId");
      const searchFragment = searchId ? `?searchId=${searchId}` : "";
      goto(
        `/services/${isDI ? "di--" : ""}${
          service.slug
        }/orienter${searchFragment}`
      );
    }
  }

  function handleExternalFormClick() {
    trackMobilisation(service, $page.url, isDI);
  }

  function handleShareClick() {
    sharingModalIsOpen = true;
  }
</script>

<SharingModal bind:isOpen={sharingModalIsOpen} {service} {isDI} />

<h2 class="text-f23 text-white">Mobiliser ce service</h2>

<div class="mt-s16 flex w-full flex-col gap-s16 sm:w-auto print:hidden">
  {#if contactBoxOpen}
    <ServiceContact {service} />
  {:else}
    <Button
      on:click={handleOrientationClick}
      extraClass="bg-white !text-france-blue hover:!text-white text-center !whitespace-normal text-center"
      label="Orienter votre bénéficiaire"
      wFull
    />
  {/if}

  {#if hasExternalForm}
    <LinkButton
      on:click={handleExternalFormClick}
      to={service.coachOrientationModesExternalFormLink}
      extraClass="bg-white !text-france-blue hover:!text-white text-center !whitespace-normal text-center"
      label={service.coachOrientationModesExternalFormLinkText}
      icon={externalLinkIcon}
      iconOnRight
      otherTab
      wFull
    />
  {/if}

  <Button
    on:click={handleShareClick}
    extraClass="!bg-france-blue text-white !border !border-white hover:!bg-magenta-cta hover:!border-france-blue"
    label="Partager cette fiche"
    wFull
  />
</div>
