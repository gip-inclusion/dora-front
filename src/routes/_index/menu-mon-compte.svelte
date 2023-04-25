<script lang="ts">
  import DropdownMenu from "$lib/components/display/dropdown-menu.svelte";
  import {
    accountCircleLineIcon,
    logoutBoxLineIcon,
    starSmileLineIcon,
  } from "$lib/icons";

  const aClass =
    "flex min-w-[200px] items-center p-s12 text-gray-text hover:bg-magenta-10 rounded";
</script>

<DropdownMenu icon={accountCircleLineIcon} label="Mon compte">
  <a href="/mon-compte" class={aClass}>
    <span class="mr-s10 inline-block h-s24 w-s24 fill-current" aria-hidden>
      {@html accountCircleLineIcon}
    </span>
    Mes informations
  </a>

  <a href="/favoris" class={aClass}>
    <span class="mr-s10 inline-block h-s24 w-s24 fill-current" aria-hidden>
      {@html starSmileLineIcon}
    </span>
    Mes favoris
  </a>

  <a href="/auth/deconnexion" class={aClass}>
    <span class="mr-s10 inline-block h-s24 w-s24 fill-current" aria-hidden>
      {@html logoutBoxLineIcon}
    </span>
    Déconnexion
  </a>
</DropdownMenu>
