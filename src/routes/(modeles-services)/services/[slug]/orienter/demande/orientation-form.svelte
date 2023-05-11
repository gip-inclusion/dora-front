<script lang="ts">
  import Fieldset from "$lib/components/display/fieldset.svelte";
  import Notice from "$lib/components/display/notice.svelte";
  import BasicInputField from "$lib/components/forms/fields/basic-input-field.svelte";
  import CheckboxesField from "$lib/components/forms/fields/checkboxes-field.svelte";
  import TextareaField from "$lib/components/forms/fields/textarea-field.svelte";
  // import UploadField from "$lib/components/forms/fields/upload-field.svelte";
  // import { formatFilePath } from "$lib/utils/service";
  import { orientation } from "../store";
  import { orientationStep2Schema } from "../schema";
  import * as v from "$lib/validation/schema-utils";

  export let service;
  export let servicesOptions;

  $: console.log($orientation);

  const contactPrefOptions = [
    { value: "phone", label: "Téléphone" },
    { value: "email", label: "E-mail" },
    { value: "other", label: "Autre" },
  ];

  const credentials = servicesOptions.credentials.filter((elt) =>
    service.credentials.includes(elt.value)
  );
  credentials.forEach((cred) => {
    orientationStep2Schema[cred.value] = {
      label: cred.label,
      default: [],
      rules: [v.isArray([v.isString(), v.maxStrLength(1024)])],
    };
  });
  console.log(credentials);
  console.log(orientationStep2Schema);

  console.log(service);
</script>

<div class="">
  <Fieldset title="Vos coordonnées ou celles de la personne référente ">
    <Notice type="info" title="Personne référente ">
      Professionnel chargé de l’accompagnement et du suivi de la situation de la
      personne concernée par l’orientation.
    </Notice>
    <div class="flex flex-col lg:gap-s8" />
    <BasicInputField
      id="referentLastName"
      placeholder=""
      bind:value={$orientation.referentLastName}
      vertical
    />
    <BasicInputField
      id="referentFirstName"
      placeholder=""
      bind:value={$orientation.referentFirstName}
      vertical
    />
    <BasicInputField
      id="referentPhone"
      type="tel"
      description="Format attendu : 01 23 45 67 89"
      bind:value={$orientation.referentPhone}
      vertical
    />

    <BasicInputField
      id="referentEmail"
      type="email"
      description="Format attendu : nom@domaine.fr"
      bind:value={$orientation.referentEmail}
      vertical
    />
  </Fieldset>

  <Fieldset title="La personne orientée (bénéficiaire)">
    <div class="flex flex-col lg:gap-s8" />
    <BasicInputField
      id="beneficiaryLastName"
      placeholder=""
      bind:value={$orientation.beneficiaryLastName}
      vertical
    />
    <BasicInputField
      id="beneficiaryFirstName"
      placeholder=""
      bind:value={$orientation.beneficiaryFirstName}
      vertical
    />

    <CheckboxesField
      id="beneficiaryContactPreferences"
      choices={contactPrefOptions}
      bind:value={$orientation.beneficiaryContactPreferences}
      vertical
    />

    <BasicInputField
      id="beneficiaryPhone"
      type="tel"
      description="Format attendu : 01 23 45 67 89"
      bind:value={$orientation.beneficiaryPhone}
      vertical
    />

    <BasicInputField
      id="beneficiaryEmail"
      type="email"
      description="Format attendu : nom@domaine.fr"
      bind:value={$orientation.beneficiaryEmail}
      vertical
    />

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
      ><p slot="description" class="legend">
        Date à partir de laquelle la personne est disponible. <br />
        Format attendu : JJ/MM/AAAA (par exemple, 17/01/2023 pour 17 janvier 2023)
      </p></BasicInputField
    >
  </Fieldset>

  <Fieldset title="Documents et justificatifs requis ">
    {#each credentials as cred}
      <!-- <UploadField
        id={cred.value}
        structureSlug={service.structure}
        on:blur
        bind:fileKeys={cred.value}
      /> -->
    {/each}

    <!-- <div class="flex flex-row  gap-s48">
      <div>
        <h4>Documents à compléter</h4>
        <ul class="list-inside list-disc">
          {#each service.formsInfo as form}
            <li>
              <span class="break-word">
                <a href={form.url} class="underline" download
                  >{formatFilePath(form.name)}</a
                >
              </span>
            </li>
          {/each}
        </ul>
      </div>
      <div>
        <h4>Justificatifs à fournir</h4>
        <ul class="list-inside list-disc">
          {#each service.credentialsDisplay as creds}
            <li>{creds}</li>
          {:else}
            <li><span>Aucun</span></li>
          {/each}
        </ul>
      </div>
    </div> -->
  </Fieldset>

  <Fieldset title="Motif de l’orientation">
    <div class="flex flex-col lg:gap-s8" />
    <h4>
      Si besoin, détaillez ici le motif de l’orientation de {$orientation.beneficiaryFirstName}
      {$orientation.beneficiaryLastName} pour le service {service.name}
    </h4>
    <TextareaField
      id="orientationReasons"
      description=""
      bind:value={$orientation.orientationReasons}
      vertical
    />
  </Fieldset>
</div>
