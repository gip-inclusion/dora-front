<script lang="ts">
  import Button from "$lib/components/display/button.svelte";
  import ServiceContact from "$lib/components/specialized/services/service-contact.svelte";
  import ServiceLoginNotice from "./service-login-notice.svelte";
  import { trackMobilisation } from "$lib/utils/plausible";
  import LinkButton from "$lib/components/display/link-button.svelte";
  import { FLAG_ORIENTATION } from "$lib/env";

  export let service, showContact;
  let contactOpen = false;

  function handleShowContactClick() {
    contactOpen = true;
    trackMobilisation(service);
  }
</script>

<h2 class="text-f23">Mobiliser le service</h2>

{#if showContact}
  <div class="w-full sm:w-auto">
    <div class="hidden print:inline">
      <ServiceContact {service} />
    </div>
    <div class="print:hidden">
      {#if !contactOpen}
        <div class="mb-s16">
          <Button
            on:click={handleShowContactClick}
            label="Voir les informations de contact"
            wFull
            secondary={!!FLAG_ORIENTATION}
          />
        </div>
      {:else}
        <ServiceContact {service} />
      {/if}
      {#if FLAG_ORIENTATION}
        <div class="mb-s16">
          <LinkButton
            to="/services/{service.slug}/orienter"
            label="Orienter"
            wFull
          />
        </div>
      {/if}
    </div>
  </div>
{:else}
  <ServiceLoginNotice {service} />
{/if}
