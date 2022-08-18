<script lang="ts">
  import LinkButton from "$lib/components/link-button.svelte";
  import { checkboxCircleFillIcon, copyIcon, editIcon } from "$lib/icons";
  import {
    type Service,
    type DashboardService,
    SERVICE_UPDATE_STATUS,
  } from "$lib/types";
  import Button from "../button.svelte";
  import SetAsUpdatedModal from "./set-as-updated-modal.svelte";

  export let service: Service | DashboardService;
  export let updateStatus: SERVICE_UPDATE_STATUS | undefined;
  export let inline = false;
  export let onRefresh: () => void | undefined;

  let setAsUpdatedModalOpen = false;
</script>

<div
  class:flex={inline}
  class:items-start={inline}
  class:gap-s8={!service.model && inline}
>
  {#if updateStatus && updateStatus !== SERVICE_UPDATE_STATUS.NOT_NEEDED}
    <Button
      label="Marquer comme à jour"
      icon={checkboxCircleFillIcon}
      small
      noBackground
      on:click={() => (setAsUpdatedModalOpen = true)}
    />

    <SetAsUpdatedModal
      bind:isOpen={setAsUpdatedModalOpen}
      {service}
      {onRefresh}
    />
  {/if}

  {#if service.model}
    <LinkButton
      label="Modifier"
      to="/services/{service.slug}/editer"
      icon={editIcon}
      small
      noBackground
    />

    <div class="py-s6 text-gray-02" class:hidden={!inline}>|</div>

    <LinkButton
      label="Voir le modèle"
      to="/modeles/{service.model}"
      icon={copyIcon}
      small
      noBackground
    />
  {:else}
    <LinkButton
      label="Modifier"
      to="/services/{service.slug}/editer"
      small
      icon={editIcon}
      noBackground={!inline}
      secondary={inline}
    />
    <LinkButton
      label="Créer un modèle"
      to={`/modeles/creer?service=${service.slug}&structure=${service.structure}`}
      small
      icon={copyIcon}
      secondary={inline}
      noBackground={!inline}
    />
  {/if}
</div>
