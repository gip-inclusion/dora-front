<script lang="ts">
  import CenteredGrid from "$lib/components/display/centered-grid.svelte";
  import { PARTNERS } from "../../../lib/partners";
</script>

<CenteredGrid>
  <div>
    <h1>Nos partenaires</h1>
    <p>
      Plus de 1 000 structures ont déjà commencé à référencer leurs services sur
      DORA
    </p>

    <ul class="mt-s24 grid w-full gap-s24">
      {#each PARTNERS as { name, imgPath }}
        <li>
          <img src={`/src/lib/assets/logos/partners/${imgPath}`} alt={name} />
        </li>
      {/each}
    </ul>
  </div>
</CenteredGrid>

<style>
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
</style>
