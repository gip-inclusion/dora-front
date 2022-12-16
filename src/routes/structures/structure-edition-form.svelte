<script lang="ts">
  import { goto } from "$app/navigation";
  import Alert from "$lib/components/display/alert.svelte";
  import Button from "$lib/components/display/button.svelte";
  import LinkButton from "$lib/components/display/link-button.svelte";
  import Field from "$lib/components/inputs/field.svelte";
  import HiddenField from "$lib/components/inputs/hidden-field.svelte";
  import InputField from "$lib/components/inputs/input-field.svelte";
  import CitySearch from "$lib/components/specialized/city-search.svelte";
  import OpeningHoursField from "$lib/components/specialized/openingHours/opening-hours-field.svelte";
  import AddressSearch from "$lib/components/specialized/street-search.svelte";
  import { createStructure, modifyStructure } from "$lib/requests/structures";
  import type { Structure, StructuresOptions } from "$lib/types";
  import { getDepartmentFromCityCode } from "$lib/utils/misc";
  import structureSchema from "$lib/validation/schemas/structure";
  import {
    contextValidationKey,
    formErrors,
    injectAPIErrors,
    validate,
    type ValidationContext,
  } from "$lib/validation/validation";
  import { setContext } from "svelte";

  export let structure: Structure;
  export let structuresOptions: StructuresOptions;

  export let modify = false;
  export let onRefresh: (() => Promise<void>) | undefined = undefined;

  let errorDiv;

  async function handleEltChange(evt) {
    // We want to listen to both DOM and component events
    const fieldName = evt.target?.name || evt.detail;

    // Sometimes (particularly with Select components), the event is received
    // before the field value is updated in  `structure`, although it's not
    // supposed to happen. This setTimeout is an unsatisfying workaround to that.

    // TODO: try replacing that with an await tick()
    await new Promise((resolve) => {
      setTimeout(() => {
        const { validatedData, valid } = validate(structure, structureSchema, {
          fieldName,
          noScroll: true,
        });

        if (valid) {
          structure = { ...structure, ...validatedData };
        }

        resolve(true);
      }, 200);
    });
  }

  setContext<ValidationContext>(contextValidationKey, {
    onBlur: handleEltChange,
    onChange: handleEltChange,
  });

  const serverErrors = {
    _default: {},
    siret: { unique: "Cette structure existe déjà" },
  };

  async function handleSubmit() {
    $formErrors = {};
    const { validatedData, valid } = validate(structure, structureSchema);
    if (valid) {
      // Validation OK, let's send it to the API endpoint
      let result;
      if (modify) {
        result = await modifyStructure(validatedData);
      } else {
        result = await createStructure(validatedData);
      }

      if (result?.ok) {
        if (modify && onRefresh) {
          await onRefresh();
        }

        goto(`/structures/${result.result.slug}`);
      } else {
        injectAPIErrors(
          result.error || {
            nonFieldErrors: [
              {
                code: "fetch-error",
                message: "Erreur de connexion au serveur",
              },
            ],
          },
          serverErrors
        );
        errorDiv.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  function handleCityChange(city) {
    structure.city = city?.name;
    structure.cityCode = city?.code;
  }

  function handleAddressChange(address) {
    const props = address?.properties;
    const coords = address?.geometry.coordinates;
    const lat = coords?.[1];
    const long = coords?.[0];
    structure.address1 = props?.name;
    structure.postalCode = props?.postcode;
    structure.longitude = long;
    structure.latitude = lat;
  }

  function getAccessLibreUrl(structure) {
    const department = getDepartmentFromCityCode(structure.cityCode);
    const where = encodeURIComponent(`${structure.city} (${department})`);
    const lat = encodeURIComponent(structure.latitude);
    const long = encodeURIComponent(structure.longitude);
    const code = encodeURIComponent(structure.cityCode);
    return `https://acceslibre.beta.gouv.fr/recherche/?what=&where=${where}&lat=${lat}&lon=${long}&code=${code}`;
  }

  function isRequired(fieldName) {
    return !(
      structureSchema.shape[fieldName].isOptional() ||
      structureSchema.shape[fieldName].isNullable()
    );
  }
  $: accesslibreUrl = getAccessLibreUrl(structure);
</script>

<form
  novalidate
  on:submit|preventDefault={handleSubmit}
  class="flex flex-col gap-s32 rounded-md border border-gray-02 bg-white p-s32 lg:w-2/3"
>
  {#if $formErrors.nonFieldErrors && $formErrors.nonFieldErrors.length}
    <div bind:this={errorDiv}>
      {#each $formErrors.nonFieldErrors || [] as msg}
        <Alert id="global-errors" label={msg} />
      {/each}
    </div>
  {/if}

  <InputField
    name="siret"
    label="SIRET"
    bind:value={structure.siret}
    errorMessages={$formErrors.siret}
    required={isRequired("siret")}
    disabled
    vertical
  />

  <InputField
    name="name"
    label="Nom de la structure"
    bind:value={structure.name}
    errorMessages={$formErrors.name}
    required={isRequired("name")}
    placeholder="Plateforme de l’inclusion"
    vertical
  />

  <Field
    name="typology"
    type="select"
    label="Typologie"
    bind:value={structure.typology}
    choices={structuresOptions.typologies}
    errorMessages={$formErrors.typology}
    required={isRequired("typology")}
    placeholder="Choisissez…"
    sortSelect
    vertical
  />

  <Field
    name="city"
    type="custom"
    label="Ville"
    errorMessages={$formErrors.city}
    required={isRequired("city")}
    vertical
  >
    <CitySearch
      slot="custom-input"
      name="city"
      initialValue={structure.city}
      onChange={handleCityChange}
      placeholder="Paris"
    />
  </Field>

  <Field
    name="address1"
    type="custom"
    label="Adresse"
    errorMessages={$formErrors.address1}
    required={isRequired("address1")}
    vertical
  >
    <AddressSearch
      slot="custom-input"
      name="address1"
      cityCode={structure.cityCode}
      initialValue={structure.address1}
      handleChange={handleAddressChange}
      disabled={!structure.cityCode}
      placeholder="127 rue de Grenelle"
    />
  </Field>

  <InputField
    name="address2"
    label="Complément d’adresse"
    bind:value={structure.address2}
    errorMessages={$formErrors.address2}
    required={isRequired("address2")}
    placeholder="étage, bâtiment…"
    vertical
  />

  <InputField
    name="postalCode"
    label="Code postal"
    bind:value={structure.postalCode}
    errorMessages={$formErrors.postalCode}
    required={isRequired("postalCode")}
    placeholder="75007"
    vertical
  />

  <InputField
    name="accesslibreUrl"
    type="url"
    label="Accessibilité"
    bind:value={structure.accesslibreUrl}
    errorMessages={$formErrors.accesslibreUrl}
    required={isRequired("accesslibreUrl")}
    placeholder="https://acceslibre.beta.gouv.fr/…"
    vertical
  >
    <div slot="description">
      <small>
        Afin de renseigner les informations d’accessibilité sur la structure,
        retrouvez-la via la plateforme
        <a
          class="text-magenta-cta underline"
          href={accesslibreUrl}
          target="_blank"
          title="Ouverture dans une nouvelle fenêtre"
          rel="noopener"
        >
          acceslibre
        </a>
        et copiez l’url dans le champs ci-dessous
      </small>
    </div>
  </InputField>

  <InputField
    name="phone"
    type="tel"
    label="Téléphone"
    bind:value={structure.phone}
    errorMessages={$formErrors.phone}
    required={isRequired("phone")}
    vertical
  />

  <InputField
    name="email"
    type="email"
    label="Courriel"
    bind:value={structure.email}
    errorMessages={$formErrors.email}
    required={isRequired("email")}
    placeholder="nom.prenom@organisation.fr"
    vertical
  />

  <InputField
    name="url"
    type="url"
    label="Site web"
    bind:value={structure.url}
    errorMessages={$formErrors.url}
    required={isRequired("url")}
    placeholder="https://mastructure.fr"
    vertical
  />

  <Field
    name="shortDesc"
    type="textarea"
    label="Résumé"
    bind:value={structure.shortDesc}
    errorMessages={$formErrors.shortDesc}
    required={isRequired("shortDesc")}
    description="280 caractères maximum"
    placeholder="Décrivez brièvement votre structure"
    vertical
  />

  <Field
    name="fullDesc"
    type="richtext"
    label="Présentation"
    bind:value={structure.fullDesc}
    errorMessages={$formErrors.fullDesc}
    required={isRequired("fullDesc")}
    placeholder="Présentation détaillée de la structure"
    vertical
  />

  <Field
    name="nationalLabels"
    type="multiselect"
    label="Labels nationaux"
    bind:value={structure.nationalLabels}
    choices={structuresOptions.nationalLabels}
    errorMessages={$formErrors.nationalLabels}
    required={isRequired("nationalLabels")}
    description="Indiquez si la structure fait partie d'un ou plusieurs réseaux nationaux"
    placeholder="Choisissez…"
    placeholderMulti="Choisissez…"
    vertical
  />

  <InputField
    name="otherLabels"
    label="Autres labels"
    bind:value={structure.otherLabels}
    errorMessages={$formErrors.otherLabels}
    required={isRequired("otherLabels")}
    description="Indiquez si la structure fait partie d’autres labels (régionaux, locaux…)"
    vertical
  />

  <!-- Transform to custom field -->
  <OpeningHoursField
    name="openingHours"
    label="Horaires de la structure"
    on:change={handleEltChange}
    errorMessages={$formErrors.openingHours}
    required={isRequired("openingHours")}
    bind:value={structure.openingHours}
  />

  <InputField
    name="openingHoursDetails"
    label="Détail horaires"
    bind:value={structure.openingHoursDetails}
    errorMessages={$formErrors.openingHoursDetails}
    required={isRequired("openingHoursDetails")}
    description="Vous pouvez renseigner des informations spécifiques concernant les horaires dans ce champ"
    vertical
  />

  <!-- Champs cachés -->
  <HiddenField name="cityCode" bind:value={structure.cityCode} />
  <HiddenField name="longitude" bind:value={structure.longitude} />
  <HiddenField name="latitude" bind:value={structure.latitude} />
  <HiddenField name="ape" bind:value={structure.ape} />

  <hr />

  <div class="flex flex-col justify-end gap-s16 md:flex-row ">
    <LinkButton
      to="/structures/{structure.slug}"
      on:submit
      secondary
      label="Annuler les modifications"
    />
    <Button
      on:submit
      name="validate"
      type="submit"
      label="Valider les modifications"
    />
  </div>
</form>
