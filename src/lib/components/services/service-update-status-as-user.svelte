<script lang="ts">
  import { browser } from "$app/env";

  import { type Service, SERVICE_UPDATE_STATUS } from "$lib/types";
  import Button from "$lib/components/button.svelte";
  import SuggestionModal from "./suggestion-modal.svelte";

  import NoUpdateNeededIcon from "$lib/assets/services/update-status/no-update-needed.svg";
  import UpdateNeededIcon from "$lib/assets/services/update-status/update-needed.svg";
  import UpdateRequiredIcon from "$lib/assets/services/update-status/update-required.svg";
  import { editIcon } from "$lib/icons";

  export let service: Service;

  export let label: string;
  export let monthDiff: number;
  export let updateStatus: SERVICE_UPDATE_STATUS;

  // Suggestion modal
  let suggestionModalIsOpen = false;

  function handleSuggestion() {
    suggestionModalIsOpen = true;
    if (browser) {
      window.plausible("suggestion", {
        props: {
          service: service.name,
          slug: service.slug,
          structure: service.structureInfo.name,
          departement: service.department,
        },
      });
    }
  }
</script>

<div
  class="flex w-full flex-col place-content-between items-center gap-s24 text-gray-text md:flex-row"
>
  <div id="label-container">
    {#if updateStatus === SERVICE_UPDATE_STATUS.NOT_NEEDED}
      <div class="flex items-center">
        <img src={NoUpdateNeededIcon} alt="" class="mr-s16" />
        <span>{label}</span>
      </div>
    {:else if updateStatus === SERVICE_UPDATE_STATUS.NEEDED}
      <div class="flex items-center">
        <img src={UpdateNeededIcon} alt="Attention" class="mr-s16" />
        <div>
          <div class="text-f18">
            <strong>{label}</strong>
          </div>
          <div class="text-f14">
            Ce service n’a pas été actualisé depuis longtemps, certaines
            informations peuvent ne pas être à jour.
          </div>
        </div>
      </div>
    {:else}
      <div class="flex items-center">
        <img src={UpdateRequiredIcon} alt="Attention" class="mr-s16" />
        <div>
          <div class="text-f18">
            <strong>Service en attente d’actualisation</strong>
          </div>
          <div class="text-f14">
            Les informations sur ce service ne sont plus mis à jour par la
            structure depuis {monthDiff} mois.
          </div>
        </div>
      </div>
    {/if}
  </div>

  <div>
    <SuggestionModal {service} bind:isOpen={suggestionModalIsOpen} />
    <Button
      id="suggest-update"
      label="Suggérer une modification"
      icon={editIcon}
      secondary
      on:click={handleSuggestion}
    />
  </div>
</div>
