<script>
  import { homeIcon, eyeIcon } from "$lib/icons";
  import { shortenString } from "$lib/utils";

  import Label from "$lib/components/label.svelte";
  import LinkButton from "$lib/components/link-button.svelte";
  import ServiceMenu from "$lib/components/services/menu.svelte";
  import ServiceStateLabel from "$lib/components/services/state-label.svelte";

  export let service;
  export let showStructure;
  export let readOnly;
  export let onRefresh;
</script>

<div class="flex flex-row gap-s16 rounded-md bg-white p-s16">
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
    <Label label={`${new Date(service.modificationDate).toLocaleString()}`} />
  </div>
  <div class="flex-none basis-s32 self-center">
    <LinkButton to="/services/{service.slug}" icon={eyeIcon} noBackground />
  </div>
  {#if !readOnly}
    <ServiceMenu {service} {onRefresh} />
  {/if}
</div>
