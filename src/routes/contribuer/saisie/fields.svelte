<script lang="ts">
  import FieldSet from "$lib/components/display/fieldset.svelte";
  import Notice from "$lib/components/display/notice.svelte";
  import BasicInputField from "$lib/components/inputs/basic-input-field.svelte";
  import CheckboxesField from "$lib/components/inputs/checkboxes-field.svelte";
  import RichTextField from "$lib/components/inputs/rich-text-field.svelte";
  import SelectField from "$lib/components/inputs/select-field.svelte";
  import TextareaField from "$lib/components/inputs/textarea-field.svelte";
  import ToggleField from "$lib/components/inputs/toggle-field.svelte";
  import StructureSearch from "$lib/components/specialized/establishment-search/search.svelte";
  import FieldsAddress from "$lib/components/specialized/services/fields-address.svelte";
  import type { Service, ServicesOptions } from "$lib/types";
  import { moveToTheEnd, orderAndReformatSubcategories } from "$lib/utils/misc";
  import { isNotFreeService } from "$lib/utils/service";
  // import { tick } from "svelte";

  export let servicesOptions: ServicesOptions;
  export let service: Service;

  let establishment = null;

  let subcategories = [];
  // let showServiceAddress = true;

  function handleCategoriesChange(categories) {
    subcategories = categories.length
      ? servicesOptions.subcategories.filter(({ value }) =>
          categories.some((category) => value.startsWith(category))
        )
      : [];
    subcategories = orderAndReformatSubcategories(
      subcategories,
      categories,
      servicesOptions
    );

    service.subcategories = service.subcategories.filter((scat) =>
      categories.some((category) => scat.startsWith(category))
    );
  }

  function handleStructureCityChange() {
    service.siret = "";
  }

  async function handleEstablishmentChange(newEstablishment) {
    service.siret = newEstablishment?.siret;
  }

  // function handleCityChange(city) {
  //   service.city = city?.name;
  //   service.cityCode = city?.code;
  // }

  // function handleAddressChange(address) {
  //   const props = address?.properties;
  //   const coords = address?.geometry.coordinates;
  //   const lat = coords?.[1];
  //   const long = coords?.[0];
  //   service.address1 = props?.name;
  //   service.postalCode = props?.postcode;
  //   service.longitude = long;
  //   service.latitude = lat;
  // }

  // async function fillAdress() {
  //   showServiceAddress = false;
  //   if (establishment) {
  //     const {
  //       city,
  //       address1,
  //       address2,
  //       postalCode,
  //       cityCode,
  //       latitude,
  //       longitude,
  //     } = establishment;
  //     service.city = city;
  //     service.address1 = address1;
  //     service.address2 = address2;
  //     service.postalCode = postalCode;
  //     service.cityCode = cityCode;
  //     service.latitude = latitude;
  //     service.longitude = longitude;
  //   }
  //   await tick();
  //   showServiceAddress = true;
  // }
</script>

<StructureSearch
  onEstablishmentChange={handleEstablishmentChange}
  onCityChange={handleStructureCityChange}
  bind:establishment
  isOwnStructure={false}
/>

