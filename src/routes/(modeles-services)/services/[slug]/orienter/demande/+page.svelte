<script lang="ts">
  import Button from "$lib/components/display/button.svelte";
  import LinkButton from "$lib/components/display/link-button.svelte";
  import StickyFormSubmissionRow from "$lib/components/forms/sticky-form-submission-row.svelte";
  import Layout from "../layout.svelte";
  import type { PageData } from "./$types";
  import { orientation } from "../store";
  import OrientationForm from "./orientation-form.svelte";
  import ContactBox from "../contact-box.svelte";
  import FormErrors from "$lib/components/forms/form-errors.svelte";
  import { orientationStep2Schema } from "../schema";
  import Form from "$lib/components/forms/form.svelte";
  import { goto } from "$app/navigation";

  export let data: PageData;

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
    goto(`/services/${service.slug}/orienter/merci`);
  }
</script>

<FormErrors />

<Form
  bind:data={$orientation}
  schema={orientationStep2Schema}
  disableExitWarning
  onChange={handleChange}
  onSubmit={handleSubmit}
  onSuccess={handleSuccess}
  bind:requesting
>
  <Layout {data}>
    <p class="legend">Étape 2 sur 2</p>

    <h2>Compléter la demande</h2>
    <hr class="my-s40" />
    <p class="mb-s40 max-w-2xl">
      Ce formulaire collecte les informations nécessaires pour réaliser une
      demande d’orientation. Incluant les informations du bénéficiaire, la
      personne référente, et les documents requis. Une copie de cette demande
      vous sera transmise, ainsi qu’au bénéficiaire.
    </p>

    <div class=" flex flex-row justify-between gap-x-s24">
      <OrientationForm {service} {servicesOptions} />
      <div class="w-[384px] shrink-0">
        <ContactBox {service} />
      </div>
    </div>
  </Layout>

  <StickyFormSubmissionRow justifyBetween>
    <LinkButton
      to="/services/{data.service.slug}/orienter"
      label="Revenir à l’étape précédente "
      secondary
    />

    <Button id="publish" type="submit" label="Envoyer l'orientation" />
  </StickyFormSubmissionRow>
</Form>
