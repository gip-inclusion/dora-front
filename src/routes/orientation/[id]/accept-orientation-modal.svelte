<script lang="ts">
  import Modal from "$lib/components/hoc/modal.svelte";
  import Form from "$lib/components/forms/form.svelte";
  import * as v from "$lib/validation/schema-utils";
  import Button from "$lib/components/display/button.svelte";
  import TextareaField from "$lib/components/forms/fields/textarea-field.svelte";
  import { acceptOrientation } from "$lib/utils/orientation";
  import BasicInputField from "$lib/components/forms/fields/basic-input-field.svelte";
  import CheckboxesField from "$lib/components/forms/fields/checkboxes-field.svelte";
  import type { SendOrientation } from "$lib/types";
  import ConfirmationBloc from "./confirmation-bloc.svelte";

  export let isOpen = false;
  export let onRefresh;
  export let orientation: SendOrientation;

  let showConfirmation = false;

  let requesting = false;

  const acceptOrientationSchema: v.Schema = {
    response: {
      label: "Message de réponse",
      default: "",
      required: true,
      rules: [v.maxStrLength(1000)],
      maxLength: 1000,
    },
    orientationStartDate: {
      label: "Date d’entrée en parcours",
      default: "",
      rules: [v.isDate()],
    },
    orientationEndDate: {
      label: "Date de sortie du parcours",
      default: "",
      rules: [v.isDate()],
    },
    orientationLocation: {
      label: "Lieu de déroulement",
      default: "",
      rules: [v.maxStrLength(1000)],
      maxLength: 1000,
    },
    addExtraRecipients: {
      label: "Informer d’autres personnes",
      default: [],
      rules: [v.isArray([v.isString(), v.maxStrLength(255)])],
    },
    extraRecipients: {
      label: "Courriel des personnes à informer",
      default: false,
      rules: [v.maxStrLength(1000)],
      maxLength: 1000,
    },
    addBeneficiaryMessage: {
      label: "Ajouter un message pour le ou la bénéficiaire",
      default: [],
      rules: [v.isArray([v.isString(), v.maxStrLength(255)])],
    },
    beneficiaryMessage: {
      label: "Message pour le ou la bénéficiaire",
      default: false,
      rules: [v.maxStrLength(1000)],
      maxLength: 1000,
    },
  };

  async function handleSubmit(validatedData) {
    await acceptOrientation(orientation.queryId, validatedData);
    await onRefresh();
  }

  function handleSuccess(_jsonResult) {
    showConfirmation = true;
  }

  $: formData = {
    response: "",
    orientationStartDate: "",
    orientationEndDate: "",
    orientationLocation: "",
    addExtraRecipients: [] as string[],
    extraRecipients: "",
    addBeneficiaryMessage: [] as string[],
    beneficiaryMessage: "",
  };
  $: if (formData.addExtraRecipients.length > 0) {
    acceptOrientationSchema.extraRecipients.required = true;
  } else {
    acceptOrientationSchema.extraRecipients.required = false;
    formData.extraRecipients = "";
  }

  $: if (formData.addBeneficiaryMessage.length > 0) {
    acceptOrientationSchema.beneficiaryMessage.required = true;
  } else {
    acceptOrientationSchema.beneficiaryMessage.required = false;
    formData.beneficiaryMessage = "";
  }
</script>

<Modal
  bind:isOpen
  on:close$
  title="Accepter la demande"
  overflow
  width="medium"
>
  <div slot="subtitle">
    Vous êtes sur le point de valider une demande d’orientation qui vous a été
    adressée par {orientation.referentFirstName}
    {orientation.referentLastName} pour le service «
    <a class="text-magenta-cta" href="/services/{orientation.service?.slug}">
      {orientation.service?.name}
    </a>
  </div>

  {#if showConfirmation}
    <ConfirmationBloc
      title="Votre réponse a été transmise"
      subtitle="Le prescripteur et le bénéficiaire seront informés par e-mail de votre décision. "
      withThunder
    />
  {:else}
    <Form
      bind:data={formData}
      schema={acceptOrientationSchema}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      bind:requesting
    >
      <TextareaField
        id="response"
        description="Commentaire privé à destination du prescripteur ou de la prescriptrice, ainsi que du conseiller ou de la conseillère référente s‘il ne s‘agit pas de la même personne. Ce message n‘est pas envoyé au bénéficiaire."
        bind:value={formData.response}
        vertical
      />

      <div class="mt-s20">
        <BasicInputField
          id="orientationStartDate"
          type="date"
          bind:value={formData.orientationStartDate}
          vertical
        >
          <p slot="description" class="legend italic">
            Date à partir de laquelle le ou la bénéficiaire est prise en charge.
            <br />
            Format attendu&nbsp;: JJ/MM/AAAA (par exemple, 17/01/2023 pour 17 janvier
            2023)
          </p>
        </BasicInputField>
      </div>

      <div class="mt-s20">
        <BasicInputField
          id="orientationEndDate"
          type="date"
          bind:value={formData.orientationEndDate}
          vertical
        >
          <p slot="description" class="legend italic">
            Date prévisionnelle de sortie.<br />
            Format attendu&nbsp;: JJ/MM/AAAA (par exemple, 17/01/2023 pour 17 janvier
            2023)
          </p>
        </BasicInputField>
      </div>

      <div class="mt-s20">
        <TextareaField
          id="orientationLocation"
          description="Merci de préciser l’adresse de déroulement "
          bind:value={formData.orientationLocation}
          vertical
        />
      </div>

      <div class="mt-s20">
        <CheckboxesField
          id="addExtraRecipients"
          bind:value={formData.addExtraRecipients}
          description="Si vous souhaitez ajouter d‘autres personnes en copie, cochez cette
        case et saisissez l‘adresse ou les adresses électroniques concernées
        (séparées par un espace si plusieurs). Format attendu&nbsp;:
        nom@domaine.fr."
          vertical
          choices={[
            {
              label: "Ajouter d’autres personnes en copie de ce message",
              value: "addExtraRecipients",
            },
          ]}
        />
      </div>

      {#if formData.addExtraRecipients.includes("addExtraRecipients")}
        <TextareaField
          id="extraRecipients"
          bind:value={formData.extraRecipients}
          vertical
        />
      {/if}

      <div class="mt-s20">
        <CheckboxesField
          id="addBeneficiaryMessage"
          bind:value={formData.addBeneficiaryMessage}
          description="Un message par défaut est envoyé, si vous souhaitez modifier le contenu cochez la case suivante."
          vertical
          choices={[
            {
              label: "Ajouter un message pour le ou la bénéficiaire",
              value: "addBeneficiaryMessage",
            },
          ]}
        />
      </div>
      {#if formData.addBeneficiaryMessage.includes("addBeneficiaryMessage")}
        <TextareaField
          id="beneficiaryMessage"
          bind:value={formData.beneficiaryMessage}
          vertical
        />
      {/if}

      <div class="mt-s32 text-right">
        <Button
          name="validate"
          type="submit"
          label="Accepter la demande"
          disabled={requesting}
        />
      </div>
    </Form>
  {/if}
</Modal>
