<script lang="ts">
  import Modal from "$lib/components/hoc/modal.svelte";
  import Form from "$lib/components/forms/form.svelte";
  import * as v from "$lib/validation/schema-utils";
  import CheckboxesField from "$lib/components/forms/fields/checkboxes-field.svelte";
  import Button from "$lib/components/display/button.svelte";
  import TextareaField from "$lib/components/forms/fields/textarea-field.svelte";
  import { contactService } from "$lib/utils/orientation";
  import type { SendOrientation } from "$lib/types";
  import ConfirmationBloc from "./confirmation-bloc.svelte";

  export let isOpen = false;
  export let onRefresh;
  export let orientation: SendOrientation;

  let showConfirmation = false;

  let message = "";
  let extraRecipients = [];
  let requesting = false;

  const contactServiceSchema: v.Schema = {
    extraRecipients: {
      label: "Ajouter d‘autres destinataires",
      default: [],
      rules: [],
    },
    message: {
      label: "Votre message",
      default: "",
      rules: [v.isString(), v.maxStrLength(1000)],
      required: true,
      maxLength: 1000,
    },
  };
  const extraRecipientsChoices = [
    {
      value: "add-beneficiary",
      label: `Ajouter le ou la bénéficiaire en copie (${orientation.beneficiaryFirstName} ${orientation.beneficiaryLastName})`,
    },
    {
      value: "add-referent-contact",
      label: `Ajouter le conseiller ou la conseillère référente en copie (${orientation.referentFirstName} ${orientation.referentLastName})`,
    },
  ];

  async function handleSubmit(validatedData) {
    await contactService(
      orientation.queryId,
      validatedData.extraRecipients,
      validatedData.message
    );
    await onRefresh();
  }

  function handleSuccess(_jsonResult) {
    showConfirmation = true;
  }

  $: formData = { extraRecipients, message };
</script>

<Modal
  bind:isOpen
  on:close
  overflow
  width="medium"
  title="Contacter le prescripteur ou la prescriptrice"
>
  <div slot="subtitle">
    Contacter {orientation.service?.contactName} - concernant l’orientation qui vous
    a été adressé pour le service «
    <a class="text-magenta-cta" href="/services/{orientation.service?.slug}">
      {orientation.service?.name}
    </a> ».
  </div>

  {#if showConfirmation}
    <ConfirmationBloc title="Votre message a été transmis" />
  {:else}
    <Form
      bind:data={formData}
      schema={contactServiceSchema}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      bind:requesting
    >
      <div class="mx-s4 mb-s20">
        <CheckboxesField
          id="extraRecipients"
          choices={extraRecipientsChoices}
          bind:value={extraRecipients}
          hideLabel
          vertical
        />
      </div>
      <div class="mx-s4">
        <TextareaField id="message" bind:value={message} vertical />
      </div>

      <div class="mt-s32 text-right">
        <Button
          name="validate"
          type="submit"
          label="Envoyer le message"
          disabled={requesting}
        />
      </div>
    </Form>
  {/if}
</Modal>
