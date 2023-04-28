<script lang="ts">
  import { externalLinkIcon } from "$lib/icons";

  export let mobileDesign = false;
  export let externalIconColor = mobileDesign
    ? "text-magenta-cta"
    : "text-gray-text";

  export let aClass = mobileDesign
    ? "inline-block h-full items-center py-s16 text-f18 font-bold text-gray-dark"
    : "inline-block h-full items-center text-gray-dark text-f14 text-gray-text p-s16";
</script>

<nav>
  <ul class={mobileDesign ? "flex flex-col" : "inline-flex"}>
    <li class="border-b border-gray-03 lg:border-none">
      <a
        target="_blank"
        title="Ouverture dans une nouvelle fenêtre"
        rel="noopener"
        href="https://aide.dora.inclusion.beta.gouv.fr/fr/category/quoi-de-neuf-es1img/"
        class={aClass}
      >
        Nouveautés
        <span
          class="inline-block h-s20 w-s20 fill-current pt-s6 pl-s4 {externalIconColor}"
          aria-hidden
        >
          {@html externalLinkIcon}
        </span>
      </a>
    </li>
    <li class="border-b border-gray-03 lg:border-none">
      <a
        target="_blank"
        title="Ouverture dans une nouvelle fenêtre"
        rel="noopener"
        href="https://inclusion.beta.gouv.fr/"
        class={aClass}
      >
        Communauté de l’inclusion
        <span
          class="inline-block h-s20 w-s20 fill-current pt-s6 pl-s4 {externalIconColor}"
          aria-hidden
        >
          {@html externalLinkIcon}
        </span>
      </a>
    </li>
  </ul>
</nav>
