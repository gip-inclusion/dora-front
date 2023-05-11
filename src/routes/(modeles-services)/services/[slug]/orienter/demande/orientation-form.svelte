<script lang="ts">
  import Fieldset from "$lib/components/display/fieldset.svelte";
  import Notice from "$lib/components/display/notice.svelte";
  import { formatFilePath } from "$lib/utils/service";
  import { orientation } from "../store";

  export let service;
  export let servicesOptions;

  $: console.log($orientation);
</script>

<div class="">
  <Fieldset title="Personne référente ">
    <Notice type="info" title="Frais à charge du bénéficiaire">
      Professionnel chargé de l’accompagnement et du suivi de la situation de la
      personne concernée par l’orientation.
    </Notice>
    <div class="flex flex-col lg:gap-s8" />
  </Fieldset>

  <Fieldset title="La personne orientée (bénéficiaire)">
    <div class="flex flex-col lg:gap-s8" />
  </Fieldset>

  <Fieldset title="Documents et justificatifs requis ">
    <div class="flex flex-row  gap-s48">
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
    </div>
  </Fieldset>

  <Fieldset title="Motif de l’orientation">
    <div class="flex flex-col lg:gap-s8" />
  </Fieldset>
</div>
