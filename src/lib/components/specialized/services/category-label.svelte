<script lang="ts">
  import type { ServicesOptions } from "$lib/types";
  import { getCategoryIcon, getCategoryLabel } from "$lib/utils/service";

  export let categorySlug: string;
  export let servicesOptions: ServicesOptions;
</script>

<div
  class="inline-flex flex-wrap items-center rounded-md bg-service-blue-light px-s16 py-s8 text-f14 text-magenta-dark"
>
  <div class="mr-s4 inline-flex items-center self-start">
    <span class="mr-s8 inline-block h-s24 w-s24 fill-current text-france-blue">
      {@html getCategoryIcon("creation-activite")}
    </span>

    <strong>
      {getCategoryLabel(categorySlug, servicesOptions).toUpperCase()}
    </strong>
  </div>
</div>
