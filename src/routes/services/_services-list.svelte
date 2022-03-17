<script>
  import CenteredGrid from "$lib/components/layout/centered-grid.svelte";
  import { homeIcon, eyeIcon } from "$lib/icons";
  import { shortenString } from "$lib/utils";

  import Label from "$lib/components/label.svelte";
  import LinkButton from "$lib/components/link-button.svelte";
  import ServiceMenu from "$lib/components/services/menu.svelte";
  import ServiceStateLabel from "$lib/components/services/state-label.svelte";

  export let services = [];
  export let onRefresh;
  export let showStructure = true;
  export let readOnly = false;
</script>

<CenteredGrid --col-bg="var(--col-gray-00)" topPadded>
  <div class="wrapper col-span-full col-start-1">
    {#each services as service}
      <div class="service flex flex-row gap-s16">
        <div class="flex-auto basis-1/3 self-center">
          <a href="/services/{service.slug}">
            <h5>{shortenString(service.name)}</h5>
          </a>
        </div>
        {#if showStructure}
          <div class="flex-none basis-s160 self-center">
            <Label
              label={`${service.structureInfo.name}`}
              smallIcon
              icon={homeIcon}
            />
          </div>
        {/if}
        <div class="flex flex-none basis-1/6 flex-col items-center">
          <Label label="Diffusion:" italic light />
          {#if service.diffusionZoneType !== "country"}
            <Label label={service.diffusionZoneTypeDisplay} />
          {/if}
          <Label label={service.diffusionZoneDetailsDisplay} bold />
        </div>
        <div class="flex-none basis-s112 items-center  self-center">
          <ServiceStateLabel {service} />
        </div>
        <div class="flex-none basis-s32 self-center">
          <Label
            label={`${new Date(service.modificationDate).toLocaleString()}`}
          />
        </div>
        <div class="flex-none basis-s32 self-center">
          <LinkButton
            to="/services/{service.slug}"
            icon={eyeIcon}
            noBackground
          />
        </div>
        <ServiceMenu {service} {readOnly} {onRefresh} />
      </div>
    {/each}
  </div>
</CenteredGrid>

<style lang="postcss">
  .wrapper {
    display: flex;
    flex-direction: column;
    padding-bottom: var(--s40);
    gap: var(--s12);
  }

  .service {
    padding: var(--s16);
    background-color: var(--col-white);
    border-radius: var(--s8);
  }
</style>
