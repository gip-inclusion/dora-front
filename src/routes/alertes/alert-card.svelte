<script lang="ts">
  import DateLabel from "$lib/components/display/date-label.svelte";
  import { closeCircleIcon, historyLineIcon, mailLineIcon } from "$lib/icons";
  import type { Alert } from "$lib/types";
  import { deleteAlert, getAlertQueryString } from "$lib/utils/alerts";
  import { refreshUserInfo } from "$lib/utils/auth";

  export let alert: Alert;

  let requesting = false;

  async function doDeleteAlert() {
    requesting = true;

    await deleteAlert(alert.id);
    await refreshUserInfo();

    requesting = false;
  }
</script>

<div
  class="relative rounded-ml border border-gray-02 p-s32 shadow-sm"
  tabindex="-1"
>
  <h2 class="text-f20">
    <a href={`recherche?${getAlertQueryString(alert)}`}>
      Services d’insertion à proximité de {alert.cityLabel}

      {#if alert.categories}
        pour {alert.categories.length > 1 ? "les thématiques" : "la thématique"}
        {alert.categoriesDisplay.join(", ")}
      {/if}
    </a>
  </h2>

  <button
    class="absolute top-s40 right-s32 text-magenta-cta"
    disabled={requesting}
    on:click={doDeleteAlert}
  >
    <span
      class="mx-auto mb-s12 block h-s24 w-s24 fill-current"
      aria-label="Supprimer cette alerte"
    >
      {@html closeCircleIcon}
    </span>
  </button>

  {#if alert.subcategories.length || alert.kinds.length || alert.fees.length}
    <p class="text-f16">
      {#if alert.subcategories.length}
        Besoins sélectionnés : {alert.subcategoriesDisplay.join(", ")}.
      {:else}
        Aucun besoin sélectionné.
      {/if}

      {#if alert.kinds.length}
        Type de services : {alert.kindsDisplay.join(", ")}.
      {/if}

      {#if alert.fees.length}
        Frais à charge : {alert.feesDisplay.join(", ")}.
      {/if}
    </p>
  {/if}

  <p class="text-f16">
    <span class="mr-s8 inline-block h-s16 w-s16 fill-current">
      {@html historyLineIcon}
    </span>
    Le <DateLabel date={alert.creationDate} />
  </p>

  <p class="text-f16">
    <span class="mr-s8 inline-block h-s16 w-s16 fill-current">
      {@html mailLineIcon}
    </span>
    {#if alert.frequency === "never"}
      Pas de notification
    {:else if alert.frequency === "two-weeks"}
      Une alerte toutes les 2 semaines
    {:else if alert.frequency === "monthly"}
      Une alerte tous les mois
    {/if}
  </p>
</div>
