<script lang="ts">
  import Breadcrumb from "$lib/components/display/breadcrumb.svelte";
  import Form from "$lib/components/forms/form.svelte";
  import EnsureLoggedIn from "$lib/components/hoc/ensure-logged-in.svelte";
  import type { PageData } from "./$types";
  import * as v from "$lib/validation/schema-utils";
  import { userInfo } from "$lib/utils/auth";
  import { onMount } from "svelte";
  import CheckboxesField from "$lib/components/forms/fields/checkboxes-field.svelte";
  import { goto } from "$app/navigation";
  import MultiSelectField from "$lib/components/forms/fields/multi-select-field.svelte";
  import Button from "$lib/components/display/button.svelte";
  import { getApiURL } from "$lib/utils/api";

  export let data: PageData;

  let objectives: string[] = [],
    mostSearchedCategories: string[] = [];
  let requesting = false;

  const objectivesOptions = [
    {
      value: "consult-offers",
      label:
        "Je consulte les offres d'insertion de mon territoire dans le but de rester informée des offres existantes et accompagner/orienter mes bénéficiaires",
    },
    {
      value: "create-my-services",
      label: "Je référence l'offre de service de ma ou mes structures sur DORA",
    },
    {
      value: "structure-admin",
      label:
        "Je suis administrateur de ma structure sur DORA - je suis responsable du référencement adéquat de celle-ci sur DORA et je gère la liste des collaborateurs",
    },
    {
      value: "categories-or-territory-manager",
      label:
        "Je suis responsable du pilotage et de l'animation du déploiement de DORA sur mon territoire ou dans un domaine/thématique spécifique",
    },
  ];

  const preferencesSchema: v.Schema = {
    objectives: {
      label: "Quels sont vos objectifs lors de l'utilisation de DORA ?",
      default: [],
      rules: [v.isArray([v.isString(), v.maxStrLength(255)])],
      required: true,
    },
    mostSearchedCategories: {
      label:
        "Quels sont les thématiques pour lesquelles vous réalisez le plus de recherches ?",
      default: [],
      rules: [
        v.isArray([v.isString(), v.maxStrLength(255)]),
        v.arrMaxLength(3, "Vous avez choisi plus de 3 thématiques"),
      ],
      required: true,
    },
  };

  onMount(() => {
    if ($userInfo) {
      objectives = $userInfo.objectives;
      mostSearchedCategories = $userInfo.mostSearchedCategories;
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
    objectives,
    mostSearchedCategories,
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
          schema={preferencesSchema}
          onSubmit={handleSubmit}
          onSuccess={handleSuccess}
          bind:requesting
        >
          <CheckboxesField
            id="objectives"
            choices={objectivesOptions}
            description="Plusieurs choix possibles"
            bind:value={objectives}
            vertical
          />

          <div class="mt-s32">
            <MultiSelectField
              id="mostSearchedCategories"
              bind:value={mostSearchedCategories}
              choices={data.servicesOptions.categories}
              placeholder="Sélectionner"
              placeholderMulti="Sélectionner"
              description="Trois choix maximum"
              sort
              vertical
            />
          </div>

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
