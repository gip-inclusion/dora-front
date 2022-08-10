<script lang="ts">
  import type { Service } from "$lib/types";
  import { SERVICE_UPDATE_STATUS } from "$lib/types";
  import LinkButton from "../link-button.svelte";

  import NoUpdateNeededIcon from "$lib/assets/services/update-status/no-update-needed.svg";
  import UpdateNeededIcon from "$lib/assets/services/update-status/update-needed.svg";
  import UpdateRequiredIcon from "$lib/assets/services/update-status/update-required.svg";
  import { checkboxCircleFill, editIcon } from "$lib/icons";
  import Button from "../button.svelte";

  export let service: Service;

  export let label: string;
  export let monthDiff: number;
  export let updateStatus: SERVICE_UPDATE_STATUS;
</script>

<div
  class="flex w-full flex-col place-content-between items-center gap-s24 text-gray-text sm:flex-row"
>
  <div class="flex-[3]">
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
            Vérifiez et/ou actualisez les informations de ce service dès
            maintenant pour qu’il reste visible.
            <br />
            <a href={"#TODO"} class="underline">En savoir plus</a>
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
  <div class="flex w-full flex-[2] flex-col justify-end md:mt-s0 lg:flex-row">
    {#if updateStatus !== SERVICE_UPDATE_STATUS.NOT_NEEDED}
      <!-- TODO -->
      <Button
        extraClass="mb-s10 lg:mb-s0 lg:mr-s16"
        label="Marquer comme à jour"
        icon={checkboxCircleFill}
      />
    {/if}

    <LinkButton
      label="Modifier"
      to="/services/{service.slug}/editer"
      icon={editIcon}
    />
  </div>
</div>
