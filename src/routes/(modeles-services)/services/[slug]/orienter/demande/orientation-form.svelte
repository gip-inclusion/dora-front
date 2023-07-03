<script lang="ts">
  import Fieldset from "$lib/components/display/fieldset.svelte";
  import Notice from "$lib/components/display/notice.svelte";
  import BasicInputField from "$lib/components/forms/fields/basic-input-field.svelte";
  import CheckboxesField from "$lib/components/forms/fields/checkboxes-field.svelte";
  import TextareaField from "$lib/components/forms/fields/textarea-field.svelte";
  import UploadField from "$lib/components/forms/fields/upload-field.svelte";
  import { formatFilePath } from "$lib/utils/service";
  import { orientation } from "../store";
  import { orientationStep2Schema } from "../schema";
  import { userInfo } from "$lib/utils/auth";
  import { onMount } from "svelte";
  import Accordion from "$lib/components/display/accordion.svelte";
  import SelectField from "$lib/components/forms/fields/select-field.svelte";

  export let service;
  export let servicesOptions;

  let contactPrefOptions = [];
  let credentials = [];
  onMount(() => {
    contactPrefOptions = [
      { value: "phone", label: "Téléphone" },
      { value: "email", label: "E-mail" },
      { value: "other", label: "Autre" },
    ];

    credentials = servicesOptions.credentials.filter((elt) =>
      service.credentials.includes(elt.value)
    );
    credentials.forEach((cred) => {
      orientationStep2Schema[cred.value] = {
        label: cred.label,
        default: [],
        rules: [],
        // rules: [v.isArray([v.isString(), v.maxStrLength(1024)])],
      };
      $orientation[cred.value] = { files: [] };
    });
    service.formsInfo.forEach((form) => {
      orientationStep2Schema[form.name] = {
        label: form.name,
        default: [],
        rules: [],
        // rules: [v.isArray([v.isString(), v.maxStrLength(1024)])],
      };
      $orientation[form.name] = { files: [] };
    });

    if ($userInfo.structures?.length === 1) {
      $orientation.structure = $userInfo.structures[0].slug;
    }
  });

  const concernedPublicLabels = $orientation.concernedPublic.map(
    (concernedPublic) =>
      servicesOptions.concernedPublic.find(
        ({ value }) => value === concernedPublic
      ).label
  );

  const requirementsAndAccessConditionsLabels = [
    ...$orientation.accessConditions.map(
      (accessConditions) =>
        servicesOptions.accessConditions.find(
          ({ value }) => value === accessConditions
        ).label
    ),
    ...$orientation.requirements.map(
      (requirements) =>
        servicesOptions.requirements.find(({ value }) => value === requirements)
          .label
    ),
  ];
</script>

