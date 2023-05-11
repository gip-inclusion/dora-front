<script lang="ts">
  import Breadcrumb from "$lib/components/display/breadcrumb.svelte";
  import CenteredGrid from "$lib/components/display/centered-grid.svelte";
  import EnsureLoggedIn from "$lib/components/hoc/ensure-logged-in.svelte";

  import { capitalize } from "$lib/utils/misc";

  export let data;

  const { service } = data;
</script>

<EnsureLoggedIn>
  <CenteredGrid bgColor="bg-france-blue">
    <div class="mb-s48 print:mb-s0">
      <Breadcrumb
        {service}
        structure={service.structureInfo}
        currentLocation="service"
      />
    </div>
    <h1 class="text-white print:text-france-blue">
      Mobiliser le service&nbsp;:
    </h1>
    <h2 class="text-white print:text-france-blue">
      {service.name}
    </h2>
    <h3 class=" text-white print:text-france-blue ">
      <div><strong>{capitalize(service.structureInfo.name)}</strong></div>
    </h3>
  </CenteredGrid>

  <CenteredGrid bgColor="bg-white" roundedColor="bg-france-blue">
    <slot />
  </CenteredGrid>

  <slot name="navbar" />
</EnsureLoggedIn>
