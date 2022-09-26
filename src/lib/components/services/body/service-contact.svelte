<script lang="ts">
  import type { DashboardService, Service } from "$lib/types";
  import ContactEmail from "./contact-email.svelte";
  import ContactPhone from "./contact-phone.svelte";

  export let service: Service | DashboardService;

  const emailPreferred =
    service.coachOrientationModes.includes("envoyer-courriel");
  // envoyer-fiche-prescription => email
  // envoyer-formulaire
  // autre
  const phonePreferred = service.coachOrientationModes.includes("telephoner");
  const allPreferred = emailPreferred && phonePreferred;
</script>

<div>
  <div class="flex flex-col gap-s4 text-f14">
    {#if service.contactName || service.contactPhone || service.contactEmail}
      {#if service.contactName}
        <p class="mb-s6 mr-s24 text-gray-dark">
          <strong>{service.contactName}</strong>
        </p>
        {#if emailPreferred && service.contactEmail}
          <ContactEmail {service} preferred />
          {#if !phonePreferred}
            <p class="text-f12 text-gray-text">
              Cette structure privilégie l’e-mail comme moyen pour mobiliser ce
              service.
            </p>
          {/if}
        {/if}
        {#if phonePreferred && service.contactPhone}
          <ContactPhone {service} preferred />
          {#if !emailPreferred}
            <p class="text-f12 text-gray-text">
              Cette structure privilégie le téléphone comme moyen pour mobiliser
              ce service.
            </p>
          {/if}
        {/if}

        <div
          class="my-s8 rounded-md bg-info-light p-s16 text-f14 text-gray-text"
        >
          Pensez à préciser que vous avez identifié le service sur DORA 😇
        </div>
      {/if}
      {#if !allPreferred}
        <p class="mb-s6 mr-s24 text-gray-dark">
          <strong>Autres coordonnées</strong>
        </p>
        {#if !emailPreferred && service.contactEmail}
          <ContactEmail {service} />
        {/if}
        {#if !phonePreferred && service.contactPhone}
          <ContactPhone {service} />
        {/if}
      {/if}
    {/if}
  </div>
</div>
