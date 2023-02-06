<script lang="ts">
  import type { TabItem } from "$lib/types";

  export let items: TabItem[] = [];
  export let noScrollOnChange = false;
  export let itemId: string | undefined = undefined;
</script>

<ul class="flex gap-s8 overflow-x-auto pt-s16 font-bold">
  {#each items as item}
    <li>
      {#if itemId === item.id}
        <span
          class="flex items-center rounded-t-md bg-white p-s16 text-france-blue"
        >
          <span class="mr-s8 h-s24 w-s24 fill-current">
            {@html item.icon}
          </span>
          {item.name}
        </span>
      {:else}
        <a
          href={item.href}
          class="flex items-center rounded-t-md bg-magenta-dark p-s16 text-white"
          data-sveltekit-noscroll={noScrollOnChange ? "" : "off"}
        >
          <span class="mr-s8 h-s24 w-s24 fill-current">
            {@html item.icon}
          </span>
          {item.name}
        </a>
      {/if}
    </li>
  {/each}
</ul>
