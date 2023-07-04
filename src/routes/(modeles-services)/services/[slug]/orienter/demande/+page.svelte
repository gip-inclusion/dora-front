<script lang="ts">
  import { get } from "svelte/store";

  import Button from "$lib/components/display/button.svelte";
  import LinkButton from "$lib/components/display/link-button.svelte";
  import StickyFormSubmissionRow from "$lib/components/forms/sticky-form-submission-row.svelte";
  import { getApiURL } from "$lib/utils/api";
  import { token } from "$lib/utils/auth";
  import Layout from "../layout.svelte";
  import type { PageData } from "./$types";
  import { orientation } from "../store";
  import OrientationForm from "./orientation-form.svelte";
  import ContactBox from "../contact-box.svelte";
  import FormErrors from "$lib/components/forms/form-errors.svelte";
  import { orientationStep2Schema } from "../schema";
  import Form from "$lib/components/forms/form.svelte";
  import { goto } from "$app/navigation";
  import { arrowLeftLineIcon } from "$lib/icons";

  export let data: PageData;

  const { service, servicesOptions } = data;

  let requesting = false;

  function handleChange(validatedData) {
    $orientation = { ...validatedData };
  }

  async function handleSubmit(validatedData) {
    const url = `${getApiURL()}/orientation/`;

    const result = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json; version=1.0",
        "Content-Type": "application/json",
        Authorization: `Token ${get(token)}`,
      },
      body: JSON.stringify({
        ...validatedData,
        service: service.slug,
      }),
    });
    const jsonResult = await result.json();
    console.log(jsonResult);
    return result;
  }

  function handleSuccess(_result) {
    goto(`/services/${service.slug}/orienter/merci`);
  }

  $: console.log($orientation);
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
    <p class="mb-s40 max-w-2xl text-f18">
      Ce formulaire collecte les informations nécessaires pour la demande
      d'orientation. Veuillez fournir tous les éléments demandés.
    </p>
    <p>
      Vous recevrez une copie de cette demande, tout comme le ou la
      bénéficiaire.
    </p>

    <div class="mt-s40 flex flex-row justify-between gap-x-s24">
      <OrientationForm {service} {servicesOptions} />
      <div class="w-[384px] shrink-0">
        <ContactBox {service} />
      </div>
    </div>
  </Layout>

  <StickyFormSubmissionRow justifyBetween>
    <LinkButton
      icon={arrowLeftLineIcon}
      to="/services/{data.service.slug}/orienter"
      label="Revenir à l’étape précédente "
      secondary
    />

    <Button id="publish" type="submit" label="Envoyer l'orientation" />
  </StickyFormSubmissionRow>
</Form>