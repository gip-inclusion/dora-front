<script lang="ts">
  import Button from "$lib/components/display/button.svelte";
  import LinkButton from "$lib/components/display/link-button.svelte";
  import Form from "$lib/components/forms/form.svelte";
  import StickyFormSubmissionRow from "$lib/components/forms/sticky-form-submission-row.svelte";
  import ContactBox from "./contact-box.svelte";
  import Layout from "./layout.svelte";
  import ValidationForm from "./validation-form.svelte";
  import { orientation } from "./store";
  import FormErrors from "$lib/components/forms/form-errors.svelte";
  import { orientationStep1Schema } from "./schema";
  import { goto } from "$app/navigation";

  export let data;

  const { service, servicesOptions } = data;

  let requesting = false;

  function handleChange(validatedData) {
    $orientation = { ...validatedData };
  }

  function handleSubmit(_validatedData) {
    // Pas de soumission au backend à cette étape
    return { ok: true };
  }

  function handleSuccess(_result) {
    goto(`/services/${service.slug}/orienter/demande`);
  }
</script>

<FormErrors />

<Form
  bind:data={$orientation}
  schema={orientationStep1Schema}
  disableExitWarning
  onChange={handleChange}
  onSubmit={handleSubmit}
  onSuccess={handleSuccess}
  bind:requesting
>
  <Layout {data}>
    <p class="legend">Étape 1 sur 2</p>
    <h2>Valider la conformité</h2>
    <p class="legend">
      <strong>Étape suivante</strong>&nbsp;: Compléter la demande
    </p>
    <hr class="my-s40" />
    <p class="mb-s40 max-w-2xl">
      Lors de cette étape, vous pouvez vérifier l'éligibilité du bénéficiaire et
      consulter la liste des documents requis avant de commencer la procédure
      d'orientation.
    </p>

    <div class=" flex flex-row justify-between gap-x-s24">
      <ValidationForm {service} {servicesOptions} />
      <div class="w-[384px] shrink-0">
        <ContactBox {service} />
      </div>
    </div>
  </Layout>
  <StickyFormSubmissionRow justifyBetween>
    <LinkButton
      to="/services/{service.slug}/orienter"
      label="Retour à la fiche"
      secondary
    />

    <Button id="publish" type="submit" label="Étape suivante" />
  </StickyFormSubmissionRow>
</Form>
