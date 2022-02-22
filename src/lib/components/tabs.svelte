<script>
  export let selected = undefined;
  export let items = [];
</script>

<ul class="flex flex-wrap gap-s8 pt-s16">
  {#each items as item}
    <li>
      <button
        class="rounded-t-md p-s16 {selected === item.id
          ? 'bg-white text-france-blue '
          : 'bg-magenta-dark text-white '}"
        on:click={() => {
          selected = item.id;
        }}>{item.name}</button
      >
    </li>
  {/each}
</ul>
