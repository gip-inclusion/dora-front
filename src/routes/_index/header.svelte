<script lang="ts">
  import { browser } from "$app/environment";
  import LogoDORA from "$lib/assets/logos/logo-dora.svg";
  import LogoRepublique from "$lib/assets/logos/logo-republique-francaise.svg";
  import CenteredGrid from "$lib/components/display/centered-grid.svelte";
  import HeaderActions from "./menu.svelte";

  import { ENVIRONMENT, FLAG_STRIKING } from "$lib/env";
  import { externalLinkIcon } from "$lib/icons";
</script>

<header class:dev-banner={ENVIRONMENT !== "production"} role="banner">
  <CenteredGrid noPadding extraClass="border-b border-gray-01">
    <div class="flex items-center justify-between">
      <div class="flex flex-row items-center py-s12">
        <div>
          <img
            class="mr-s40 inline-block"
            src={LogoRepublique}
            alt="République française - Liberté, Égalité, Fraternité"
            width="114"
            height="92"
          />
        </div>
        <a href="/" class="flex items-center">
          <img
            class="mr-s16 inline-block"
            src={LogoDORA}
            alt="Dora - Découvrir, Orienter, Renseigner, Accompagner"
            width="60"
            height="55"
          />
          <div>
            <div class="text-f20 font-bold text-gray-dark">DORA</div>
            <div class="text-f14 text-gray-text">Plateforme de l’inclusion</div>
          </div>
        </a>
      </div>

      <div>
        {#if browser}
          <HeaderActions />
        {/if}
      </div>
    </div>
  </CenteredGrid>

  <CenteredGrid noPadding extraClass="border-b border-gray-01">
    <nav role="navigation">
      <ul class="inline-flex">
        <li>
          <a
            target="_blank"
            title="Ouverture dans une nouvelle fenêtre"
            rel="noopener"
            href="https://aide.dora.inclusion.beta.gouv.fr/fr/category/quoi-de-neuf-es1img/"
            class="inline-block h-full items-center p-s16 text-f14 text-gray-text hover:bg-gray-00"
          >
            Nouveautés
            <span
              class="inline-block h-s20 w-s20 fill-current pt-s6 pl-s4"
              aria-hidden
            >
              {@html externalLinkIcon}
            </span>
          </a>
        </li>
        <li>
          <a
            target="_blank"
            title="Ouverture dans une nouvelle fenêtre"
            rel="noopener"
            href="https://inclusion.beta.gouv.fr/"
            class="inline-block h-full items-center p-s16 text-f14 text-gray-text hover:bg-gray-00"
          >
            Comunauté de l’inclusion
            <span
              class="inline-block h-s20 w-s20 fill-current pt-s6 pl-s4"
              aria-hidden
            >
              {@html externalLinkIcon}
            </span>
          </a>
        </li>
      </ul>
    </nav>
  </CenteredGrid>

  {#if FLAG_STRIKING}
    <div
      class="absolute top-s80 left-s0 right-s0 mx-auto hidden max-w-2xl border-spacing-s0 rounded border border-gray-03 bg-white bg-opacity-90 p-s8 text-center font-bold lg:block"
    >
      Une partie de l'équipe est en grève pour marquer son opposition à la
      réforme des retraites. Le site reste fonctionnel, mais le support n'est
      pas assuré aujourd'hui.
    </div>
  {/if}
</header>

<style lang="postcss">
  .dev-banner {
    border-top: 8px solid orange;
  }
</style>
