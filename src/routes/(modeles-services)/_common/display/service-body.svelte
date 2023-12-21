<script lang="ts">
  import CenteredGrid from "$lib/components/display/centered-grid.svelte";
  import type { Model, Service, ServicesOptions } from "$lib/types";

  import ServiceBeneficiaries from "./service-beneficiaries.svelte";
  import ServiceMobilisation from "./service-mobilisation.svelte";
  import ServiceMobilize from "./service-mobilize.svelte";
  import SmallServiceShare from "./small-service-share.svelte";
  import ServicePresentation from "./service-presentation.svelte";
  import { browser } from "$app/environment";

  export let service: Service | Model;
  export let servicesOptions: ServicesOptions;

  export let isModel = false;
  export let isDI = false;
</script>

<CenteredGrid>
  <div class="flex flex-col justify-between gap-s48 md:flex-row">
    <div id="main-content" class="flex-auto basis-2/3">
      <div class="">
        <ServicePresentation {service} {servicesOptions} {isDI} />
      </div>
    </div>
    {#if browser}
      <div
        id="sidebar"
        class="flex flex-none flex-col gap-y-s24 md:w-[320px] lg:w-[375px]"
      >
        {#if !isModel}
          <div class="sticky top-s32">
            <div
              class="block rounded-lg border border-gray-02 bg-france-blue p-s24 px-s32 text-white print:hidden"
            >
              <ServiceMobilisation {service} {isDI} />
            </div>

            {#if !isModel}
              <div class="mt-s24 flex flex-col gap-y-s24">
                <SmallServiceShare {service} {isDI} />
              </div>
            {/if}
          </div>
        {/if}
      </div>
    {/if}
  </div>
  <div class="flex flex-col justify-between gap-s48 md:flex-row">
    <div class="flex-auto md:basis-1/2 lg:basis-2/3">
      <div>
        <hr class="my-s24" />
        <ServiceBeneficiaries {service} />
      </div>
      <hr class="my-s24" />
      <div class="mobilize">
        <ServiceMobilize {service} />
      </div>
    </div>
    <div class="md:basis-1/2 lg:basis-1/3"></div>
  </div>
</CenteredGrid>

<style lang="postcss">
</style>
