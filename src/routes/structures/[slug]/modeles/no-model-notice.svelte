<script lang="ts">
  import { externalLinkIcon, bookReadLineIcon } from "$lib/icons";
  import illuModeles from "$lib/assets/illustrations/modeles.svg";

  import EmptyNotice from "../empty-notice.svelte";
</script>

<EmptyNotice
  textTopIcon={bookReadLineIcon}
  rightImage={illuModeles}
  title="Vous n’avez pas encore créé votre premier modèle"
>
  <div class="text-center leading-24">
    Les modèles vous permettent de créer facilement plusieurs services
    similaires. Un exemple : vous avez des services identiques sur différents
    lieux d’accueil — la création d’un modèle va vous faciliter la saisie de ces
    vos services.
  </div>

  <div class="mt-s20 text-center leading-24">
    Vous aurez de plus la possibilité de synchroniser le modèle avec les
    services, afin de faciliter la mise à jour des informations en commun.
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
          Découvrez comment créer un modèle et l’utiliser
          <span class="ml-s8 block h-s20 w-s20 fill-current" aria-hidden>
            {@html externalLinkIcon}
          </span>
        </a>
      </li>
    </ul>
  </div>
</EmptyNotice>
