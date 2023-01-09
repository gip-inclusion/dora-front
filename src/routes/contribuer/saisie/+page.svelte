<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/display/button.svelte";
  import CenteredGrid from "$lib/components/display/centered-grid.svelte";
  import FormErrors from "$lib/components/display/form-errors.svelte";
  import Form from "$lib/components/hoc/form.svelte";
  import { publishServiceSuggestion } from "$lib/requests/services";
  import { serviceSubmissionTimeMeter } from "$lib/stores/service-submission-time-meter";
  import type { Service } from "$lib/types";
  import { contribSchema } from "$lib/validation/schemas/service";
  import debounce from "lodash.debounce";
  import { onDestroy, onMount } from "svelte";
  import type { PageData } from "./$types";
  import Fields from "./fields.svelte";

  let requesting = false;

  // TODO: Ajouter le type Contribution
  let service: Service = Object.fromEntries(
    Object.entries(contribSchema).map(([fieldName, props]) => [
      fieldName,
      props.default,
    ])
  );

  function handleChange(validatedData) {
    console.log("change");
    service = { ...service, ...validatedData };
  }

  function handleSubmit(validatedData) {
    console.log("submit", validatedData);
    return publishServiceSuggestion(validatedData, data.source);
  }

  async function handleSuccess(result) {
    serviceSubmissionTimeMeter.setId(
      encodeURIComponent(`${result.data.siret}--${result.data.name}`)
    );
    goto(`/contribuer/merci`);
  }

  // Counter for filling duration
  let intervalId;
  let lastUserActivity, userIsInactive;

  // Note: we use debounce to limit update frequency
  const updateLastUserActivity = debounce(() => {
    lastUserActivity = Date.now();
  }, 500);

  onMount(() => {
    serviceSubmissionTimeMeter.clear(); // reset tracking values
    lastUserActivity = Date.now();

    intervalId = setInterval(() => {
      userIsInactive = (Date.now() - lastUserActivity) / 1000 > 120; // 2 minutes
      if (document.hasFocus() && !userIsInactive) {
        serviceSubmissionTimeMeter.incrementDuration();
      }
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(intervalId);
  });

  export let data: PageData;
</script>

<svelte:window
  on:keydown={updateLastUserActivity}
  on:mousemove={updateLastUserActivity}
  on:touchmove={updateLastUserActivity}
/>

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
  <FormErrors />
</CenteredGrid>

<CenteredGrid bgColor="bg-gray-bg">
  <div class="lg:w-2/3">
    <Form
      data={service}
      schema={contribSchema}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      bind:requesting
    >
      <Fields bind:service servicesOptions={data.servicesOptions} />

      {#if service.siret}
        <div class="mt-s32 flex flex-col justify-end md:flex-row ">
          <Button
            name="validate"
            type="submit"
            label="Envoyer la contribution"
            disabled={requesting}
          />
        </div>
      {/if}
    </Form>
  </div>
</CenteredGrid>
