<script lang="ts">
  import CenteredGrid from "$lib/components/display/centered-grid.svelte";
  import RounderCouner from "$lib/components/specialized/services/display/rounded-corner.svelte";
  import TallyNpsPopup from "$lib/components/specialized/tally-nps-popup.svelte";
  import { TallyFormId } from "$lib/utils/nps";
  import Header from "./header.svelte";
  import { structure } from "./store";

  $: publishedServices = $structure.services.filter(
    (service) => service.status === "PUBLISHED"
  );
</script>

<CenteredGrid bgColor="bg-magenta-brand" noPadding>
  <Header structure={$structure} />
</CenteredGrid>

<div class="relative hidden w-full md:block">
  <RounderCouner bgColor="bg-magenta-brand" position="left" />
  <RounderCouner bgColor="bg-magenta-brand" position="right" />
</div>

<CenteredGrid>
  <slot />
</CenteredGrid>

{#if $structure.isMember && publishedServices.length}
  <TallyNpsPopup
    formId={TallyFormId.NPS_FORM_ID}
    timeoutSeconds={30}
    keySuffix="offreur"
    hiddenFields={{ user: "offreur" }}
  />
{/if}
