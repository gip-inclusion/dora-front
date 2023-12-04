<script lang="ts">
  import Button from "$lib/components/display/button.svelte";
  import CenteredGrid from "$lib/components/display/centered-grid.svelte";
  import Fieldset from "$lib/components/display/fieldset.svelte";
  import BasicInputField from "$lib/components/forms/fields/basic-input-field.svelte";
  import FormErrors from "$lib/components/forms/form-errors.svelte";
  import Form from "$lib/components/forms/form.svelte";
  import EnsureLoggedIn from "$lib/components/hoc/ensure-logged-in.svelte";
  import StructureSearch from "$lib/components/specialized/establishment-search/search.svelte";
  import { alertIcon } from "$lib/icons";
  import { siretWasAlreadyClaimed } from "$lib/requests/structures";
  import { getApiURL } from "$lib/utils/api";
  import * as v from "$lib/validation/schema-utils";
  import { structureSchema } from "$lib/validation/schemas/structure";
  import type { PageData } from "./$types";
  import { goto } from "$app/navigation";
  import { token } from "$lib/utils/auth";
  import { get } from "svelte/store";
  import type { StructuresOptions } from "$lib/types";

  export let data: PageData;
  export let structuresOptions: StructuresOptions;
  export let modify = false;
  export let onRefresh: (() => Promise<void>) | undefined = undefined;

  const schema = {
    email: {
      label: "Courriel",
      default: "",
      rules: [v.isEmail(), v.maxStrLength(254)],
      post: [v.lower, v.trim],
      maxLength: 254,
      required: true,
    },
  };
  let requesting = false;

  const serverErrors = {
    _default: {},
    siret: { unique: "Cette structure existe déjà" },
  };

  const defaultStructure = Object.fromEntries(
    Object.entries(structureSchema).map(([fieldName, props]) => [
      fieldName,
      props.default,
    ])
  );
  let structure = JSON.parse(JSON.stringify(defaultStructure));
  let alreadyClaimedEstablishment;

  function handleChange(_validatedData) {}

  function handleSubmit(validatedData) {
    const url = `${getApiURL()}/auth/invite-first-admin/`;
    const method = "POST";
    return fetch(url, {
      method,
      headers: {
        Accept: "application/json; version=1.0",
        "Content-Type": "application/json",

        Authorization: `Token ${get(token)}`,
      },
      body: JSON.stringify({
        siret: structure.siret,
        inviteeEmail: validatedData.email,
      }),
    });
  }

  async function handleSuccess(result) {
    if (modify && onRefresh) {
      await onRefresh();
    }
    goto(`/invite-first-admin/${result.slug}`);
  }

  function handleCityChange(_city) {
    structure = JSON.parse(JSON.stringify(defaultStructure));
  }

  async function establishmentAlreadyCreated(siret) {
    const result = await siretWasAlreadyClaimed(siret);
    if (result.ok) {
      return result.result;
    }
    return false;
  }

  async function handleEstablishmentChange(establishment) {
    alreadyClaimedEstablishment = null;
    structure = JSON.parse(JSON.stringify(defaultStructure));
    if (establishment) {
      alreadyClaimedEstablishment = await establishmentAlreadyCreated(
        establishment.siret
      );
      if (!alreadyClaimedEstablishment) {
        structure.siret = establishment.siret;
        structure.name = establishment.name;
        structure.address1 = establishment.address1;
        structure.address2 = establishment.address2;
        structure.city = establishment.city;
        structure.cityCode = establishment.cityCode;
        structure.postalCode = establishment.postalCode;
        structure.ape = establishment.ape;
        structure.longitude = establishment.longitude;
        structure.latitude = establishment.latitude;
      }
    }
  }
</script>

<EnsureLoggedIn>
  <CenteredGrid extraClass="max-w-3xl m-auto">
    <h1 class="mb-s64 text-center text-france-blue">Ajouter une structure</h1>

    <FormErrors />

    <StructureSearch
      title="Identifier la structure"
      onEstablishmentChange={handleEstablishmentChange}
      onCityChange={handleCityChange}
    />

    {#if alreadyClaimedEstablishment}
      <div
        class="mt-s16 flex flex-row items-center justify-center pt-s4 text-f18 text-error"
      >
        <div class="mr-s8 h-s24 w-s24 fill-current">
          {@html alertIcon}
        </div>
        <p class="m-s0">
          Cette structure a déjà été saisie dans DORA. Vous pouvez la
          <a
            class="underline"
            href="/structures/{alreadyClaimedEstablishment?.slug}"
          >
            visualiser</a
          >.
        </p>
      </div>
    {/if}
    <FormErrors />
    {#if structure.siret || true}
      <Form
        bind:data={structure}
        serverErrorsDict={serverErrors}
        {schema}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
        bind:requesting
      >
        <Fieldset
          title="Premier administrateur"
          description="Saisissez le courriel de l’administrateur à inviter"
        >
          <BasicInputField
            type="email"
            id="email"
            bind:value={structure.email}
            description="Format attendu&nbsp;: mail@domaine.fr"
            vertical
          />
        </Fieldset>

        <div class="mt-s32 flex flex-col justify-end gap-s16 md:flex-row">
          <Button
            name="validate"
            type="submit"
            label="Envoyer l’invitation"
            disabled={requesting}
          />
        </div>
      </Form>
    {/if}
  </CenteredGrid>
</EnsureLoggedIn>
