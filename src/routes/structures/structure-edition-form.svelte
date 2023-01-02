<script lang="ts">
  import { goto } from "$app/navigation";
  import Alert from "$lib/components/display/alert.svelte";
  import Button from "$lib/components/display/button.svelte";
  import LinkButton from "$lib/components/display/link-button.svelte";
  import Form from "$lib/components/hoc/form.svelte";
  import HiddenField from "$lib/components/inputs/hidden-field.svelte";
  import InputField from "$lib/components/inputs/input-field.svelte";
  import SelectField from "$lib/components/inputs/select-field.svelte";
  import RichTextField from "$lib/components/inputs/rich-text-field.svelte";
  import TextAreaField from "$lib/components/inputs/textarea-field.svelte";
  import OpeningHoursField from "$lib/components/inputs/opening-hours-field.svelte";
  import { createStructure, modifyStructure } from "$lib/requests/structures";
  import type { Structure, StructuresOptions } from "$lib/types";
  import { getDepartmentFromCityCode } from "$lib/utils/misc";
  import structureSchema from "$lib/validation/schemas/structure";
  import { formErrors } from "$lib/validation/validation";
  import AddressSearchField from "$lib/components/inputs/address-search-field.svelte";
  import CitySearchField from "$lib/components/inputs/city-search-field.svelte";

  export let structure: Structure;
  export let structuresOptions: StructuresOptions;

  export let modify = false;
  export let onRefresh: (() => Promise<void>) | undefined = undefined;

  let requesting = false;
  let errorDiv: Node;

  const serverErrors = {
    _default: {},
    siret: { unique: "Cette structure existe déjà" },
  };

  function handleChange(validatedData) {
    structure = { ...structure, ...validatedData };
  }

  async function handleSubmit(validatedData) {
    let result;
    if (modify) {
      result = await modifyStructure(validatedData);
    } else {
      result = await createStructure(validatedData);
    }
    return result;
  }

  async function handleSuccess(result) {
    if (modify && onRefresh) {
      await onRefresh();
    }
    goto(`/structures/${result.slug}`);
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

  function getAccessLibreUrl(structure: Structure) {
    const department = getDepartmentFromCityCode(structure.cityCode);
    const where = encodeURIComponent(`${structure.city} (${department})`);
    const lat = encodeURIComponent(structure.latitude);
    const long = encodeURIComponent(structure.longitude);
    const code = encodeURIComponent(structure.cityCode);
    return `https://acceslibre.beta.gouv.fr/recherche/?what=&where=${where}&lat=${lat}&lon=${long}&code=${code}`;
  }

  function isRequired(fieldName: string) {
    return !(
      structureSchema.shape[fieldName].isOptional() ||
      structureSchema.shape[fieldName].isNullable()
    );
  }

  $: accesslibreUrl = getAccessLibreUrl(structure);

  $: props = Object.fromEntries(
    Object.keys(structureSchema.shape).map((k) => [
      k,
      {
        name: k,
        errorMessages: $formErrors[k],
        required: isRequired(k),
      },
    ])
  );
</script>

<Form
  data={structure}
  serverErrorsDict={serverErrors}
  schema={structureSchema}
  onChange={handleChange}
  onSubmit={handleSubmit}
  onSuccess={handleSuccess}
  bind:requesting
  extraClass="flex flex-col gap-s32 rounded-md border border-gray-02 bg-white p-s32 lg:w-2/3"
>
  {#if $formErrors.nonFieldErrors && $formErrors.nonFieldErrors.length}
    <div bind:this={errorDiv}>
      {#each $formErrors.nonFieldErrors || [] as msg}
        <Alert id="global-errors" label={msg} />
      {/each}
    </div>
  {/if}

  <InputField
    {...props["siret"]}
    label="SIRET"
    bind:value={structure.siret}
    disabled
    vertical
  />

  <InputField
    {...props["name"]}
    label="Nom de la structure"
    bind:value={structure.name}
    placeholder="Plateforme de l’inclusion"
    vertical
  />

  <SelectField
    {...props["typology"]}
    label="Typologie"
    bind:value={structure.typology}
    choices={structuresOptions.typologies}
    placeholder="Choisissez…"
    sort
    vertical
  />

  <CitySearchField
    {...props["city"]}
    label="Ville"
    initialValue={structure.city}
    onChange={handleCityChange}
    placeholder="Paris"
    vertical
  />

  <AddressSearchField
    {...props["address1"]}
    label="Adresse"
    cityCode={structure.cityCode}
    initialValue={structure.address1}
    onChange={handleAddressChange}
    disabled={!structure.cityCode}
    placeholder="127 rue de Grenelle"
    vertical
  />

  <InputField
    {...props["address2"]}
    label="Complément d’adresse"
    bind:value={structure.address2}
    placeholder="étage, bâtiment…"
    vertical
  />

  <InputField
    {...props["postalCode"]}
    label="Code postal"
    bind:value={structure.postalCode}
    placeholder="75007"
    vertical
  />

  <InputField
    {...props["accesslibreUrl"]}
    type="url"
    label="Accessibilité"
    bind:value={structure.accesslibreUrl}
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
          rel="noopener noreferrer"
        >
          acceslibre
        </a>
        et copiez l’url dans le champs ci-dessous
      </small>
    </div>
  </InputField>

  <InputField
    {...props["phone"]}
    type="tel"
    label="Téléphone"
    bind:value={structure.phone}
    vertical
  />

  <InputField
    {...props["email"]}
    type="email"
    label="Courriel"
    bind:value={structure.email}
    placeholder="nom.prenom@organisation.fr"
    vertical
  />

  <InputField
    {...props["url"]}
    type="url"
    label="Site web"
    bind:value={structure.url}
    placeholder="https://mastructure.fr"
    vertical
  />

  <TextAreaField
    {...props["shortDesc"]}
    label="Résumé"
    bind:value={structure.shortDesc}
    description="280 caractères maximum"
    placeholder="Décrivez brièvement votre structure"
    vertical
  />

  <RichTextField
    {...props["fullDesc"]}
    label="Présentation"
    bind:value={structure.fullDesc}
    placeholder="Présentation détaillée de la structure"
    vertical
  />

  <SelectField
    {...props["nationalLabels"]}
    label="Labels nationaux"
    bind:value={structure.nationalLabels}
    choices={structuresOptions.nationalLabels}
    multiple
    description="Indiquez si la structure fait partie d'un ou plusieurs réseaux nationaux"
    placeholder="Choisissez…"
    placeholderMulti="Choisissez…"
    vertical
  />

  <InputField
    {...props["otherLabels"]}
    label="Autres labels"
    bind:value={structure.otherLabels}
    description="Indiquez si la structure fait partie d’autres labels (régionaux, locaux…)"
    vertical
  />

  <OpeningHoursField
    {...props["openingHours"]}
    label="Horaires de la structure"
    bind:value={structure.openingHours}
    vertical
  />

  <InputField
    {...props["openingHoursDetails"]}
    label="Détail horaires"
    bind:value={structure.openingHoursDetails}
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
      disabled={requesting}
    />
  </div>
</Form>
