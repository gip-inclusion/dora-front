<script lang="ts">
  import { browser } from "$app/environment";
  import CenteredGrid from "$lib/components/display/centered-grid.svelte";
  import ModelHeader from "./model-header.svelte";
  import { trackModel } from "$lib/utils/plausible";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  import cornerLeftLightBlueImg from "$lib/assets/style/corner-left-lightblue.png";
  import cornerRightLightBlueImg from "$lib/assets/style/corner-right-lightblue.png"; // TODO

  import RelativeDateLabel from "$lib/components/display/relative-date-label.svelte";
  import UpdateStatusIcon from "$lib/components/specialized/services/update-status-icon.svelte";

  import LinkButton from "$lib/components/display/link-button.svelte";
  import { userInfo } from "$lib/utils/auth";
  import { addCircleIcon, editIcon } from "$lib/icons";
  import ServiceBody from "$lib/components/specialized/services/display/service-body.svelte";

  export let data: PageData;

  onMount(() => {
    trackModel(data.model);
  });
</script>

<CenteredGrid bgColor="bg-blue-information">
  <ModelHeader model={data.model} />
</CenteredGrid>

<div class="relative hidden w-full md:block">
  <img
    src={cornerLeftLightBlueImg}
    alt=""
    class="md absolute top-s0 left-s0 print:hidden"
  />
  <img
    src={cornerRightLightBlueImg}
    alt=""
    class="top-0 absolute right-s0 print:hidden"
  />
</div>

{#if browser}
  <CenteredGrid bgColor="" extraClass="mb-s14 w-full">
    <div class="flex items-center justify-between text-gray-text">
      <div class="flex items-center">
        <span class="mr-s16">
          <UpdateStatusIcon updateStatus="NOT_NEEDED" />
        </span>

        <RelativeDateLabel
          date={data.model.modificationDate}
          prefix="Mis à jour"
        />
      </div>

      <div class="flex gap-s24">
        {#if data.model.canWrite}
          <LinkButton
            label="Modifier"
            to="/modeles/{data.model.slug}/editer"
            secondary
            icon={editIcon}
          />
        {/if}

        {#if $userInfo}
          <LinkButton
            icon={addCircleIcon}
            label="Créer un service"
            to={`/services/creer?modele=${data.model.slug}`}
          />
        {/if}
      </div>
    </div>
    <hr class="mt-s32" />
  </CenteredGrid>
{/if}

<ServiceBody
  service={data.model}
  servicesOptions={data.servicesOptions}
  showContact
  isModel
/>
