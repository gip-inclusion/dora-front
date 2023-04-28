<script lang="ts">
  import { page } from "$app/stores";
  import DropdownMenu from "$lib/components/display/dropdown-menu.svelte";

  import type { ShortStructure } from "$lib/types";
  import {
    accountCircleLineIcon,
    checkIcon,
    homeSmile2Icon,
    logoutBoxLineIcon,
    searchIcon,
    starSmileLineIcon,
  } from "$lib/icons";
  import LinkButton from "$lib/components/display/link-button.svelte";

  export let structures: ShortStructure[] = [];
  let filterText = "";
  $: structuresToDisplay = filterText
    ? structures.filter((struct) =>
        struct.name
          .toLocaleLowerCase()
          .startsWith(filterText.toLocaleLowerCase())
      )
    : structures;

  const aClass =
    "flex w-full lg:min-w-[200px] items-center p-s12 text-gray-text hover:bg-magenta-10 rounded";
</script>

<div class="mb-s16 lg:mb-s0 lg:mr-s10">
  {#if structures.length === 0}
    <LinkButton>Adhérer à une structure ??</LinkButton>
  {:else}
    <div class="flex items-center">
      <div
        class="flex w-full items-center rounded rounded-r-none border-y border-l border-gray-03 py-s12 px-s16 lg:w-auto"
      >
        <span
          class="mr-s8 inline-block h-s24 w-s24 fill-current text-magenta-cta"
        >
          {@html homeSmile2Icon}
        </span>
        <a
          class="block text-gray-text"
          href={`/structures/${structures[0].slug}`}
        >
          {structures[0].name}
        </a>
      </div>

      <DropdownMenu
        label="Mes structures"
        hideLabel
        hasLeftSide
        minWidth="300px"
      >
        {#if structures.length > 10}
          <div class="relative mt-s10 w-full">
            <label for="structure-filter" class="sr-only">Rechercher</label>
            <input
              id="structure-filter"
              type="text"
              placeholder="Rechercher"
              bind:value={filterText}
              class="absolute right-s0 left-s0 border border-gray-03 p-s10"
            />
            <span
              class="absolute right-s8 top-[11px] z-40 inline-block h-s24 w-s24 fill-current text-gray-03"
            >
              {@html searchIcon}
            </span>
          </div>
        {/if}
        <div class="w-full" class:mt-s56={structures.length > 10}>
          <ul class="max-h-[300px] overflow-y-auto">
            {#each structuresToDisplay as structure}
              {@const selected = structures[0].slug === structure.slug}
              <li>
                <a
                  href={`/structures/${structure.slug}`}
                  class="flex items-center justify-between whitespace-nowrap p-s12 text-gray-text hover:bg-magenta-10"
                  class:text-magenta-cta={selected}
                >
                  {structure.name}

                  {#if selected}
                    <span
                      class="mr-s8 inline-block h-s24 w-s24 fill-current text-magenta-cta"
                    >
                      {@html checkIcon}
                    </span>
                  {/if}
                </a>
              </li>
            {/each}
          </ul>
        </div>
      </DropdownMenu>
    </div>
  {/if}
</div>

<DropdownMenu icon={accountCircleLineIcon} label="Mon compte">
  <a href="/mon-compte" class={aClass}>
    <span
      class="mr-s10 inline-block h-s24 w-s24 fill-current"
      class:text-magenta-cta={$page.url.pathname === "/mon-compte"}
      aria-hidden
    >
      {@html accountCircleLineIcon}
    </span>
    Mes informations
  </a>

  <a href="/favoris" class={aClass}>
    <span
      class="mr-s10 inline-block h-s24 w-s24 fill-current"
      class:text-magenta-cta={$page.url.pathname === "/favoris"}
      aria-hidden
    >
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
