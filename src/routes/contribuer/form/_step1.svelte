<script>
  import FieldSet from "$lib/components/forms/fieldset.svelte";
  import ModelField from "$lib/components/forms/model-field.svelte";
  import { formErrors } from "$lib/validation.js";
  import serviceSchema from "$lib/schemas/service-contrib.js";
  import StructureSearch from "$lib/components/structures/search.svelte";

  export let servicesOptions, service;
  export let establishment;

  let subcategories = [];

  function handleCategoriesChange(categories) {
    subcategories = categories.length
      ? servicesOptions.subcategories.filter(({ value }) =>
          categories.some((category) => value.startsWith(category))
        )
      : [];

    service.subcategories = service.subcategories.filter((scat) =>
      categories.some((category) => scat.startsWith(category))
    );
  }

  function handleCityChange() {
    service.siret = "";
  }

  async function handleEstablishmentChange(newEstablishment) {
    service.siret = newEstablishment?.siret;
  }
</script>

<StructureSearch
  onEstablishmentChange={handleEstablishmentChange}
  onCityChange={handleCityChange}
  bind:establishment
/>

{#if service.siret}
  <FieldSet title="Présentation">
    <div slot="help">
      <p>
        Le <b>Résumé</b> présente le service en une phrase courte. Il apparait dans
        les résultats de recherche.
      </p>
      <p>
        <strong>Exemple</strong> :
        <i>
          Faciliter vos déplacements en cas de reprise d'emploi ou de formation
          (entretien d'embauche, concours public...)
        </i>
      </p>
      <p>
        Si besoin, détaillez dans la partie
        <b>Description</b>.
      </p>
    </div>

    <ModelField
      label="Nom"
      type="text"
      placeholder="Ex. Aide aux frais liés à…"
      schema={serviceSchema.name}
      name="name"
      errorMessages={$formErrors.name}
      bind:value={service.name}
    />

    <ModelField
      description="280 caractères maximum"
      placeholder="Décrivez brièvement ce service"
      type="textarea"
      label="Résumé"
      schema={serviceSchema.shortDesc}
      name="shortDesc"
      errorMessages={$formErrors.shortDesc}
      bind:value={service.shortDesc}
    />

    <ModelField
      label="Description"
      placeholder="Veuillez ajouter ici toute autre information que vous jugerez utile — concernant ce service et ses spécificités."
      type="richtext"
      vertical
      schema={serviceSchema.fullDesc}
      name="fullDesc"
      errorMessages={$formErrors.fullDesc}
      bind:value={service.fullDesc}
    />
  </FieldSet>

  <FieldSet title="Typologie">
    <div slot="help">
      <p>
        Classez les services par thématiques et besoins pour faciliter le
        référencement et la mise en avant du service.
      </p>
    </div>
    <ModelField
      type="multiselect"
      label="Thématiques"
      schema={serviceSchema.categories}
      bind:value={service.categories}
      choices={servicesOptions.categories}
      name="categories"
      errorMessages={$formErrors.categories}
      onSelectChange={handleCategoriesChange}
      placeholderMulti="Choisissez la ou les thématiques"
      sortSelect
    />

    <ModelField
      type="multiselect"
      label="Besoin(s) auxquels ce service répond"
      schema={serviceSchema.subcategories}
      name="subcategories"
      errorMessages={$formErrors.subcategories}
      bind:value={service.subcategories}
      choices={subcategories}
      placeholder="Choisissez les sous-catégories"
      placeholderMulti="Choisissez les sous-catégories"
      sortSelect
    />

    <ModelField
      type="checkboxes"
      label="Type de service"
      schema={serviceSchema.kinds}
      name="kinds"
      errorMessages={$formErrors.kinds}
      bind:value={service.kinds}
      choices={servicesOptions.kinds}
      description="Quelle est la nature de ce service."
    />
  </FieldSet>
{/if}