<div>
  {#if $userInfo.structures.length > 1}
    <div class="mb-s32">
      <SelectField
        id="structure"
        placeholder="Nom de la structure active (citée dans le header)"
        description="Vous faites partie de plusieurs structures, veuillez choisir celle qui sera mentionnée dans les e-mails envoyés aux partenaires."
        bind:value={$orientation.structure}
        vertical
        choices={$userInfo.structures.map((struct) => ({
          value: struct.slug,
          label: struct.name,
        }))}
      />
    </div>
  {/if}

  <Fieldset title="Conseiller ou conseillère référente" noTopPadding>
    <Notice type="info" title="Conseiller ou conseillère référente">
      <p class="mb-s0 text-f14 text-gray-text">
        Personne en charge de l'accompagnement et du suivi professionnel de la
        situation du bénéficiaire. Si ce n'est pas vous, veuillez modifier les
        informations ci-dessous.
      </p>
    </Notice>

    <div class="flex flex-row justify-items-stretch gap-s24">
      <div class="flex-1">
        <BasicInputField
          id="referentLastName"
          placeholder=""
          bind:value={$orientation.referentLastName}
          vertical
        />
      </div>
      <div class="flex-1">
        <BasicInputField
          id="referentFirstName"
          placeholder=""
          bind:value={$orientation.referentFirstName}
          vertical
        />
      </div>
    </div>
    <div class="flex flex-row justify-items-stretch gap-s24">
      <div class="flex-1">
        <BasicInputField
          id="referentPhone"
          type="tel"
          description="Format attendu : 0123456789"
          bind:value={$orientation.referentPhone}
          vertical
        />
      </div>
      <div class="flex-1">
        <BasicInputField
          id="referentEmail"
          type="email"
          description="Format attendu : nom@domaine.fr"
          bind:value={$orientation.referentEmail}
          vertical
        />
      </div>
    </div>
  </Fieldset>

  <Fieldset title="Le ou la bénéficiaire">
    <div class="flex flex-row justify-items-stretch gap-s24">
      <div class="flex-1">
        <BasicInputField
          id="beneficiaryLastName"
          placeholder=""
          bind:value={$orientation.beneficiaryLastName}
          vertical
        />
      </div>
      <div class="flex-1">
        <BasicInputField
          id="beneficiaryFirstName"
          placeholder=""
          bind:value={$orientation.beneficiaryFirstName}
          vertical
        />
      </div>
    </div>

    <BasicInputField
      id="beneficiaryDisponibility"
      type="date"
      description=""
      bind:value={$orientation.beneficiaryDisponibility}
      vertical
    >
      <p slot="description" class="legend italic">
        Date à partir de laquelle la personne est disponible. <br />
        Format attendu : JJ/MM/AAAA (par exemple, 17/01/2023 pour 17 janvier 2023)
      </p>
    </BasicInputField>

    {#if requirementsAndAccessConditionsLabels.length || concernedPublicLabels.length}
      <div class="rounded-md bg-info-light px-s20 py-s20">
        <Accordion
          title="Profil et critères du ou de la bénéficiaire"
          subTitle="Récapitulatif des critères que vous avez confirmé à l’étape précédente."
          titleLevel="h3"
          noTitleMargin
          titleClass="text-f18"
          expanded={true}
        >
          <div class="mt-s20">
            {#if concernedPublicLabels.length}
              <h4 class="mb-s6 text-gray-text">
                Profil de votre bénéficiaire :
              </h4>
              <ul class="ml-s20 list-disc">
                {#each concernedPublicLabels as label}
                  <li class="text-gray-text">{label}</li>
                {/each}
              </ul>
            {/if}

            {#if requirementsAndAccessConditionsLabels.length}
              <h4 class="mb-s6 mt-s16 text-gray-text">
                Critères correspondants :
              </h4>
              <ul class="ml-s20 list-disc">
                {#each requirementsAndAccessConditionsLabels as label}
                  <li class="text-gray-text">{label}</li>
                {/each}
              </ul>
            {/if}
          </div>
        </Accordion>
      </div>
    {/if}

    <CheckboxesField
      id="beneficiaryContactPreferences"
      choices={contactPrefOptions}
      bind:value={$orientation.beneficiaryContactPreferences}
      vertical
      verticalOptions
    />

    <div class="flex flex-row justify-items-stretch gap-s24">
      <div class="flex-1">
        <BasicInputField
          id="beneficiaryPhone"
          type="tel"
          description="Format attendu : 0123456789"
          bind:value={$orientation.beneficiaryPhone}
          vertical
        />
      </div>
      <div class="flex-1">
        <BasicInputField
          id="beneficiaryEmail"
          type="email"
          description="Format attendu : nom@domaine.fr"
          bind:value={$orientation.beneficiaryEmail}
          vertical
        />
      </div>
    </div>
    <TextareaField
      id="beneficiaryOtherContactMethod"
      description="Préciser quelle autre méthode de contact est possible"
      bind:value={$orientation.beneficiaryOtherContactMethod}
      vertical
    />

    <TextareaField
      id="orientationReasons"
      forceLabel={`Si besoin, détaillez ici le motif de l’orientation du bénéficiaire ${
        $orientation.beneficiaryFirstName || ""
      }
      ${$orientation.beneficiaryLastName || ""} pour le service "${
        service.name
      }"`}
      description="Merci de ne pas fournir des informations considérés comme sensibles (situation personnelle ou professionnelle autre que celles cochées à l’étape un de la demande, etc.)."
      bind:value={$orientation.orientationReasons}
      vertical
    />

    <Notice
      type="info"
      title="L’accompagnateur s’engage à informer la personne concernée de ce
    traitement de données."
    />
  </Fieldset>

  <Fieldset title="Documents et justificatifs requis">
    {#each service.formsInfo as form}
      {#if $orientation?.[form.name]}
        <UploadField
          label="Document à compléter"
          vertical
          id={form.name}
          structureSlug={service.structure}
          description="Taille maximale : 5 Mo. Formats supportés : jpg, png, doc, pdf"
          bind:fileKeys={$orientation[form.name].files}
        >
          <p slot="description">
            <a href={form.url} class="font-bold underline">
              {formatFilePath(form.name)}
            </a>
          </p>
        </UploadField>
      {/if}
    {/each}

    {#each credentials as cred}{#if $orientation?.[cred.value]}
        <UploadField
          vertical
          id={cred.value}
          structureSlug={service.structure}
          description="Taille maximale : 5 Mo. Formats supportés : jpg, png, doc, pdf"
          bind:fileKeys={$orientation[cred.value].files}
        />
      {/if}
    {/each}
  </Fieldset>
</div>
