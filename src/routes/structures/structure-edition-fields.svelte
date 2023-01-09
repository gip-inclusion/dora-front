<script lang="ts">
  import BasicInputField from "$lib/components/inputs/basic-input-field.svelte";
  import HiddenField from "$lib/components/inputs/hidden-field.svelte";
  import MultiSelectField from "$lib/components/inputs/multi-select-field.svelte";
  import OpeningHoursField from "$lib/components/inputs/opening-hours-field.svelte";
  import RichTextField from "$lib/components/inputs/rich-text-field.svelte";
  import SelectField from "$lib/components/inputs/select-field.svelte";
  import TextareaField from "$lib/components/inputs/textarea-field.svelte";
  import FieldsAddress from "$lib/components/specialized/services/fields-address.svelte";
  import type { Structure, StructuresOptions } from "$lib/types";
  import { getDepartmentFromCityCode } from "$lib/utils/misc";

  export let structure: Structure;
  export let structuresOptions: StructuresOptions;

  function getAccessLibreUrl(structure: Structure) {
    const department = getDepartmentFromCityCode(structure.cityCode);
    const where = encodeURIComponent(`${structure.city} (${department})`);
    const lat = encodeURIComponent(structure.latitude);
    const long = encodeURIComponent(structure.longitude);
    const code = encodeURIComponent(structure.cityCode);
    return `https://acceslibre.beta.gouv.fr/recherche/?what=&where=${where}&lat=${lat}&lon=${long}&code=${code}`;
  }

  $: accesslibreUrl = getAccessLibreUrl(structure);
</script>

<BasicInputField
  id="siret"
  label="SIRET"
  bind:value={structure.siret}
  disabled
/>

<BasicInputField
  id="name"
  label="Nom de la structure"
  bind:value={structure.name}
  required
  placeholder="Plateforme de l’inclusion"
/>

<SelectField
  id="typology"
  label="Typologie"
  bind:value={structure.typology}
  choices={structuresOptions.typologies}
  required
  placeholder="Choisissez…"
  sort
/>

<FieldsAddress bind:entity={structure} required />

<BasicInputField
  type="url"
  id="accesslibreUrl"
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
        rel="noopener noreferrer">acceslibre</a
      >
      et copiez l’url dans le champ ci-dessous.
    </small>
  </div>
</BasicInputField>

<BasicInputField
  type="tel"
  id="phone"
  label="Téléphone"
  bind:value={structure.phone}
  placeholder="0X XX XX XX XX"
/>

<BasicInputField
  type="email"
  id="email"
  label="Courriel"
  bind:value={structure.email}
  required
  placeholder="nom.prenom@organisation.fr"
/>

<BasicInputField
  type="url"
  id="url"
  label="Site web"
  bind:value={structure.url}
  placeholder="https://mastructure.fr"
/>

<TextareaField
  id="shortDesc"
  label="Résumé"
  bind:value={structure.shortDesc}
  required
  description="280 caractères maximum"
  placeholder="Décrivez brièvement votre structure"
/>

<RichTextField
  id="fullDesc"
  label="Présentation"
  bind:value={structure.fullDesc}
  placeholder="Présentation détaillée de la structure"
  vertical
/>

<MultiSelectField
  id="nationalLabels"
  label="Labels nationaux"
  bind:value={structure.nationalLabels}
  choices={structuresOptions.nationalLabels}
  description="Indiquez si la structure fait partie d'un ou plusieurs réseaux nationaux"
  placeholder="Choisissez…"
  placeholderMulti="Choisissez…"
  vertical
/>

<BasicInputField
  id="otherLabels"
  label="Autres labels"
  bind:value={structure.otherLabels}
  description="Indiquez si la structure fait partie d’autres labels (régionaux, locaux…)"
  vertical
/>

<OpeningHoursField
  id="openingHours"
  label="Horaires de la structure"
  bind:value={structure.openingHours}
  vertical
/>

<BasicInputField
  id="openingHoursDetails"
  label="Détail horaires"
  bind:value={structure.openingHoursDetails}
  description="Vous pouvez renseigner des informations spécifiques concernant les horaires dans ce champ"
  vertical
/>

<HiddenField id="ape" bind:value={structure.ape} />
