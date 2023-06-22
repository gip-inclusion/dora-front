<script lang="ts">
  import Breadcrumb from "$lib/components/display/breadcrumb.svelte";
  import Form from "$lib/components/forms/form.svelte";
  import EnsureLoggedIn from "$lib/components/hoc/ensure-logged-in.svelte";
  import * as v from "$lib/validation/schema-utils";
  import { userInfo } from "$lib/utils/auth";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import Button from "$lib/components/display/button.svelte";
  import { getApiURL } from "$lib/utils/api";
  import RadioButtonsField from "../forms/fields/radio-buttons-field.svelte";

  let mainActivity = "";
  let requesting = false;

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
    goto("/mon-compte");
  }

  $: formData = {
    mainActivity: $userInfo.mainActivity,
  };
</script>

<EnsureLoggedIn>
  <div class="mb-s32">
    <Breadcrumb currentLocation="preferences" dark />
  </div>

  <div class="flex">
    <div class="flex-[2] rounded-md border border-gray-02 md:relative">
      <div
        class="flex flex-wrap items-center justify-between gap-s12 border-b border-gray-02 px-s35 py-s28"
      >
        <h1 class="m-s0 text-f23 leading-20 text-france-blue">
          Mes préférences
        </h1>
      </div>
      <div class="flex flex-col gap-s35 p-s35">
        <Form
          bind:data={formData}
          schema={mainActivitySchema}
          onSubmit={handleSubmit}
          onSuccess={handleSuccess}
          bind:requesting
        >
          <RadioButtonsField
            id="objectives"
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
      </div>
    </div>
    <div class="flex-1" />
  </div>
</EnsureLoggedIn>
