<script lang="ts">
  import Button from "$lib/components/display/button.svelte";
  import FieldWrapper from "$lib/components/inputs/field-wrapper.svelte";

  // import { getApiURL } from "$lib/utils/api";
  import {
    // isSiret,
    // isString,
    siretRegexp,
    // trim,
  } from "$lib/validation/schemas/utils";

  export let onEstablishmentChange = null;
  export let siret = "";

  let requesting = false;
  let siretIsValid = false;

  $: siretIsValid = !!siret?.match(siretRegexp);

  // const siretSearchSchema = {
  //   siret: {
  //     label: "Numéro SIRET",
  //     default: "",
  //     required: true,
  //     rules: [isString(), isSiret()],
  //     post: [trim],
  //     maxLength: 14,
  //   },
  // };

  // const serverErrors = {
  //   // eslint-disable-next-line
  //   nonFieldErrors: { not_found: "Numéro Siret non reconnu." },
  // };

  // async function siretSearch(s) {
  //   const url = `${getApiURL()}/search-siret/?siret=${encodeURIComponent(s)}`;

  //   return fetch(url, {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json; version=1.0",
  //     },
  //   });
  // }

  // async function handleSubmit(validatedData) {
  //   if (onEstablishmentChange) onEstablishmentChange({});

  //   return siretSearch(validatedData.siret);
  // }

  // function handleSuccess(establishment) {
  //   if (onEstablishmentChange) onEstablishmentChange(establishment);
  // }

  $: formData = { siret };
</script>

<!-- <FormErrors />

<Form
  bind:data={formData}
  schema={siretSearchSchema}
  serverErrorsDict={serverErrors}
  onSubmit={handleSubmit}
  onSuccess={handleSuccess}
  bind:requesting
> -->
<div class="flex gap-s12">
  <div class="flex grow">
    <FieldWrapper
      id="siret-select"
      let:onBlur
      let:onChange
      label="xxx"
      required
      description="Sur 14 chiffres"
      vertical
    >
      <slot slot="description" name="description" />

      <div class="flex flex-col">
        <input
          id="siret-select"
          type="text"
          bind:value={siret}
          on:blur={onBlur}
          on:change={onChange}
          placeholder="1234567891234"
        />
        {#if siret}
          <div
            class="mt-s4 self-end text-f12 text-gray-text-alt"
            class:text-error={siret.length > 14}
          >
            {siret?.length}/14 caractères
          </div>
        {/if}
      </div>
    </FieldWrapper>

    {#if requesting}
      <p class="py-s12 px-s8 lg:px-s20">Chargement…</p>
    {:else}
      <Button label="Rechercher" disabled={!siretIsValid} type="submit" />
    {/if}
  </div>
</div>
