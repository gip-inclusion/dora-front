<script context="module">
  export async function load({ stuff }) {
    return {
      props: {
        structure: stuff.structure,
        services: stuff.services,
        antennes: stuff.antennes,
      },
    };
  }
</script>

<script>
  import { userInfo } from "$lib/auth";

  import Informations from "./_informations.svelte";
  import ServicesList from "./services/_list.svelte";
  import AntennesList from "./antennes/_list.svelte";

  export let structure, services, antennes;
</script>

<svelte:head>
  <title>{structure.name} | DORA</title>
  <meta name="description" content={structure.shortDesc} />
</svelte:head>

<Informations {structure} />

{#if !!services.length || structure.isMember || $userInfo?.isStaff}
  <div class="col-span-full mb-s24 border-b border-b-gray-03" />
  <ServicesList {structure} services={services.slice(0, 3)} hasButton />
{/if}

{#if !!antennes.length || structure.canWrite}
  <div class="col-span-full mb-s24 border-b border-b-gray-03" />
  <AntennesList {structure} antennes={antennes.slice(0, 3)} hasButton />
{/if}
