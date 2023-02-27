<script lang="ts">
  import { browser } from "$app/environment";
  import CenteredGrid from "$lib/components/display/centered-grid.svelte";
  import PartnerList from "../../../lib/components/specialized/partner-list.svelte";
</script>

<CenteredGrid>
  <div>
    <h1>Nos partenaires</h1>
    <p>
      Plus de 1 000 structures ont déjà commencé à référencer leurs services sur
      DORA
    </p>

    <ul class="mt-s24 grid w-full grid-cols-partners gap-s24">
      {#if browser}
        <PartnerList />
      {/if}
    </ul>
  </div>
</CenteredGrid>
