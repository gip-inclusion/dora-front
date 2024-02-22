<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Button from "$lib/components/display/button.svelte";
  import ServiceContact from "$lib/components/specialized/services/service-contact.svelte";
  import { trackDiMobilisation, trackMobilisation } from "$lib/utils/stats";
  import type { Service } from "$lib/types";

  export let service: Service;
  export let contactBoxOpen = false;
  export let isDI = false;
  function showContact() {
    contactBoxOpen = true;
    const searchId = $page.url.searchParams.get("searchId");

    if (isDI) {
      trackDiMobilisation(service, $page.url, searchId);
    } else {
      trackMobilisation(service, $page.url, searchId);
    }
  }

  function handleOrientationClick() {
    if (!service.isOrientable) {
      showContact();
    } else {
      goto(`/services/${isDI ? "di--" : ""}${service.slug}/orienter`);
    }
  }
  function handleShareClick() {}
</script>

<h2 class="text-f23 text-white">Mobiliser ce service</h2>

<div class="w-full sm:w-auto">
  <div class="print:hidden">
    <div class="mb-s16 mt-s16">
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
    </div>

    <div class="text-white">
      <Button
        on:click={handleShareClick}
        extraClass="!bg-france-blue text-white !border !border-white hover:!bg-magenta-cta hover:!border-france-blue"
        label="Partager cette fiche"
        wFull
      />
    </div>
  </div>
</div>
