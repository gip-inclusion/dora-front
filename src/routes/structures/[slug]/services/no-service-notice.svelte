<script lang="ts">
  import { externalLinkIcon, pageLineIcon } from "$lib/icons";
  import illuServices from "$lib/assets/illustrations/services.svg";

  import EmptyNotice from "../empty-notice.svelte";
</script>

<EmptyNotice
  textTopIcon={pageLineIcon}
  rightImage={illuServices}
  title="Vous n’avez pas encore renseigné vos services sur DORA"
>
  <div class="text-center leading-24">
    Pour rendre visibles vos services sur DORA — mais aussi sur les autres
    plateformes partenaires — vous devez saisir les informations de présentation
    et d’orientation avant de les publier. Vous pouvez à tout moment les mettre
    à jour, les remettre en brouillon ou les archiver si elles ne sont plus
    d’actualité.
  </div>

  <div class="mt-s20 text-center">
    <ul class="flex flex-col gap-s20 text-magenta-cta">
      <li class="flex justify-center">
        <a
          href=""
          class="flex items-center hover:underline"
          title="Ouverture dans une nouvelle fenêtre"
          target="_blank"
          rel="noreferrer"
        >
          Découvrez comment référencer son premier service
          <span class="ml-s8 block h-s20 w-s20 fill-current" aria-hidden>
            {@html externalLinkIcon}
          </span>
        </a>
      </li>

      <li class="flex justify-center">
        <a
          href=""
          class="flex items-center hover:underline"
          title="Ouverture dans une nouvelle fenêtre"
          target="_blank"
          rel="noreferrer"
        >
          Découvrez quelques conseils sur la présentation de votre offre de
          service
          <span class="ml-s8 block h-s20 w-s20 fill-current" aria-hidden>
            {@html externalLinkIcon}
          </span>
        </a>
      </li>

      <li class="flex justify-center">
        <a
          href="https://app.livestorm.co/dora-1"
          class="flex items-center hover:underline"
          title="Ouverture dans une nouvelle fenêtre"
          target="_blank"
          rel="noreferrer"
        >
          Participez à un webinaire
          <span class="ml-s8 block h-s20 w-s20 fill-current" aria-hidden>
            {@html externalLinkIcon}
          </span>
        </a>
      </li>

      <li class="flex justify-center">
        <a
          href="https://www.youtube.com/channel/UCadIsy9gfHgLmLkutRGC5ew/playlists"
          class="flex items-center hover:underline"
          title="Ouverture dans une nouvelle fenêtre"
          target="_blank"
          rel="noreferrer"
        >
          Consultez les tutoriels
          <span class="ml-s8 block h-s20 w-s20 fill-current" aria-hidden>
            {@html externalLinkIcon}
          </span>
        </a>
      </li>
    </ul>
  </div>
</EmptyNotice>
