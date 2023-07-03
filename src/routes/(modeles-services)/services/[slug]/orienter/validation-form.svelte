<script lang="ts">
  import Fieldset from "$lib/components/display/fieldset.svelte";
  import Notice from "$lib/components/display/notice.svelte";
  import CheckboxesField from "$lib/components/forms/fields/checkboxes-field.svelte";
  import TextareaField from "$lib/components/forms/fields/textarea-field.svelte";

  import { formatFilePath, isNotFreeService } from "$lib/utils/service";
  import { orientation } from "./store";

  export let service;
  export let servicesOptions;
  export let requirementChoices;
  export let accessConditionsChoices;

  const concernedPublicChoices = [
    ...servicesOptions.concernedPublic.filter((elt) =>
      service.concernedPublic.includes(elt.value)
    ),
    { value: "other", label: "Autre (à préciser)" },
  ];
  $: if (!$orientation.concernedPublic?.includes("other")) {
    $orientation.otherConcernedPublic = "";
  }
</script>

<div>
  {#if service.feeCondition && isNotFreeService(service.feeCondition)}
    <Notice type="info" title="Frais à charge du bénéficiaire">
      {service.feeDetails}
    </Notice>
  {/if}

  <Fieldset title="Publics concernés par ce service" noTopPadding>
    <div class="flex flex-col lg:gap-s8">
      <CheckboxesField
        id="concernedPublic"
        choices={concernedPublicChoices}
        description="Merci de cocher au moins un profil ou situation"
        bind:value={$orientation.concernedPublic}
        vertical
      />

      {#if $orientation.concernedPublic?.includes("other")}
        <TextareaField
          id="otherConcernedPublic"
          placeholder=""
          bind:value={$orientation.otherConcernedPublic}
          hideLabel
          vertical
        />
      {/if}
    </div>
  </Fieldset>

  {#if requirementChoices.length !== 0 || accessConditionsChoices.length !== 0}
    <Fieldset title="Critères et conditions d’accès">
      <div class="flex flex-col lg:gap-s8">
        <CheckboxesField
          id="requirements"
          choices={requirementChoices}
          description="Merci de cocher au moins un critère ou une condition"
          bind:value={$orientation.requirements}
          vertical
        />
        <CheckboxesField
          id="accessConditions"
          choices={accessConditionsChoices}
          bind:value={$orientation.accessConditions}
          vertical
          hideLabel
        />
      </div>
    </Fieldset>
  {/if}

  <Fieldset title="Documents et justificatifs requis">
    <Notice
      type="info"
      titleLevel="h3"
      title="Pensez à récupérer et compléter les documents ou justificatifs requis"
    >
      <p class="text-f14 text-gray-text-alt2">
        Une demande incomplète génère en moyenne un retard de traitement de 2
        semaines.
      </p>
    </Notice>

    <div class="flex flex-row gap-s48">
      {#if service.onlineForm || service.formsInfo.length}
        <div>
          {#if service.formsInfo.length}
            <h4 class="mb-s4">Documents à compléter</h4>
            <p class="text-f12 text-gray-text-alt2">
              Téléchargez et complétez les documents requis
            </p>
            <ul class="mb-s16 list-inside list-disc">
              {#each service.formsInfo as form}
                <li>
                  <span class="break-word">
                    <a
                      href={form.url}
                      class="text-f16 text-gray-text underline"
                      download
                    >
                      {formatFilePath(form.name)}
                    </a>
                  </span>
                </li>
              {/each}
            </ul>
          {/if}
          {#if service.onlineForm}
            <h4 class="mb-s4">Liens</h4>
            <p class="text-f12 text-gray-text">
              Informations complémentaires ou formulaires à compléter
            </p>

            <ul class="list-inside list-disc">
              <li>
                <span class="break-word">
                  <a
                    rel="noopener"
                    target="_blank"
                    href={service.onlineForm}
                    class="text-f16 text-gray-text underline"
                    title="Ouverture dans une nouvelle fenêtre"
                  >
                    {service.onlineForm}
                  </a>
                </span>
              </li>
            </ul>
          {/if}
        </div>
      {/if}
      <div>
        <h4 class="mb-s4">Justificatifs à fournir</h4>
        <p class="text-f12 text-gray-text-alt2">
          Liste des documents à récupérer auprès du ou de la bénéficiaire
        </p>

        <ul class="list-inside list-disc">
          {#each service.credentialsDisplay as creds}
            <li class="text-f16 text-gray-text">{creds}</li>
          {:else}
            <li class="text-f16 text-gray-text">
              <span>Aucun</span>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </Fieldset>
</div>
