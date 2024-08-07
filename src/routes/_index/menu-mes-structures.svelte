<script lang="ts">
  import DropdownMenu from "$lib/components/display/dropdown-menu.svelte";

  import type { ShortStructure } from "$lib/types";
  import {
    addCircleLineIcon,
    checkIcon,
    homeSmile2Icon,
    searchIcon,
  } from "$lib/icons";

  export let structures: ShortStructure[] = [];
  export let lastVisitedStructure: ShortStructure | undefined = undefined;
  export let mobileDesign = false;

  let filterText = "";
  $: structuresToDisplay = filterText
    ? structures.filter((struct) =>
        struct.name.toLocaleLowerCase().includes(filterText.toLocaleLowerCase())
      )
    : structures;
</script>

<div class="mb-s16 lg:mb-s0 lg:mr-s10">
  {#if structures.length !== 0}
    <div class="flex w-full items-center lg:w-auto">
      <DropdownMenu label="Mes structures" hideLabel {mobileDesign}>
        <div slot="label" class="flex w-full items-center">
          <span
            class="mr-s8 inline-block h-s24 w-s24 fill-current text-magenta-cta"
          >
            {@html homeSmile2Icon}
          </span>
          {#if lastVisitedStructure}
            <a
              class="block w-[150px] overflow-hidden text-ellipsis whitespace-nowrap text-gray-text"
              on:click={(evt) => evt.stopPropagation()}
              href={`/structures/${lastVisitedStructure.slug}`}
            >
              {lastVisitedStructure.name}
            </a>
          {:else}
            <span class="text-gray-text">Vos structures</span>
          {/if}
        </div>

        {#if structures.length > 10}
          <div class="relative mt-s10 w-full">
            <label for="structure-filter" class="sr-only">Rechercher</label>
            <input
              id="structure-filter"
              type="text"
              placeholder="Rechercher"
              bind:value={filterText}
              class="absolute left-s0 right-s0 border border-gray-03 p-s10"
            />
            <span
              class="absolute right-s8 top-[11px] z-40 inline-block h-s24 w-s24 fill-current text-gray-03"
            >
              {@html searchIcon}
            </span>
          </div>
        {/if}
        <div class:mt-s56={structures.length > 10}>
          <ul class="max-h-[300px] overflow-y-auto p-s2">
            {#each structuresToDisplay as structure}
              {@const selected = structure.slug === lastVisitedStructure?.slug}
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

        <div slot="bottom">
          <a
            class="flex whitespace-nowrap text-gray-text"
            href="/auth/rattachement"
          >
            <span class="mr-s10 h-s24 w-s24 fill-current">
              {@html addCircleLineIcon}
            </span>
            <span>Adhérer à une autre structure </span>
          </a>
        </div>
      </DropdownMenu>
    </div>
  {/if}
</div>
