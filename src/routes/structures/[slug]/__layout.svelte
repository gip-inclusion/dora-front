<script context="module">
  import { getStructure, getStructureServices } from "$lib/structures";

  export async function load({ params }) {
    const slug = params.slug;
    const structure = await getStructure(slug);
    const services = await getStructureServices(slug, {
      publishedOnly: true,
    });

    const hasServices = !!services.length;

    return {
      props: {
        structure,
        hasServices,
      },
      stuff: {
        structure,
        services,
      },
    };
  }
</script>

<script>
  import CenteredGrid from "$lib/components/layout/centered-grid.svelte";
  import Header from "./_header.svelte";

  export let structure;
  export let hasServices;
</script>

<CenteredGrid --col-bg="var(--col-magenta-brand)" topPadded>
  <div class="col-span-full">
    <Header {structure} {hasServices} />
  </div>
</CenteredGrid>

<CenteredGrid
  roundedbg
  --col-under-bg="var(--col-magenta-brand)"
  --col-content-bg="var(--col-bg)"
  topPadded
>
  <slot />
</CenteredGrid>
