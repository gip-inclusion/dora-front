<script lang="ts">
  import Form from "$lib/components/forms/form.svelte";
  import * as v from "$lib/validation/schema-utils";
  import { userInfo } from "$lib/utils/auth";
  import { onMount } from "svelte";
  import Button from "$lib/components/display/button.svelte";
  import { getApiURL } from "$lib/utils/api";
  import RadioButtonsField from "../forms/fields/radio-buttons-field.svelte";

  let mainActivity = "";
  let requesting = false;

  export let onSuccess;

  const mainActivityOptions = [
    {
      value: "accompagnateur",
      label:
        "Je consulte les offres d‘insertion de mon territoire dans le but de rester informé•e des opportunités existantes et accompagner/orienter mes bénéficiaires",
    },
    {
      value: "offreur",
      label: "Je référence l‘offre de service de ma ou mes structures sur DORA",
    },
    {
      value: "accompagnateur_offreur",
      label:
        "Les deux : je consulte les offres de mon territoire et je référence l‘offre de service de ma ou mes structures",
    },
    {
      value: "autre",
      label: "Autre",
    },
  ];

  const mainActivitySchema: v.Schema = {
    mainActivity: {
      label: "Quels sont vos objectifs lors de l'utilisation de DORA ?",
      default: "",
      required: true,
    },
  };

  onMount(() => {
    if ($userInfo) {
      mainActivity = $userInfo.mainActivity;
    }
  });

  function handleSubmit(validatedData) {
    return fetch(`${getApiURL()}/auth/update-preferences`, {
      method: "POST",
      body: JSON.stringify({
        ...validatedData,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json; version=1.0",
      },
    });
  }

  function handleSuccess(_jsonResult) {
    if (onSuccess) {
      onSuccess();
    }
  }

  $: formData = {
    mainActivity: $userInfo.mainActivity,
  };
</script>

<Form
  bind:data={formData}
  schema={mainActivitySchema}
  onSubmit={handleSubmit}
  onSuccess={handleSuccess}
  bind:requesting
>
  <RadioButtonsField
    id="mainActivity"
    choices={mainActivityOptions}
    description="Veuillez choisir la réponse qui correspond le mieux à votre utilisation actuelle (ou future, si vous venez de vous inscrire)."
    bind:value={mainActivity}
    vertical
  />

  <div class="mt-s32 text-right">
    <Button
      name="validate"
      type="submit"
      label="Valider"
      disabled={requesting}
    />
  </div>
</Form>
