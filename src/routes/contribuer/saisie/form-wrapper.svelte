<script lang="ts">
  import { goto } from "$app/navigation";
  import Alert from "$lib/components/display/alert.svelte";
  import Button from "$lib/components/display/button.svelte";
  import CenteredGrid from "$lib/components/display/centered-grid.svelte";
  import Form from "$lib/components/hoc/form.svelte";
  import { publishServiceSuggestion } from "$lib/requests/services";
  import { serviceSubmissionTimeMeter } from "$lib/stores/service-submission-time-meter";
  import { contribSchema } from "$lib/validation/schemas/service";
  import { formErrors } from "$lib/validation/validation";
  import debounce from "lodash.debounce";
  import { onDestroy, onMount } from "svelte";
  import Fields from "./fields.svelte";

  export let servicesOptions, source;
  let requesting = false;

  console.log(contribSchema.shape);
  let service = contribSchema.parse({});
  console.log(service);
  // Object.fromEntries(
  //   Object.entries(contribSchema.shape).map(([fieldName, props]) => [
  //     fieldName,
  //     props.default,
  //   ])
  // );

  let errorDiv;
  // const requiredFields = Object.keys(contribSchema).filter(
  //   (k) => contribSchema[k].required
  // );

  let currentPageIsValid = false;

  // $: currentPageIsValid = requiredFields.every((f) =>
  //   Array.isArray(service[f]) ? service[f].length : service[f]
  // );

  function handleChange(validatedData) {
    service = { ...service, ...validatedData };
  }

  function handleSubmit(validatedData) {
    return publishServiceSuggestion(validatedData, source);
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
    $formErrors = {};
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
    $formErrors = {};
    clearInterval(intervalId);
  });
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
      <div bind:this={errorDiv}>
        {#each $formErrors.nonFieldErrors || [] as msg}
          <Alert label={msg} />
        {/each}
      </div>
      <Fields bind:service {servicesOptions} />
    </Form>
  </div>
</CenteredGrid>

{#if service.siret}
  <CenteredGrid>
    <Button
      on:submit
      name="validate"
      type="submit"
      label="Envoyer la contribution"
      disabled={requesting || !currentPageIsValid}
    />
  </CenteredGrid>
{/if}
