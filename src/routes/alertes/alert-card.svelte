<script lang="ts">
  import Form from "$lib/components/forms/form.svelte";
  import * as v from "$lib/validation/schema-utils";

  import DateLabel from "$lib/components/display/date-label.svelte";
  import SelectField from "$lib/components/forms/fields/select-field.svelte";
  import { closeCircleIcon, historyLineIcon, mailLineIcon } from "$lib/icons";
  import type { Alert } from "$lib/types";
  import {
    updateAlertFrequency,
    deleteAlert,
    getAlertQueryString,
  } from "$lib/utils/alerts";
  import { refreshUserInfo } from "$lib/utils/auth";
  import Button from "$lib/components/display/button.svelte";

  export let alert: Alert;

  let requesting = false;

  async function doDeleteAlert() {
    requesting = true;

    await deleteAlert(alert.id);
    await refreshUserInfo();

    requesting = false;
  }

  // Mise à jour de la fréquence d'envoi des alertes
  let formData = {
    frequency: alert.frequency,
  };

  const updateFrequencySchema: v.Schema = {
    frequency: {
      label: "Fréquence de notification",
      default: alert.frequency,
      rules: [v.isString(), v.maxStrLength(255)],
      required: true,
    },
  };

  async function handleSubmit(validatedData) {
    await updateAlertFrequency(alert.id, validatedData.frequency);
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
          initialValue={alert.frequency || "two-weeks"}
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

      {#if formData.frequency !== alert.frequency}
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
