<script context="module">
  import { getServiceMod } from "$lib/services";

  export async function load({ params, fetch }) {
    const service = await getServiceMod(params.slug, { kitFetch: fetch });
    if (!service) {
      return {
        status: 404,
        error: "Page Not Found",
      };
    }

    return {
      props: {
        service: service,
      },
    };
  }
</script>

<script>
  import TextClamp from "$lib/components/text-clamp.svelte";
  import WebSearch from "../../_web-search-link.svelte";
  import { capitalize } from "$lib/utils";

  export let service;
</script>

<svelte:head>
  <title>Administration | {capitalize(service.name)} | DORA</title>
</svelte:head>

<h1>{service.name}</h1>
<pre>

      # TODO: centralize all emails here
      # - all admins
      # - creator
      # - last editor
      make them easily copyable
      add link to google all emails, name of the structure


      creator: {service.creator.fullName} — {service.creator.email}
      <WebSearch searchString={service.creator.email} />

      lastEditor: {service.lastEditor.fullName} — {service.lastEditor.email}
      source: {service.source}






    <h3>name: {service.name}</h3> # TODO link, link back
        category: {service.category}
      categoryDisplay: {service.categoryDisplay}
      slug: {service.slug}

      postalCode: {service.postalCode}
      city: {service.city}
      department: {service.department}
      status: {service.status}
      modificationDate: {service.modificationDate}
      categoriesDisplay: {service.categoriesDisplay}
      shortDesc: {service.shortDesc}
      diffusionZoneType: {service.diffusionZoneType}
      diffusionZoneTypeDisplay: {service.diffusionZoneTypeDisplay}
      diffusionZoneDetailsDisplay: {service.diffusionZoneDetailsDisplay}
      modelChanged: {service.modelChanged}
      model: {service.model}
      structure: {service.structure}

  </pre>

<TextClamp text={service.fullDesc} /> # TODO: markdowntohtml
