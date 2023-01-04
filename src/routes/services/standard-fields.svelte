<script lang="ts">
  import FieldSet from "$lib/components/display/fieldset.svelte";
  import AdminDivisionSearchField from "$lib/components/inputs/admin-division-search-field.svelte";
  import BasicInputField from "$lib/components/inputs/basic-input-field.svelte";
  import CheckboxesField from "$lib/components/inputs/checkboxes-field.svelte";
  import SelectField from "$lib/components/inputs/select-field.svelte";
  import ToggleField from "$lib/components/inputs/toggle-field.svelte";
  import FieldsAddress from "$lib/components/specialized/services/fields-address.svelte";
  import { moveToTheEnd } from "$lib/utils/misc";

  export let servicesOptions, serviceSchema, service, structure;

  let adminDivisionChoices = [];

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

  // async function handleEltChange(evt) {
  //   // We want to listen to both DOM and component events
  //   const fieldname = evt.target?.name || evt.detail;

  //   // Sometimes (particularly with Select components), the event is received
  //   // before the field value is updated in `service`, although it's not
  //   // supposed to happen. This setTimeout is a unsatisfying workaround to that.
  //   await new Promise((resolve) => {
  //     setTimeout(() => {
  //       const filteredSchema = {
  //         // si le champs n'existe pas dans le schéma,
  //         // on l'initialise avec une valeur par défaut
  //         [fieldname]: serviceSchema[fieldname] || { rules: [] },
  //       };

  //       const { validatedData, valid } = validate(service, filteredSchema, {
  //         fullSchema: serviceSchema,
  //         noScroll: true,
  //         servicesOptions: servicesOptions,
  //       });

  //       if (valid) {
  //         service = { ...service, ...validatedData };
  //       }

  //       resolve(true);
  //     }, 200);
  //   });
  // }

  // setContext<ValidationContext>(contextValidationKey, {
  //   onBlur: handleEltChange,
  //   onChange: handleEltChange,
  // onInput: handleEltChange,
  // });
</script>

<FieldSet title="Périmètre géographique d’intervention" noTopPadding>
  <div slot="help">
    <p class="text-f14">
      Qu’il soit national, régional, départemental, intercommunal ou communal,
      le service peut être délimité aux bénéficiaires habitant sur un territoire
      spécifique.
    </p>

    <h5 class="mb-s0">QPV et ZRR</h5>
    <p class="text-f14">
      Activez cette option si votre offre s’adresse uniquement aux bénéficiaires
      résidants dans des Quartiers Prioritaires de la politique de la Ville ou
      des Zones de Revitalisation Rurale.
    </p>
  </div>

  <SelectField
    type="select"
    label="Périmètre"
    choices={servicesOptions.diffusionZoneType}
    id="diffusionZoneType"
    onSelectChange={handleDiffusionZoneTypeChange}
    initialValue={service.diffusionZoneTypeDisplay}
  />

  {#if service.diffusionZoneType !== "country"}
    <AdminDivisionSearchField
      label="Territoire"
      description="Commencez à saisir le nom et choisissez dans la liste."
      id="diffusionZoneDetails"
      searchType={service.diffusionZoneType}
      handleChange={handlediffusionZoneDetailsChange}
      initialValue={service.diffusionZoneDetailsDisplay}
      bind:choices={adminDivisionChoices}
    />
  {/if}

  <ToggleField
    label="Uniquement QPV ou ZRR"
    id="qpvOrZrr"
    bind:value={service.qpvOrZrr}
  />
</FieldSet>

<FieldSet title="Accueil">
  <CheckboxesField
    label="Mode d’accueil"
    id="locationKinds"
    bind:value={service.locationKinds}
    choices={moveToTheEnd(servicesOptions.locationKinds, "value", "a-distance")}
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
    <FieldsAddress bind:entity={service} bind:parent={structure} />
  {/if}
</FieldSet>

<FieldSet title="Contact">
  <div slot="help">
    <p class="text-f14">
      Coordonnées de la personne responsable de la réception et du traitement
      des demandes d’orientation. À défaut, renseignez le courriel et le numéro
      de téléphone de votre structure.
    </p>
    <p class="text-f14">
      Par défaut, ces informations sont disponibles uniquement aux
      accompagnateurs qui ont un compte DORA. En cochant la case « Rendre
      public », les informations seront rendues disponibles à tous les visiteurs
      du site.
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
    label="Téléphone"
    placeholder="00 00 00 00 00"
    id="contactPhone"
    bind:value={service.contactPhone}
  />
  <BasicInputField
    type="email"
    label="Email"
    placeholder="nom@exemple.org"
    id="contactEmail"
    bind:value={service.contactEmail}
  />
  <ToggleField
    label="Rendre public"
    id="isContactInfoPublic"
    bind:value={service.isContactInfoPublic}
  />
</FieldSet>
