<script>
  import { getApiURL } from "$lib/utils/api.js";
  import Field from "$lib/components/forms/field.svelte";
  import Button from "../button.svelte";
  import Input from "../forms/input.svelte";

  export let onEstablishmentChange = null;

  let value;
  let erreur = false;
  let searching = false;

  async function searchSirene() {
    erreur = false;
    searching = true;
    if (onEstablishmentChange) onEstablishmentChange({});

    const sireneAPIUrl = `${getApiURL()}/search-siret/?siret=${encodeURIComponent(
      value.trim()
    )}`;

    const response = await fetch(sireneAPIUrl, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json; version=1.0",
      },
    });

    searching = false;

    if (response.status === 200) {
      const jsonResponse = await response.json();
      if (onEstablishmentChange) onEstablishmentChange(jsonResponse);
    } else {
      erreur = true;
    }
  }
</script>

<Field type="custom" label="Numéro SIRET" required vertical>
  <div slot="custom-input" class="flex gap-s12">
    <div class="flex grow">
      <Input
        type="text"
        name="siret-select"
        placeholder="1234567891234"
        bind:value
      />
    </div>
    {#if searching}
      <p class="py-s12 px-s8 lg:px-s20">Chargement…</p>
    {:else}
      <Button label="Rechercher" disabled={!value} on:click={searchSirene} />
    {/if}
  </div>
</Field>
{#if erreur}
  <p class="text-f14">Aucune structure trouvée</p>
{/if}
