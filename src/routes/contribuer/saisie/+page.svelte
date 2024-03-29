<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/display/button.svelte";
  import CenteredGrid from "$lib/components/display/centered-grid.svelte";
  import FormErrors from "$lib/components/forms/form-errors.svelte";
  import StickyFormSubmissionRow from "$lib/components/forms/sticky-form-submission-row.svelte";
  import Form from "$lib/components/forms/form.svelte";
  import { publishServiceSuggestion } from "$lib/requests/admin";
  import type { Establishment, Service } from "$lib/types";
  import { contribSchema } from "$lib/validation/schemas/service";
  import StructureSearch from "$lib/components/specialized/establishment-search/search.svelte";

  import type { PageData } from "./$types";
  import ContributionEditionFields from "./contribution-edition-fields.svelte";

  export let data: PageData;

  let establishment: Establishment = undefined;
  let requesting = false;

  // TODO: Ajouter le type Contribution
  let contribution: Service = Object.fromEntries(
    Object.entries(contribSchema).map(([fieldName, props]) => [
      fieldName,
      props.default,
    ])
  );

  function handleChange(validatedData) {
    contribution = { ...contribution, ...validatedData };
  }

  function handleSubmit(validatedData) {
    return publishServiceSuggestion(validatedData, data.source);
  }

  function handleSuccess(_result) {
    goto(`/contribuer/merci`);
  }

  function handleStructureCityChange() {
    contribution.siret = "";
  }

  function handleEstablishmentChange(newEstablishment) {
    contribution.siret = newEstablishment?.siret;
  }
</script>

<CenteredGrid>
  <div class="text-center">
    <h1 class="text-f45 text-france-blue">Proposez un service</h1>
    <div class="paragraph-small mt-s16">
      Aidez-nous à identifier et référencer l’ensemble de l’offre de
      l’insertion.<br />
      Seuls les champs marqués d’un astérisque<span
        style="color: var(--col-error);">*</span
      > sont obligatoires.
    </div>
  </div>
</CenteredGrid>

<CenteredGrid>
  <div class="lg:w-2/3">
    <StructureSearch
      onEstablishmentChange={handleEstablishmentChange}
      onCityChange={handleStructureCityChange}
      bind:establishment
    />

    <FormErrors />
  </div>
</CenteredGrid>

<Form
  bind:data={contribution}
  schema={contribSchema}
  onChange={handleChange}
  onSubmit={handleSubmit}
  onSuccess={handleSuccess}
  bind:requesting
>
  <CenteredGrid>
    <div class="lg:w-2/3">
      <ContributionEditionFields
        bind:contribution
        servicesOptions={data.servicesOptions}
        {establishment}
      />
    </div>
  </CenteredGrid>
  {#if contribution.siret}
    <StickyFormSubmissionRow>
      <Button
        name="validate"
        type="submit"
        label="Envoyer la contribution"
        disabled={requesting}
      />
    </StickyFormSubmissionRow>
  {/if}
</Form>
