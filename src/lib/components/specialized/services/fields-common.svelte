<script lang="ts">
  import Button from "$lib/components/display/button.svelte";
  import FieldSet from "$lib/components/display/fieldset.svelte";
  import Modal from "$lib/components/display/modal.svelte";
  import Notice from "$lib/components/display/notice.svelte";
  import AddableMultiSelectField from "$lib/components/inputs/addable-multiselect-field.svelte";
  import BasicInputField from "$lib/components/inputs/basic-input-field.svelte";
  import CheckboxesField from "$lib/components/inputs/checkboxes-field.svelte";
  import RichTextField from "$lib/components/inputs/rich-text-field.svelte";
  import SelectField from "$lib/components/inputs/select-field.svelte";
  import TextAreaField from "$lib/components/inputs/textarea-field.svelte";
  import ToggleField from "$lib/components/inputs/toggle-field.svelte";
  import UploadField from "$lib/components/inputs/upload-field.svelte";
  import type { Model } from "$lib/types";
  import { getModelInputProps } from "$lib/utils/forms";
  import {
    arraysCompare,
    moveToTheEnd,
    orderAndReformatSubcategories,
  } from "$lib/utils/misc";
  import { isNotFreeService } from "$lib/utils/service";
  import { formErrors } from "$lib/validation/validation";
  import FieldModel from "./field-model.svelte";

  export let servicesOptions, serviceSchema, service, canAddChoices;
  export let isModel = false;
  export let model: Model | undefined = undefined;
  export let typologyFieldDisabled = false;

  const useModel = model != null;

  let feeConditionClassic =
    service.feeCondition === "pass-numerique"
      ? "gratuit"
      : service.feeCondition;

  let subcategories = [];
  let showModelSubcategoriesUseValue = true;
  let isPristine = service.subcategories.length === 0;

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

  let previousCategories = [];
  let toggling = undefined;

  $: displayInclusionNumeriqueFormNotice =
    service.categories.includes("numerique");

  $: selectedInclusionNumeriqueFormNotice = service.useInclusionNumeriqueScheme
    ? inclusionNumeriqueFormActiveNotice
    : inclusionNumeriqueFormAvailableNotice;

  function toggleInclusionNumeriqueForm() {
    service.useInclusionNumeriqueScheme = !service.useInclusionNumeriqueScheme;

    if (service.useInclusionNumeriqueScheme) {
      service.categories = ["numerique"];
    }

    toggling = true;
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

    if (model) {
      showModelSubcategoriesUseValue = arraysCompare(
        categories,
        model.categories
      );
    }
  }

  function handleFeeConditionChange(feeCondition) {
    service.feeCondition = feeCondition?.value;
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

  let showModel;

  $: showModel = !!service.model;

  let fullDesc;

  let isOpen = false;

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

  function useModelValue(fieldName) {
    return () => {
      service[fieldName] = model ? model[fieldName] : undefined;

      if (fieldName === "fullDesc") {
        fullDesc.updateValue(service.fullDesc);
      }
      if (fieldName === "feeCondition") {
        feeConditionClassic = service.feeCondition;
      }
    };
  }

  $: fieldModelProps = getModelInputProps(
    serviceSchema,
    service,
    servicesOptions,
    showModel,
    useModelValue,
    model
  );
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

<FieldSet noTopPadding {showModel}>
  <FieldModel {...fieldModelProps["categories"]} type="array">
    <SelectField
      id="categories"
      label="Thématiques"
      bind:value={service.categories}
      choices={servicesOptions.categories}
      onSelectChange={handleCategoriesChange}
      placeholderMulti="Sélectionner"
      sort
      multiple
      disabled={typologyFieldDisabled}
      readonly={typologyFieldDisabled}
    />
  </FieldModel>

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
</FieldSet>

{#if !service.useInclusionNumeriqueScheme || isModel || useModel}
  <FieldSet title="Présentation" {showModel}>
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

    <FieldModel {...fieldModelProps["name"]}>
      <BasicInputField
        id="name"
        label="Titre"
        placeholder="Compléter"
        bind:value={service.name}
      />
    </FieldModel>

    <FieldModel {...fieldModelProps["shortDesc"]}>
      <TextAreaField
        id="shortDesc"
        description="280 caractères maximum"
        placeholder="Compléter"
        label="Résumé"
        bind:value={service.shortDesc}
      />
    </FieldModel>

    <FieldModel {...fieldModelProps["fullDesc"]} paddingTop type="markdown">
      <RichTextField
        id="fullDesc"
        bind:this={fullDesc}
        label="Description"
        placeholder="Informations concernant le service et ses spécificités."
        vertical
        bind:value={service.fullDesc}
      />
    </FieldModel>
  </FieldSet>

  <FieldSet title="Typologie" {showModel}>
    <div slot="help">
      <p class="text-f14">
        Classez le service par thématiques et besoins pour faciliter son
        référencement.
      </p>
    </div>

    <FieldModel
      {...fieldModelProps["subcategories"]}
      showUseValue={showModelSubcategoriesUseValue}
      type="array"
    >
      <SelectField
        id="subcategories"
        multiple
        label="Besoins"
        bind:value={service.subcategories}
        choices={subcategories}
        placeholder="Sélectionner"
        placeholderMulti="Sélectionner"
      />
    </FieldModel>

    <FieldModel {...fieldModelProps["kinds"]} type="array">
      <CheckboxesField
        id="kinds"
        label="Types"
        bind:value={service.kinds}
        choices={servicesOptions.kinds}
      />
    </FieldModel>

    <FieldModel {...fieldModelProps["isCumulative"]} type="boolean">
      <ToggleField
        id="isCumulative"
        label="Cumulable"
        bind:value={service.isCumulative}
        description="Cumulable avec d’autres services"
      />
    </FieldModel>
  </FieldSet>

  <FieldSet title="Publics" {showModel}>
    <div slot="help">
      <p class="text-f14">
        Publics auxquels le service s’adresse. Vous pouvez ajouter vos propres
        valeurs avec le bouton « Ajouter une autre option ». Si votre service
        est ouvert à tous, sans critères ou prérequis, laissez les champs avec
        les options par défaut.
      </p>
    </div>

    {#if servicesOptions.concernedPublic.length}
      <FieldModel {...fieldModelProps["concernedPublic"]} type="array">
        <AddableMultiSelectField
          id="concernedPublic"
          bind:values={service.concernedPublic}
          structure={service.structure}
          choices={servicesOptions.concernedPublic}
          label="Profils"
          placeholder="Tous publics"
          placeholderMulti="Sélectionner"
          sort
          description="Plusieurs choix possibles"
          canAdd={canAddChoices}
        />
      </FieldModel>
    {/if}

    {#if servicesOptions.accessConditions.length}
      <FieldModel {...fieldModelProps["accessConditions"]} type="array">
        <AddableMultiSelectField
          id="accessConditions"
          bind:values={service.accessConditions}
          structure={service.structure}
          choices={servicesOptions.accessConditions}
          label="Critères"
          placeholder="Aucun"
          placeholderMulti="Choisir un autre critères d’admission"
          sort
          description="Plusieurs choix possibles"
          canAdd={canAddChoices}
        />
      </FieldModel>
    {/if}

    {#if servicesOptions.requirements.length}
      <FieldModel {...fieldModelProps["requirements"]} type="array">
        <AddableMultiSelectField
          id="requirements"
          bind:values={service.requirements}
          structure={service.structure}
          choices={servicesOptions.requirements}
          label="Pré-requis ou compétences"
          placeholder="Aucun"
          placeholderMulti="Choisir un autre pré-requis"
          sort
          description="Plusieurs choix possibles"
          canAdd={canAddChoices}
        />
      </FieldModel>
    {/if}
  </FieldSet>

  <FieldSet title="Modalités" {showModel}>
    <div slot="help">
      <p class="text-f14">Modalités pour mobiliser le service.</p>
    </div>

    <div class="flex flex-col lg:gap-s8">
      <FieldModel {...fieldModelProps["coachOrientationModes"]} type="array">
        <CheckboxesField
          id="coachOrientationModes"
          label="Pour les accompagnateurs"
          choices={moveToTheEnd(
            servicesOptions.coachOrientationModes,
            "value",
            "autre"
          )}
          bind:value={service.coachOrientationModes}
        />
      </FieldModel>

      {#if service.coachOrientationModes.includes("autre")}
        <FieldModel {...fieldModelProps["coachOrientatonModesOther"]}>
          <BasicInputField
            id="coachOrientatonModesOther"
            hideLabel
            placeholder="Compléter"
            bind:value={service.coachOrientationModesOther}
          />
        </FieldModel>
      {/if}
    </div>

    <div class="flex flex-col lg:gap-s8">
      <FieldModel {...fieldModelProps["beneficiariesAccessMode"]} type="array">
        <CheckboxesField
          id="beneficiariesAccessMode"
          label="Pour les bénéficiaires"
          choices={moveToTheEnd(
            servicesOptions.beneficiariesAccessModes,
            "value",
            "autre"
          )}
          bind:value={service.beneficiariesAccessModes}
        />
      </FieldModel>

      {#if service.beneficiariesAccessModes.includes("autre")}
        <FieldModel {...fieldModelProps["beneficiariesAccessModesOther"]}>
          <BasicInputField
            id="beneficiariesAccessModesOther"
            hideLabel
            placeholder="Merci de préciser la modalité"
            bind:value={service.beneficiariesAccessModesOther}
          />
        </FieldModel>
      {/if}
    </div>

    <div class="flex flex-col gap-s4">
      <FieldModel
        {...fieldModelProps["feeCondition"]}
        serviceValue={feeConditionClassic}
        type="text"
      >
        <SelectField
          id="feeCondition"
          label="Frais à charge"
          placeholder="Choississez..."
          bind:value={feeConditionClassic}
          choices={servicesOptions.feeConditions.filter(
            (fee) => fee.value !== "pass-numerique"
          )}
          onSelectChange={handleFeeConditionChange}
          display="vertical"
        />
      </FieldModel>

      {#if isNotFreeService(feeConditionClassic)}
        <FieldModel {...fieldModelProps["feeDetails"]}>
          <TextAreaField
            id="feeDetails"
            label="Détails des frais à charge"
            placeholder="Merci de détailler ici les frais à charge du bénéficiaire : adhésion, frais de location, frais de garde, etc., et les montants."
            schema={serviceSchema.feeDetails}
            name="feeDetails"
            errorMessages={$formErrors.feeDetails}
            bind:value={service.feeDetails}
          />
        </FieldModel>
      {/if}
    </div>
  </FieldSet>

  <FieldSet title="Documents" {showModel}>
    <div slot="help">
      <p class="text-f14">
        Justificatifs à fournir et documents à compléter pour postuler. Le lien
        redirige vers une page web qui présente le service (formulaire, fiche de
        prescription, simulateurs, etc.)
      </p>
    </div>

    <FieldModel {...fieldModelProps["forms"]} type="files">
      <UploadField
        id="forms"
        label="Documents à compléter"
        structureSlug={service.structure}
        on:blur
        bind:fileKeys={service.forms}
      />
    </FieldModel>

    {#if servicesOptions.credentials.length}
      <FieldModel {...fieldModelProps["credentials"]} type="array">
        <AddableMultiSelectField
          id="credentials"
          bind:values={service.credentials}
          structure={service.structure}
          choices={servicesOptions.credentials}
          label="Justificatifs à fournir"
          placeholder="Aucun"
          placeholderMulti="Choisir un autre justificatif"
          sort
          canAdd={canAddChoices}
        />
      </FieldModel>
    {/if}

    <FieldModel {...fieldModelProps["onlineForm"]}>
      <BasicInputField
        id="onlineForm"
        label="Lien"
        placeholder="URL"
        type="url"
        bind:value={service.onlineForm}
      />
    </FieldModel>
  </FieldSet>

  <FieldSet title="Périodicité" {showModel}>
    <div slot="help">
      <p class="text-f14">
        La durée limitée permet de supendre automatiquement la visibilité du
        service dans les résultat de recherche.
      </p>
    </div>
    <FieldModel {...fieldModelProps["recurrence"]}>
      <BasicInputField
        id="recurrence"
        label="Fréquence et horaires"
        placeholder="Ex. Tous les jours à 14h, une fois par mois, etc."
        bind:value={service.recurrence}
      />
    </FieldModel>

    <FieldModel {...fieldModelProps["suspensionDate"]}>
      <BasicInputField
        id="suspensionDate"
        label="Date de fin"
        type="date"
        bind:value={service.suspensionDate}
      />
    </FieldModel>
  </FieldSet>
{/if}
