<script lang="ts">
  import { externalLinkIcon, teamLineIcon } from "$lib/icons";
  import illuMember from "$lib/assets/illustrations/collaborateurs.svg";

  import EmptyNotice from "../empty-notice.svelte";
</script>

<EmptyNotice
  textTopIcon={teamLineIcon}
  rightImage={illuMember}
  title="Vous n’avez pas encore invité vos collaborateurs"
>
  <div class="text-center leading-24">
    Invitez vos collègues à rejoindre votre structure sur DORA et partagez-vous
    les différentes tâches de gestion. En tant qu’admin de la structure, vous
    pouvez choisir le niveau de droits que vous accordez aux différents
    collègues, accepter les demandes d’adhésion ou bien révoquer l'accès à un
    compte.
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
          Découvrez comment gérer les collaborateurs
          <span class="ml-s8 block h-s20 w-s20 fill-current" aria-hidden>
            {@html externalLinkIcon}
          </span>
        </a>
      </li>
    </ul>
  </div>
</EmptyNotice>
