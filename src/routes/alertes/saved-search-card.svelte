<script lang="ts">
  import Form from "$lib/components/forms/form.svelte";
  import * as v from "$lib/validation/schema-utils";

  import DateLabel from "$lib/components/display/date-label.svelte";
  import SelectField from "$lib/components/forms/fields/select-field.svelte";
  import { closeCircleIcon, historyLineIcon, mailLineIcon } from "$lib/icons";
  import type { SavedSearch } from "$lib/types";
  import {
    updateSavedSearchFrequency,
    deleteSavedSearch,
    getSavedSearchQueryString,
  } from "$lib/utils/saved-search";
  import { refreshUserInfo } from "$lib/utils/auth";
  import Button from "$lib/components/display/button.svelte";

  export let search: SavedSearch;

  let requesting = false;

  async function doDeleteAlert() {
    requesting = true;

    await deleteSavedSearch(search.id);
    await refreshUserInfo();

    requesting = false;
  }

  // Mise à jour de la fréquence d'envoi des alertes
  let formData = {
    frequency: search.frequency,
  };

  const updateFrequencySchema: v.Schema = {
    frequency: {
      label: "Fréquence de notification",
      default: search.frequency,
      rules: [v.isString(), v.maxStrLength(255)],
      required: true,
    },
  };

  async function handleSubmit(validatedData) {
    await updateSavedSearchFrequency(search.id, validatedData.frequency);
    return { ok: true };
  }
  async function handleSuccess() {
    await refreshUserInfo();
  }
</script>

<div
  class="relative rounded-ml border border-gray-02 p-s32 pr-s56 shadow-sm"
  tabindex="-1"
>
  <h2 class="text-f20">
    <a href={`recherche?${getSavedSearchQueryString(search)}`}>
      Services d’insertion à proximité de {search.cityLabel}

      {#if search.categories}
        pour {search.categories.length > 1
          ? "les thématiques"
          : "la thématique"}
        {search.categoriesDisplay.join(", ")}
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

  {#if search.subcategories.length || search.kinds.length || search.fees.length}
    <p class="text-f16">
      {#if search.subcategories.length}
        Besoins sélectionnés : {search.subcategoriesDisplay.join(", ")}.
      {:else}
        Aucun besoin sélectionné.
      {/if}

      {#if search.kinds.length}
        Type de services : {search.kindsDisplay.join(", ")}.
      {/if}

      {#if search.fees.length}
        Frais à charge : {search.feesDisplay.join(", ")}.
      {/if}
    </p>
  {/if}

  <p class="text-f16">
    <span class="mr-s8 inline-block h-s16 w-s16 fill-current">
      {@html historyLineIcon}
    </span>
    Le <DateLabel date={search.creationDate} />
  </p>

  <div class="form-container">
    <Form
      bind:data={formData}
      schema={updateFrequencySchema}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
    >
      <div class="flex items-center rounded border border-gray-02 pl-s12">
        <span class="mr-s8 inline-block h-s24 w-s24 fill-current">
          {@html mailLineIcon}
        </span>

        <SelectField
          id="frequency"
          vertical
          initialValue={search.frequency || "two-weeks"}
          hideLabel={true}
          bind:value={formData.frequency}
          placeholder="Fréquence de notification"
          choices={[
            {
              value: "never",
              label: "Pas de notification",
            },
            {
              value: "two-weeks",
              label: "Une alerte toutes les 2 semaines",
            },
            {
              value: "monthly",
              label: "Une alerte tous les mois",
            },
          ]}
        />
      </div>

      {#if formData.frequency !== search.frequency}
        <Button
          name="validate"
          type="submit"
          label="Valider"
          disabled={requesting}
        />
      {/if}
    </Form>
  </div>
</div>

<style lang="postcss">
  .form-container :global(form) {
    @apply flex gap-s16;
  }
  .form-container :global(.field-wrapper) {
    @apply gap-s0;
  }
  .form-container :global(.input-container) {
    @apply w-[310px] text-gray-text;
  }
  .form-container :global(.input[type="text"]) {
    @apply border-0;
  }
</style>
