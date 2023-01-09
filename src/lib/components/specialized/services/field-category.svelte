<script lang="ts">
  import Button from "$lib/components/display/button.svelte";
  import Modal from "$lib/components/display/modal.svelte";
  import Notice from "$lib/components/display/notice.svelte";
  import MultiSelectField from "$lib/components/inputs/multi-select-field.svelte";
  import type { Model } from "$lib/types";
  import {
    // arraysCompare,
    orderAndReformatSubcategories,
  } from "$lib/utils/misc";

  export let subcategories = [];
  export let servicesOptions, service;
  export let isModel = false;
  export let model: Model | undefined = undefined;

  const useModel = model != null;

  let isOpen = false;

  let inclusionNumeriqueFormActiveNotice = {
    title: "Formulaire de l'inclusion numérique actif",
    description:
      "Si néanmoins vous souhaitez renseigner un atelier, une formation ou tout autre accompagnement, vous pouvez basculer vers le formulaire classique.",
    buttonLabel: "Basculer sur le formulaire classique",
  };

  let inclusionNumeriqueFormAvailableNotice = {
    title: "Formulaire de l'inclusion numérique disponible",
    description:
      "Pour compléter ce formulaire spécifique, seule la thématique numérique doit être sélectionnée.",
    buttonLabel: "Basculer sur le formulaire inclusion numérique",
  };

  $: displayInclusionNumeriqueFormNotice =
    service.categories.includes("numerique");

  $: selectedInclusionNumeriqueFormNotice = service.useInclusionNumeriqueScheme
    ? inclusionNumeriqueFormActiveNotice
    : inclusionNumeriqueFormAvailableNotice;

  let isPristine = service.subcategories.length === 0;

  let previousCategories = [];
  let toggling = undefined;

  function toggleInclusionNumeriqueForm() {
    service.useInclusionNumeriqueScheme = !service.useInclusionNumeriqueScheme;

    if (service.useInclusionNumeriqueScheme) {
      service.categories = ["numerique"];
    }

    toggling = true;
  }

  function openModal() {
    isOpen = true;
  }

  function onReject() {
    isOpen = false;
  }

  function onAccept() {
    isOpen = false;
    toggleInclusionNumeriqueForm();
  }

  function handleCategoriesChange(categories) {
    if (
      isPristine &&
      categories.length === 1 &&
      categories[0] === "numerique"
    ) {
      service.useInclusionNumeriqueScheme = true;
      isPristine = false;
    } else if (categories.length !== 1) {
      service.useInclusionNumeriqueScheme = false;
    }
    if (toggling === true) toggling = false;
    previousCategories = categories;

    subcategories = categories.length
      ? servicesOptions.subcategories.filter(({ value }) =>
          categories.some((cat) => value.startsWith(cat))
        )
      : [];

    subcategories = orderAndReformatSubcategories(
      subcategories,
      categories,
      servicesOptions
    );

    service.subcategories = service.subcategories.filter((scat) =>
      categories.some((cat) => scat.startsWith(cat))
    );

    // if (model) {
    //   showModelSubcategoriesUseButton = arraysCompare(
    //     categories,
    //     model.categories
    //   );
    // }
  }

  let showModel;

  $: showModel = !!service.model;
</script>

<Modal bind:isOpen title="Attention !" smallWidth>
  Le passage du formulaire classique vers le formulaire de l'inclusion numérique
  peut entraîner la perte de données déjà enregistrées dans ce service.
  <div class="mt-s32 flex flex-row justify-end gap-s16">
    <Button
      label="Rester sur le formulaire classique"
      secondary
      on:click={() => onReject()}
    />
    <Button
      label="Passer au formulaire de l'inclusion numérique"
      on:click={async () => onAccept()}
    />
  </div>
</Modal>

<MultiSelectField
  id="categories"
  label="Thématiques"
  bind:value={service.categories}
  choices={servicesOptions.categories}
  onChange={handleCategoriesChange}
  required
  placeholderMulti="Sélectionner"
  sort
/>

{#if displayInclusionNumeriqueFormNotice && !(isModel || useModel)}
  <Notice title={selectedInclusionNumeriqueFormNotice.title} type="info">
    <p class="text-f14">
      Les services d'inclusion numérique répondent à un formulaire spécifique
      permettant une harmonie entre tous les acteurs du secteur.
      <br />
      {selectedInclusionNumeriqueFormNotice.description}
    </p>
    <p>
      <Button
        label={selectedInclusionNumeriqueFormNotice.buttonLabel}
        small
        noBackground
        noPadding
        on:click={service.useInclusionNumeriqueScheme
          ? toggleInclusionNumeriqueForm
          : openModal}
      />
    </p>
  </Notice>
{/if}
