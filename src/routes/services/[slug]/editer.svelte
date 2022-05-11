<script context="module">
  import { get } from "svelte/store";

  import { browser } from "$app/env";
  import { userInfo } from "$lib/auth";
  import { getServicesOptions, getService } from "$lib/services";
  import { getStructures } from "$lib/structures";

  export async function load({ params }) {
    const user = get(userInfo);
    const service = await getService(params.slug);

    let structures = [];

    if (browser && user.isStaff) {
      structures = await getStructures();
    } else if (browser && user) {
      structures = user.structures;
    }

    return {
      props: {
        service,
        servicesOptions: await getServicesOptions(),
        structures,
      },
    };
  }
</script>

<script>
  import EnsureLoggedIn from "$lib/components/ensure-logged-in.svelte";
  import ServiceFormWrapper from "../_form/_service-form-wrapper.svelte";

  import CenteredGrid from "$lib/components/layout/centered-grid.svelte";
  import Card from "$lib/components/structures/card.svelte";

  export let service, servicesOptions, structures;
</script>

<svelte:head>
  <title>Éditer | {service?.name} | {service?.structureInfo.name} | DORA</title>
</svelte:head>

<EnsureLoggedIn>
  {#if service}
    <CenteredGrid>
      <div class="col-span-full flex flex-wrap justify-between pt-s48 pb-s24">
        <div class="w-2/3"><h1>Modification du service</h1></div>
        <div class="w-1/3"><Card structure={service.structureInfo} /></div>
      </div>
    </CenteredGrid>

    <ServiceFormWrapper bind:service {servicesOptions} {structures} />
  {/if}
</EnsureLoggedIn>