<!-- {#if service.siret} -->
{#if true}
  <FieldSet title="Présentation">
    <div slot="help">
      <p class="text-f14">
        Le <b>Résumé</b> présente le service en une phrase courte. Il apparait dans
        les résultats de recherche.
      </p>
      <p class="text-f14">
        <strong>Exemple</strong> :
        <i>
          Faciliter vos déplacements en cas de reprise d’emploi ou de formation
          (entretien d’embauche, concours public…)
        </i>
      </p>
      <p class="text-f14">
        Si besoin, détaillez dans la partie
        <b>Description</b>.
      </p>
    </div>

    <BasicInputField
      label="Nom"
      placeholder="Ex. Aide aux frais liés à…"
      id="name"
      bind:value={service.name}
    />

    <TextareaField
      description="280 caractères maximum"
      placeholder="Décrivez brièvement ce service"
      label="Résumé"
      id="shortDesc"
      bind:value={service.shortDesc}
    />

    <RichTextField
      label="Description"
      placeholder="Veuillez ajouter ici toute autre information que vous jugerez utile — concernant ce service et ses spécificités."
      vertical
      id="fullDesc"
      bind:value={service.fullDesc}
    />

    <ToggleField
      label="Service cumulable"
      id="isCumulative"
      bind:value={service.isCumulative}
    />
  </FieldSet>

  <FieldSet title="Typologie">
    <div slot="help">
      <p class="text-f14">
        Classez le service par thématiques et besoins pour faciliter son
        référencement.
      </p>
    </div>
    <SelectField
      multiple
      label="Thématiques"
      bind:value={service.categories}
      choices={servicesOptions.categories}
      id="categories"
      onSelectChange={handleCategoriesChange}
      placeholderMulti="Choisissez la ou les thématiques"
      _sort
    />

    <SelectField
      multiple
      label="Besoin(s) auxquels ce service répond"
      id="subcategories"
      bind:value={service.subcategories}
      choices={subcategories}
      placeholder="Choisissez les sous-catégories"
      placeholderMulti="Choisissez les sous-catégories"
    />

    <CheckboxesField
      label="Type de service"
      id="kinds"
      bind:value={service.kinds}
      choices={servicesOptions.kinds}
      description="Quelle est la nature de ce service."
    />
  </FieldSet>

  <div class="mt-s48">
    <Notice type="warning">
      <p class="text-f14">
        Renseignez le courriel du référent afin de faciliter la validation de
        votre suggestion.
      </p>
    </Notice>
  </div>

  <FieldSet title="Contact du référent">
    <div slot="help">
      <p class="text-f14">
        Coordonnées de la personne responsable de la réception et du traitement
        des demandes d’orientation. À défaut, renseignez le courriel et le
        numéro de téléphone de la structure.
      </p>
    </div>

    <BasicInputField
      label="Prénom et nom"
      placeholder="Prénom et nom"
      id="contactName"
      bind:value={service.contactName}
    />
    <BasicInputField
      type="tel"
      label="Numéro de téléphone"
      placeholder="05 ou 06 00 00 00 00"
      id="contactPhone"
      bind:value={service.contactPhone}
    />
    <BasicInputField
      type="email"
      label="Courriel"
      placeholder="Courriel de la personne à contacter"
      id="contactEmail"
      bind:value={service.contactEmail}
    />
  </FieldSet>

  <div class="mt-s48">
    <Notice title="Informations facultatives">
      <p class="text-f14">
        Les informations ci-dessous sont facultatives, mais facilitent le
        travail des structures porteuses.
      </p>
    </Notice>
  </div>

  <FieldSet title="Publics">
    <div slot="help">
      <p class="text-f14">Publics auxquels le service s’adresse.</p>
    </div>

    <SelectField
      multiple
      type="multiselect"
      label="Profils"
      description="Plusieurs choix possibles"
      id="concernedPublic"
      bind:value={service.concernedPublic}
      choices={servicesOptions.concernedPublic}
      placeholder="Sélectionner"
      placeholderMulti="Sélectionner"
      sortSelect
    />

    <SelectField
      multiple
      label="Critères"
      description="Plusieurs choix possibles"
      id="accessConditions"
      bind:value={service.accessConditions}
      choices={servicesOptions.accessConditions}
      placeholder="Sélectionner"
      placeholderMulti="Sélectionner"
      sortSelect
    />

    <SelectField
      multiple
      type="multiselect"
      description="Plusieurs choix possibles"
      id="requirements"
      bind:value={service.requirements}
      choices={servicesOptions.requirements}
      label="Pré-requis ou compétences"
      placeholder="Sélectionner"
      placeholderMulti="Sélectionner"
      sortSelect
    />

    <SelectField
      label="Frais à charge du bénéficiaire"
      id="feeCondition"
      placeholder="Choississez..."
      bind:value={service.feeCondition}
      choices={servicesOptions.feeConditions}
    />

    {#if isNotFreeService(service.feeCondition)}
      <TextareaField
        label="Détails des frais à charge"
        placeholder="Merci de détailler ici les frais à charge du bénéficiaire : adhésion, frais de location, frais de garde, etc., et les montants."
        id="feeDetails"
        bind:value={service.feeDetails}
      />
    {/if}
  </FieldSet>

  <FieldSet title="Accueil">
    <CheckboxesField
      label="Mode d’accueil"
      id="locationKinds"
      bind:value={service.locationKinds}
      choices={moveToTheEnd(
        servicesOptions.locationKinds,
        "value",
        "a-distance"
      )}
    />
    {#if service.locationKinds.includes("a-distance")}
      <BasicInputField
        placeholder="https://"
        type="url"
        label="Lien visioconférence"
        id="remoteUrl"
        bind:value={service.remoteUrl}
      />
    {/if}

    {#if service.locationKinds.includes("en-presentiel")}
      <FieldsAddress bind:entity={service} bind:parent={establishment} />
    {/if}
  </FieldSet>
{/if}
