<script lang="ts">
  import { SERVICE_UPDATE_STATUS, type Service } from "$lib/types";
  import { token } from "$lib/auth";
  import LinkButton from "../link-button.svelte";

  import CenteredGrid from "../layout/centered-grid.svelte";
  import SynchronizedIcon from "$lib/components/services/icons/synchronized.svelte";

  import ServiceUpdateStatusAsWriter from "./service-update-status-as-writer.svelte";
  import ServiceUpdateStatusAsUser from "./service-update-status-as-user.svelte";
  import ServiceStateUpdateSelect from "./service-state-update-select.svelte";
  import {
    computeUpdateStatusData,
    computeUpdateStatusLabel,
  } from "$lib/utils/service";
  import { copyIcon } from "$lib/icons";

  export let service: Service;
  export let servicesOptions;
  export let onRefresh: () => void;

  let updateStatusData = computeUpdateStatusData(service);
  let { updateStatus, monthDiff } = updateStatusData;
  let label = computeUpdateStatusLabel(updateStatusData);

  $: {
    updateStatusData = computeUpdateStatusData(service);
    updateStatus = updateStatusData.updateStatus;
    monthDiff = updateStatusData.monthDiff;
    label = computeUpdateStatusLabel(updateStatusData);
  }
</script>

<div id="service-update-status">
  <div class={updateStatus}>
    <CenteredGrid
      extraClass={`
        py-s32 mb-s14 w-full
        ${
          service.canWrite && updateStatus === SERVICE_UPDATE_STATUS.NEEDED
            ? "bg-service-orange"
            : ""
        }
        ${
          service.canWrite && updateStatus === SERVICE_UPDATE_STATUS.REQUIRED
            ? "bg-service-red"
            : ""
        }
      `}
      noPadding
    >
      {#if $token && service.canWrite}
        <ServiceUpdateStatusAsWriter
          {monthDiff}
          {label}
          {updateStatus}
          {onRefresh}
          {service}
        />
      {:else}
        <ServiceUpdateStatusAsUser
          {label}
          {monthDiff}
          {updateStatus}
          {service}
        />
      {/if}
    </CenteredGrid>
  </div>

  {#if !service.canWrite || updateStatus === SERVICE_UPDATE_STATUS.NOT_NEEDED}
    <div
      class="m-auto max-w-6xl border border-t-0 border-r-0 border-l-0 border-gray-02"
    />
  {/if}

  {#if $token && service.canWrite}
    <CenteredGrid extraClass="w-full" noPadding>
      <div
        class="flex w-full flex-col place-content-between items-center gap-s24 py-s32 sm:flex-row"
      >
        <div>
          <ServiceStateUpdateSelect
            {service}
            {servicesOptions}
            {onRefresh}
            hideLabel={false}
          />
        </div>
        <div class="flex h-s48 items-center md:self-end">
          {#if service.model}
            <div class="flex items-center text-f14 italic text-gray-text">
              <span class="mr-s10"><SynchronizedIcon /></span>
              Synchronisé avec un modèle
            </div>
          {:else}
            <LinkButton
              label="Utiliser comme modèle"
              icon={copyIcon}
              iconOnRight
              secondary
              to={`/modeles/creer?service=${service.slug}&structure=${service.structure}`}
            />
          {/if}
        </div>
      </div>
    </CenteredGrid>
  {/if}
</div>

<style lang="postcss">
  .NOT_NEEDED {
    @apply mx-auto flex items-center;
  }
  .NEEDED {
    @apply bg-service-orange;
  }
  .REQUIRED {
    @apply bg-service-red;
  }
</style>
