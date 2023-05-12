<script lang="ts">
  import Fieldset from "$lib/components/display/fieldset.svelte";
  import Notice from "$lib/components/display/notice.svelte";
  import CheckboxesField from "$lib/components/forms/fields/checkboxes-field.svelte";
  import TextareaField from "$lib/components/forms/fields/textarea-field.svelte";

  import { formatFilePath, isNotFreeService } from "$lib/utils/service";
  import { orientation } from "./store";

  export let service;
  export let servicesOptions;
  $: console.log($orientation.hasOtherConcernedPublic);
</script>

<div class="">
  {#if isNotFreeService(service.feeCondition)}
    <Notice type="warning" title="Frais à charge du bénéficiaire">
      {service.feeDetails}
    </Notice>
  {/if}

  <Fieldset title="Publics concernés par ce service">
    <div class="flex flex-col lg:gap-s8">
      <CheckboxesField
        id="concernedPublic"
        choices={servicesOptions.concernedPublic.filter((elt) =>
          service.concernedPublic.includes(elt.value)
        )}
        bind:value={$orientation.concernedPublic}
        vertical
      />

      <CheckboxesField
        id="hasOtherConcernedPublic"
        choices={[{ value: "other", label: "Autre (à préciser)" }]}
        bind:value={$orientation.hasOtherConcernedPublic}
        hideLabel
        vertical
      />

      {#if $orientation.hasOtherConcernedPublic?.length}
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

  <Fieldset title="Critères et conditions d’accès">
    <div class="flex flex-col lg:gap-s8">
      <CheckboxesField
        id="requirements"
        choices={servicesOptions.requirements.filter((elt) =>
          service.requirements.includes(elt.value)
        )}
        bind:value={$orientation.requirements}
        vertical
      />
      <CheckboxesField
        id="accessConditions"
        choices={servicesOptions.accessConditions.filter((elt) =>
          service.accessConditions.includes(elt.value)
        )}
        bind:value={$orientation.accessConditions}
        vertical
        hideLabel
      />
    </div>
  </Fieldset>

  <Fieldset title="Documents et justificatifs requis ">
    {#if true}
      <Notice type="warning" title="Documents requis">
        Assurez-vous d’avoir complété les documents demandés et rassemblé les
        justificatifs à fournir afin de transmettre un dossier complet. Une
        demande d’orientation incomplète génère en moyenne un retard de
        traitement de 2 semaines.
      </Notice>
    {/if}
    <div class="flex flex-row  gap-s48">
      {#if service.onlineForm || service.formsInfo.length}
        <div>
          {#if service.formsInfo.length}
            <h4>Documents à compléter</h4>
            <ul class="mb-s16 list-inside list-disc">
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
          {/if}
          {#if service.onlineForm}
            <h4>Lien</h4>
            <ul class="list-inside list-disc">
              <li>
                <span class="break-word">
                  <a
                    rel="noopener"
                    target="_blank"
                    href={service.onlineForm}
                    class="underline"
                    title="Ouverture dans une nouvelle fenêtre"
                    >{service.onlineForm}</a
                  >
                </span>
              </li>
            </ul>
          {/if}
        </div>
      {/if}
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
    </div>
  </Fieldset>
</div>
