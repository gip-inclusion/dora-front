<script lang="ts">
  import type { Structure, Service } from "$lib/types";
  import { CANONICAL_URL } from "$lib/env";

  type BreadcrumbLocation = "home" | "structure" | "service";

  // https://www.w3.org/WAI/ARIA/apg/example-index/breadcrumb/index.html
  export let structureInfo: Structure;
  export let serviceInfo: Service;
  export let currentLocation: BreadcrumbLocation;
</script>

<nav aria-label="Breadcrumb">
  <ol class="text-f14">
    <li class="inline">
      <a
        href={CANONICAL_URL}
        aria-current={currentLocation === "home" ? "page" : null}
        class:current={currentLocation === "home"}
        title="Retour à l'accueil du site">Accueil</a
      >
    </li>
    <li class="inline">
      <a
        href="/structures/{structureInfo.slug}"
        class:current={currentLocation === "structure"}
        aria-current={currentLocation === "structure" ? "page" : null}
        ><span class="hidden lg:inline">Structure&nbsp;·&nbsp;</span
        >{structureInfo.name}</a
      >
    </li>
    {#if serviceInfo}
      <li class="inline">
        <a
          href="/services/{serviceInfo.slug}"
          class:current={currentLocation === "service"}
          aria-current={currentLocation === "service" ? "page" : null}
          ><span class="hidden lg:inline">Service&nbsp;·&nbsp;</span
          >{serviceInfo.name}</a
        >
      </li>
    {/if}
  </ol>
</nav>

<style lang="postcss">
  a {
    @apply text-magenta-40;
  }

  .current {
    @apply font-bold text-white;
  }

  nav li + li::before {
    @apply ml-s8 mr-s8 inline text-magenta-40;
    content: "/";
  }
</style>
