<script>
  import FieldSet from "$lib/components/forms/fieldset.svelte";
  import FieldHelp from "$lib/components/forms/field-help.svelte";
  import ModelField from "$lib/components/forms/model-field.svelte";
  import { formErrors } from "$lib/validation.js";
  import serviceSchema from "$lib/schemas/service.js";
  import AddableMultiselect from "$lib/components/forms/addable-multiselect.svelte";
  import { moveToTheEnd } from "$lib/utils";
  import Field from "$lib/components/forms/field.svelte";
  import Uploader from "$lib/components/uploader.svelte";
  import { getStructure } from "$lib/structures";
  import { onMount } from "svelte";
  import CitySearch from "$lib/components/forms/city-search.svelte";
  import AddressSearch from "$lib/components/forms/street-search.svelte";
  import AdminDivisionSearch from "$lib/components/forms/admin-division-search.svelte";
  import Fieldset from "$lib/components/forms/fieldset.svelte";

  export let servicesOptions, service, structures;
  let subcategories = [];

  function handleCategoryChange(categories) {
    subcategories = categories.length
      ? servicesOptions.subcategories.filter(({ value }) =>
          categories.some((cat) => value.startsWith(cat))
        )
      : [];

    service.subcategories = service.subcategories.filter((scat) =>
      categories.some((cat) => scat.startsWith(cat))
    );
  }

  function cleanOptions(field, structure) {
    const flatChoices = servicesOptions[field]
      .filter((c) => c.structure == null || c.structure === structure)
      .map((c) => c.value);
    service[field] = service[field].filter((value) =>
      flatChoices.includes(value)
    );
  }

  function handleStructureChange(structure) {
    cleanOptions("accessConditions", structure);
    cleanOptions("concernedPublic", structure);
    cleanOptions("requirements", structure);
    cleanOptions("credentials", structure);
  }

  let showStructures = structures.length > 1;
  if (service.structure) {
    // Il s'agit d'une édition de service existant, ou alors la structure
    // est renseignée dans l'URL: ne pas montrer le selecteur
    showStructures = false;
  }

  export let adminDivisionChoices = [];

  function handleCityChange(city) {
    service.city = city?.name;
    service.cityCode = city?.code;
  }

  function handleDiffusionZoneTypeChange(type) {
    if (type !== service.diffusionZoneType) {
      service.diffusionZoneType = type;
      service.diffusionZoneDetails = "";
      service.diffusionZoneDetailsDisplay = "";
      adminDivisionChoices = [];
    }
  }
  function handlediffusionZoneDetailsChange(details) {
    service.diffusionZoneDetails = details;
  }

  function handleAddressChange(address) {
    const props = address?.properties;
    const coords = address?.geometry.coordinates;
    const lat = coords?.[1];
    const long = coords?.[0];
    service.address1 = props?.name;
    service.postalCode = props?.postcode;
    service.longitude = long;
    service.latitude = lat;
  }

  let promise;

  if (!service.city && !service.address1 && !service.postalCode) {
    promise = getStructure(service.structure);
    promise.then((structure) => {
      service.city = structure.city;
      service.address1 = structure.address1;
      service.address2 = structure.address2;
      service.postalCode = structure.postalCode;
      service.cityCode = structure.cityCode;
      service.latitude = structure.latitude;
      service.longitude = structure.longitude;
    });
  } else {
    promise = Promise.resolve();
  }
  let isTimeLimited;

  onMount(() => {
    isTimeLimited = !!service.suspensionDate;
  });

  function handleCheckTimeLimited(evt) {
    const checked = evt.target.checked;
    if (!checked) {
      service.suspensionDate = null;
    }
  }
</script>

