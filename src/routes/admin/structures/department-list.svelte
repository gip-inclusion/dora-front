<script lang="ts">
  import DropdownMenu from "$lib/components/display/dropdown-menu.svelte";

  // on pourrait affiner les types, mais ça alourdirait de beaucoup
  export let departments;
  export let department;
  export let onRefresh;
</script>

<DropdownMenu let:closeDropdown>
  <span slot="label">
    {department.name} ({department.code})
  </span>
  <ul class="max-h-[300px] overflow-y-auto p-s2">
    {#each departments as dpt}
      {#if department.code !== dpt.value.code}
        <li>
          <a
            on:click={() => {
              onRefresh(dpt.value);
              closeDropdown();
            }}
            href="#{dpt.value.code}"
            class="flex items-center justify-between whitespace-nowrap p-s12 text-gray-text hover:bg-magenta-10"
            >{dpt.value.name} ({dpt.value.code})</a
          >
        </li>
      {/if}
    {/each}
  </ul>
</DropdownMenu>
