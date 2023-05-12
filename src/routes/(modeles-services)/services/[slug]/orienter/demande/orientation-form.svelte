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
  // import * as v from "$lib/validation/schema-utils";
  import { onMount } from "svelte";

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
  });
</script>

<div class="">
  <Fieldset title="Vos coordonnées ou celles de la personne référente ">
    <Notice type="info" title="Personne référente ">
      Professionnel chargé de l’accompagnement et du suivi de la situation de la
      personne concernée par l’orientation.
    </Notice>
    <div class="flex flex-col lg:gap-s8" />

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
          description="Format attendu : 01 23 45 67 89"
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

  <Fieldset title="La personne orientée (bénéficiaire)">
    <div class="flex flex-col lg:gap-s8" />
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
    <CheckboxesField
      id="beneficiaryContactPreferences"
      choices={contactPrefOptions}
      bind:value={$orientation.beneficiaryContactPreferences}
      vertical
    />

    <div class="flex flex-row justify-items-stretch gap-s24">
      <div class="flex-1">
        <BasicInputField
          id="beneficiaryPhone"
          type="tel"
          description="Format attendu : 01 23 45 67 89"
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
      description="Préciser quelle autre méthode de contact est préférable  "
      bind:value={$orientation.beneficiaryOtherContactMethod}
      vertical
    />

    <BasicInputField
      id="beneficiaryDisponibility"
      type="date"
      description=""
      bind:value={$orientation.beneficiaryDisponibility}
      vertical
      ><p slot="description" class="legend italic">
        Date à partir de laquelle la personne est disponible. <br />
        Format attendu : JJ/MM/AAAA (par exemple, 17/01/2023 pour 17 janvier 2023)
      </p></BasicInputField
    >
  </Fieldset>

  <Fieldset title="Documents et justificatifs requis ">
    {#each service.formsInfo as form}
      {#if $orientation?.[form.name]}
        <UploadField
          label="Document à compléter"
          vertical
          id={form.name}
          structureSlug={service.structure}
          description="Taille maximale : 500 Mo. Formats supportés : jpg, png, doc, pdf"
          bind:fileKeys={$orientation[form.name].files}
          disabled
        >
          <p slot="description">
            <a href={form.url} class="font-bold underline"
              >{formatFilePath(form.name)}</a
            >
          </p>
        </UploadField>
      {/if}
    {/each}

    {#each credentials as cred}{#if $orientation?.[cred.value]}
        <UploadField
          vertical
          id={cred.value}
          structureSlug={service.structure}
          description="Taille maximale : 500 Mo. Formats supportés : jpg, png, doc, pdf"
          bind:fileKeys={$orientation[cred.value].files}
          disabled
        />
      {/if}
    {/each}
  </Fieldset>

  <Fieldset title="Motif de l’orientation">
    <div class="flex flex-col lg:gap-s8" />
    <h4>
      Si besoin, détaillez ici le motif de l’orientation de {$orientation.beneficiaryFirstName ||
        ""}
      {$orientation.beneficiaryLastName || ""} pour le service {service.name}
    </h4>
    <TextareaField
      id="orientationReasons"
      description=""
      bind:value={$orientation.orientationReasons}
      vertical
    />
  </Fieldset>
</div>