{#if showStructures}
  <FieldSet title="">
    <ModelField
      type="select"
      schema={serviceSchema.structure}
      label="Structure"
      choices={structures.map((s) => ({ value: s.slug, label: s.name }))}
      name="structure"
      errorMessages={$formErrors.structure}
      bind:value={service.structure}
      onSelectChange={handleStructureChange}
      sortSelect
      placeholder="Sélectionner…"
    />
  </FieldSet>
{/if}

<FieldSet title="Présentation">
  <ModelField
    label="Nom"
    type="text"
    placeholder="Compléter…"
    schema={serviceSchema.name}
    name="name"
    errorMessages={$formErrors.name}
    bind:value={service.name}
  />
  <ModelField
    description="280 caractères maximum"
    placeholder="Compléter…"
    type="textarea"
    label="Résumé"
    schema={serviceSchema.shortDesc}
    name="shortDesc"
    errorMessages={$formErrors.shortDesc}
    bind:value={service.shortDesc}
  >
    <FieldHelp slot="helptext" title="Résumé">
      <p>
        Le résumé expose en une phrase les besoins auxquels le service répond.
        Il apparait dans les résultats de recherche. Si besoin, détaillez dans
        la partie Description.
      </p>
      <p>
        <strong>Exemple</strong> : Faciliter vos déplacements en cas de reprise d'emploi
        ou de formation (entretien d'embauche, concours public...)
      </p>
    </FieldHelp>
  </ModelField>
  <ModelField
    label="Description"
    placeholder="Veuillez ajouter ici toute autre information que vous jugerez utile — concernant votre service et ses spécificités."
    type="richtext"
    vertical
    schema={serviceSchema.fullDesc}
    name="fullDesc"
    errorMessages={$formErrors.fullDesc}
    bind:value={service.fullDesc}
  />
</FieldSet>

<FieldSet title="Typologie">
  <ModelField
    type="multiselect"
    label="Thématiques"
    schema={serviceSchema.categories}
    bind:value={service.categories}
    choices={servicesOptions.categories}
    name="categories"
    errorMessages={$formErrors.categories}
    onSelectChange={handleCategoryChange}
    placeholderMulti="Sélectionner…"
    sortSelect
  />
  <ModelField
    type="multiselect"
    label="Besoin(s)"
    schema={serviceSchema.subcategories}
    name="subcategories"
    errorMessages={$formErrors.subcategories}
    bind:value={service.subcategories}
    choices={subcategories}
    placeholder="Sélectionner…"
    placeholderMulti="Sélectionner…"
    sortSelect
  >
    <FieldHelp slot="helptext" title="Catégorisation">
      Pour faciliter le référencement et la mise en avant de votre service, il
      est nécessaire de classer les services par thématiques et besoins auxquels
      ils répondent.
    </FieldHelp>
  </ModelField>

  <ModelField
    type="checkboxes"
    label="Type"
    schema={serviceSchema.kinds}
    name="kinds"
    errorMessages={$formErrors.kinds}
    bind:value={service.kinds}
    choices={servicesOptions.kinds}
  />

  <ModelField
    type="toggle"
    label="Service cumulable"
    schema={serviceSchema.isCumulative}
    name="isCumulative"
    errorMessages={$formErrors.isCumulative}
    bind:value={service.isCumulative}
    description="Votre service est cumulable avec d’autres services ? "
  />
</FieldSet>

<FieldSet title="Diffusion">
  <ModelField
    type="select"
    label="Territoire"
    schema={serviceSchema.diffusionZoneType}
    choices={servicesOptions.diffusionZoneType}
    name="diffusionZoneType"
    errorMessages={$formErrors.diffusionZoneType}
    onSelectChange={handleDiffusionZoneTypeChange}
    initialValue={service.diffusionZoneTypeDisplay}
  >
    <FieldHelp slot="helptext" title="Zone de difusion">
      <p>
        Avec cette option, vous pouvez régler le niveau de visibilité de votre
        service au niveau du territoire, et ainsi obtenir des candidatures
        qualifiées.
      </p>
    </FieldHelp>
  </ModelField>

  <ModelField
    type="custom"
    name="diffusionZoneDetails"
    label="Nom"
    description="Commencez à saisir le nom et choisissez dans la liste."
    errorMessages={$formErrors.diffusionZoneDetails}
    schema={serviceSchema.diffusionZoneDetails}
    visible={service.diffusionZoneType !== "country"}
  >
    <AdminDivisionSearch
      slot="custom-input"
      name="diffusionZoneDetails"
      searchType={service.diffusionZoneType}
      handleChange={handlediffusionZoneDetailsChange}
      initialValue={service.diffusionZoneDetailsDisplay}
      bind:choices={adminDivisionChoices}
    />
  </ModelField>
</FieldSet>

<FieldSet title="Publics">
  <AddableMultiselect
    bind:values={service.concernedPublic}
    structure={service.structure}
    choices={servicesOptions.concernedPublic}
    errorMessages={$formErrors.concernedPublic}
    name="concernedPublic"
    label="Profils"
    placeholder="Tous publics"
    placeholderMulti="Sélectionner…"
    schema={serviceSchema.concernedPublic}
    sortSelect
    description="Plusieurs choix possibles."
  />

  <AddableMultiselect
    bind:values={service.accessConditions}
    structure={service.structure}
    choices={servicesOptions.accessConditions}
    errorMessages={$formErrors.accessConditions}
    name="accessConditions"
    label="Critères"
    placeholder="Aucun"
    placeholderMulti="Choisir un autre critères d’admission"
    schema={serviceSchema.accessConditions}
    sortSelect
    description="Plusieurs choix possibles."
  >
    <FieldHelp slot="helptext" title="Critères">
      <p>
        <strong>Critères d’éligibilité</strong><br />
        Définissez le type de publics auxquels votre service s’adresse. Si parmi
        les choix proposés pour les « critères d’accès », pour les « publics concernés »
        ou pour « les prérequis ou compétences » vous pouvez ajouter vos propres
        critères grâce au bouton « Ajouter une autre option ». Si votre service est
        ouvert à tout le monde, sans critères ou prérequis, laissez les champs avec
        les options par défaut.
      </p>
    </FieldHelp>
  </AddableMultiselect>

  <ModelField
    label="Uniquement QPV + ZRR ?"
    type="toggle"
    name="qpvOrZrr"
    schema={serviceSchema.qpvOrZrr}
    errorMessages={$formErrors.qpvOrZrr}
    bind:value={service.qpvOrZrr}
  >
    <FieldHelp slot="helptext" title="Zone de difusion">
      <p>
        <strong>QPV et ZRR</strong><br />
        Votre offre s’adresse uniquement aux bénéficiaires résidants dans des Quartiers
        Prioritaires de la politique de la Ville ou des Zones de Revitalisation Rurale ?
        Si oui, activez cette option.
      </p>
    </FieldHelp></ModelField
  >

  <AddableMultiselect
    bind:values={service.requirements}
    structure={service.structure}
    choices={servicesOptions.requirements}
    errorMessages={$formErrors.requirements}
    name="requirements"
    label="Pré-requis ou compétences"
    placeholder="Aucun"
    placeholderMulti="Choisir un autre pré-requis"
    schema={serviceSchema.requirements}
    sortSelect
    description="Plusieurs choix possibles."
  />
</FieldSet>

<FieldSet title="Modalités">
  <ModelField
    label="Pour l'accompagnateur"
    type="checkboxes"
    choices={moveToTheEnd(
      servicesOptions.coachOrientationModes,
      "value",
      "autre"
    )}
    schema={serviceSchema.coachOrientationModes}
    name="coachOrientationModes"
    errorMessages={$formErrors.coachOrientationModes}
    bind:value={service.coachOrientationModes}
  />

  <ModelField
    visible={service.coachOrientationModes.includes("autre")}
    hideLabel
    placeholder="Compléter…"
    type="text"
    schema={serviceSchema.coachOrientationModesOther}
    name="coachOrientationModesOther"
    errorMessages={$formErrors.coachOrientationModesOther}
    bind:value={service.coachOrientationModesOther}
  />

  <ModelField
    label="Pour le bénéficiaire"
    type="checkboxes"
    choices={moveToTheEnd(
      servicesOptions.beneficiariesAccessModes,
      "value",
      "autre"
    )}
    schema={serviceSchema.beneficiariesAccessModes}
    name="beneficiariesAccessModes"
    errorMessages={$formErrors.beneficiariesAccessModes}
    bind:value={service.beneficiariesAccessModes}
  >
    <FieldHelp slot="helptext" title="Comment mobiliser ce service">
      Quelles sont les modalités à suivre pour pouvoir mobiliser votre service ?
    </FieldHelp></ModelField
  >
  <ModelField
    visible={service.beneficiariesAccessModes.includes("autre")}
    hideLabel
    placeholder="Merci de préciser la modalité"
    type="text"
    schema={serviceSchema.beneficiariesAccessModesOther}
    name="beneficiariesAccessModesOther"
    errorMessages={$formErrors.beneficiariesAccessModesOther}
    bind:value={service.beneficiariesAccessModesOther}
  />

  <ModelField
    type="toggle"
    label="Frais à charge"
    schema={serviceSchema.hasFee}
    name="hasFee"
    errorMessages={$formErrors.hasFee}
    bind:value={service.hasFee}
  />

  <ModelField
    type="textarea"
    hideLabel
    placeholder="Merci de détailler ici les frais à charge du bénéficiaire : adhésion, frais de location, frais de garde, etc., et les montants."
    visible={!!service.hasFee}
    schema={serviceSchema.feeDetails}
    name="feeDetails"
    errorMessages={$formErrors.feeDetails}
    bind:value={service.feeDetails}
  />
</FieldSet>

<Fieldset title="Documents">
  <Field
    type="custom"
    label="Documents à compléter"
    errorMessages={$formErrors.forms}
  >
    <FieldHelp slot="helptext" title="Documents requis">
      Listez les justificatifs à fournir et mettez à disposition les documents à
      compléter afin de recevoir des candidatures complètes, avec moins
      d’aller-retour. Utilisez la section liens pratiques pour rediriger vers
      plus d’informations concernant la mobilisation de votre service
      (formulaire, fiche de prescription, simulateurs, etc.)..
    </FieldHelp>
    <Uploader
      slot="custom-input"
      structureSlug={service.structure}
      name="forms"
      on:blur
      bind:fileKeys={service.forms}
    />
  </Field>

  <AddableMultiselect
    bind:values={service.credentials}
    structure={service.structure}
    choices={servicesOptions.credentials}
    errorMessages={$formErrors.credentials}
    name="credentials"
    label="Justificatifs à fournir"
    placeholder="Aucun"
    placeholderMulti="Choisir un autre justificatif"
    schema={serviceSchema.credentials}
    sortSelect
  />

  <ModelField
    label="Lien"
    placeholder="URL"
    type="url"
    schema={serviceSchema.onlineForm}
    name="onlineForm"
    errorMessages={$formErrors.onlineForm}
    bind:value={service.onlineForm}
  />
</Fieldset>

{#await promise then structure}
  <FieldSet title="Lieu">
    <ModelField
      type="checkboxes"
      label="Lieu de déroulement"
      schema={serviceSchema.locationKinds}
      name="locationKinds"
      errorMessages={$formErrors.locationKinds}
      bind:value={service.locationKinds}
      choices={moveToTheEnd(
        servicesOptions.locationKinds,
        "value",
        "a-distance"
      )}
    >
      <FieldHelp slot="helptext" title="Lieu de déroulement">
        Merci de préciser si le service ou l’accompagnement se déroule en
        présentiel ou bien à distance. Si c’est à distance, merci de préciser le
        lien de la visioconférence.
      </FieldHelp></ModelField
    >
    <ModelField
      placeholder="https://"
      type="url"
      label="Lien visioconférence"
      visible={service.locationKinds.includes("a-distance")}
      schema={serviceSchema.remoteUrl}
      name="remoteUrl"
      errorMessages={$formErrors.remoteUrl}
      bind:value={service.remoteUrl}
    />

    <ModelField
      name="city"
      type="custom"
      label="Ville"
      errorMessages={$formErrors.city}
      schema={serviceSchema.city}
    >
      <CitySearch
        slot="custom-input"
        name="city"
        placeholder="Saisissez et validez votre ville"
        initialValue={service.city}
        onChange={handleCityChange}
      />
    </ModelField>

    <ModelField
      type="custom"
      name="address1"
      label="Adresse"
      errorMessages={$formErrors.address1}
      schema={serviceSchema.address1}
    >
      <AddressSearch
        slot="custom-input"
        name="address1"
        disabled={!service.cityCode}
        cityCode={service.cityCode}
        placeholder="3 rue du parc"
        initialValue={service.address1}
        handleChange={handleAddressChange}
      />
    </ModelField>
    <ModelField
      type="text"
      label="Complément d’adresse"
      placeholder="batiment, escalier, etc."
      schema={serviceSchema.address2}
      name="address2"
      errorMessages={$formErrors.address2}
      bind:value={service.address2}
    />
    <ModelField
      type="text"
      label="Code postal"
      placeholder="00000"
      schema={serviceSchema.postalCode}
      name="postalCode"
      errorMessages={$formErrors.postalCode}
      bind:value={service.postalCode}
    />
    <ModelField
      type="hidden"
      schema={serviceSchema.cityCode}
      name="cityCode"
      errorMessages={$formErrors.cityCode}
      bind:value={service.cityCode}
    />
    <ModelField
      type="hidden"
      schema={serviceSchema.longitude}
      name="longitude"
      errorMessages={$formErrors.longitude}
      bind:value={service.longitude}
    />
    <ModelField
      type="hidden"
      schema={serviceSchema.latitude}
      name="latitude"
      errorMessages={$formErrors.latitude}
      bind:value={service.latitude}
    />
  </FieldSet>

  <FieldSet title="Périodicité">
    <ModelField
      label="Fréquence et horaires"
      type="text"
      placeholder="Ex. Tous les jours à 14h, une fois par mois, etc."
      schema={serviceSchema.recurrence}
      name="recurrence"
      errorMessages={$formErrors.recurrence}
      bind:value={service.recurrence}
    />

    <Field
      label="Durée limitée"
      type="toggle"
      name="isTimeLimited"
      bind:value={isTimeLimited}
      on:change={handleCheckTimeLimited}
    >
      <FieldHelp slot="helptext" title="Suspension">
        En configurant la suspension de votre service avec une limite de temps,
        vous pouvez mieux gérer sa visibilité et sa mise à jour.
      </FieldHelp>
    </Field>
    <ModelField
      label="Date de fin"
      type="date"
      schema={serviceSchema.suspensionDate}
      name="suspensionDate"
      errorMessages={$formErrors.suspensionDate}
      bind:value={service.suspensionDate}
      visible={isTimeLimited}
    />
  </FieldSet>

  <FieldSet title="Contact">
    <ModelField
      label="Prénom et Nom"
      placeholder="Prénom et nom"
      type="text"
      schema={serviceSchema.contactName}
      name="contactName"
      errorMessages={$formErrors.contactName}
      bind:value={service.contactName}
    >
      <FieldHelp slot="helptext" title="Contact référent">
        Merci de préciser les coordonnées de la personne responsable de la
        réception et du traitement des demandes d’orientation. À défaut,
        renseignez le courriel et le numéro de téléphone de votre structure.Par
        défaut, ces informations sont disponibles uniquement aux accompagnateurs
        qui ont un compte DORA. En cochant la case « Rendre les informations
        publiques », les informations seront rendues disponibles à tous les
        visiteurs du site.
      </FieldHelp></ModelField
    >
    <ModelField
      type="tel"
      label="Téléphone"
      placeholder="00 00 00 00 00"
      schema={serviceSchema.contactPhone}
      name="contactPhone"
      errorMessages={$formErrors.contactPhone}
      bind:value={service.contactPhone}
    />
    <ModelField
      type="email"
      label="Courriel"
      placeholder="nom@exemple.org"
      schema={serviceSchema.contactEmail}
      name="contactEmail"
      errorMessages={$formErrors.contactEmail}
      bind:value={service.contactEmail}
    />
    <ModelField
      label="Rendre les informations publiques"
      type="toggle"
      schema={serviceSchema.isContactInfoPublic}
      name="isContactInfoPublic"
      errorMessages={$formErrors.isContactInfoPublic}
      bind:value={service.isContactInfoPublic}
    />
  </FieldSet>
{/await}
