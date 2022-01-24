<script context="module">
  export const ssr = false;

  import { getServicesOptions } from "$lib/services";
  import { getStructures } from "$lib/structures";

  export async function load() {
    return {
      props: {
        servicesOptions: await getServicesOptions(),
        structures: await getStructures(),
      },
    };
  }
</script>

<script>
  import { getNewService } from "./form/_stores.js";
  import ServiceFormWrapper from "./form/_service-form-wrapper.svelte";
  import Step1 from "./form/_step1.svelte";
  import Step2 from "./form/_step2.svelte";

  export let servicesOptions, structures;

  let service = getNewService();
  if (structures.length === 1) {
    service.structure = structures[0].slug;
  }
  let currentStep = 1;

  const steps = new Map([
    [1, Step1],
    [2, Step2],
  ]);

  $: currentStepComponent = steps.get(currentStep);
</script>

<svelte:head>
  <title>Contribuer | DORA</title>
</svelte:head>

<ServiceFormWrapper
  bind:currentStep
  bind:service
  bind:servicesOptions
  title="Référencer un service"
>
  <svelte:component
    this={currentStepComponent}
    bind:service
    {servicesOptions}
    {structures}
  />
</ServiceFormWrapper>
