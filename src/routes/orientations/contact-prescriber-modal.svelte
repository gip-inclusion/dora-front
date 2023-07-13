<script lang="ts">
  import Modal from "$lib/components/hoc/modal.svelte";
  import Form from "$lib/components/forms/form.svelte";
  import * as v from "$lib/validation/schema-utils";
  import CheckboxesField from "$lib/components/forms/fields/checkboxes-field.svelte";
  import Button from "$lib/components/display/button.svelte";
  import TextareaField from "$lib/components/forms/fields/textarea-field.svelte";
  import { contactPrescriber } from "$lib/utils/orientation";
  import type { Orientation } from "$lib/types";
  import ConfirmationBloc from "./confirmation-bloc.svelte";

  export let isOpen = false;
  export let onRefresh;
  export let orientation: Orientation;

  let showConfirmation = false;

  let message = "";
  let ccBeneficiary: string[] = [];
  let ccReferent: string[] = [];
  let requesting = false;

  const contactPrescriberSchema: v.Schema = {
    ccBeneficiary: {
      label: `Ajouter le ou la bénéficiaire en copie (${orientation.beneficiaryFirstName} ${orientation.beneficiaryLastName})`,
      default: [],
      rules: [],
    },
    ccReferent: {
      label: `Ajouter le conseiller ou la conseillère référente en copie (${orientation.referentFirstName} ${orientation.referentLastName})`,
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

  const ccBeneficiaryChoices = [
    {
      value: "cc-beneficiary",
      label: `Ajouter le ou la bénéficiaire en copie (${orientation.beneficiaryFirstName} ${orientation.beneficiaryLastName})`,
    },
  ];

  const ccReferentChoices = [
    {
      value: "cc-referent",
      label: `Ajouter le conseiller ou la conseillère référente en copie (${orientation.referentFirstName} ${orientation.referentLastName})`,
    },
  ];
  function handleSubmit(validatedData) {
    return contactPrescriber(
      orientation.queryId,
      validatedData.ccBeneficiary.includes("cc-beneficiary"),
      validatedData.ccReferent.includes("cc-referent"),
      validatedData.message
    );
  }

  async function handleSuccess(_jsonResult) {
    await onRefresh();
    showConfirmation = true;
  }

  $: formData = { ccBeneficiary, ccReferent, message };
</script>

<Modal
  bind:isOpen
  on:close
  overflow
  hideTitle={showConfirmation}
  width="medium"
  title="Contacter le prescripteur ou la prescriptrice"
>
  <div slot="subtitle">
    Contacter {orientation.prescriber?.name} - concernant l’orientation qui vous
    a été adressé pour le service «&nbsp;<a
      class="text-magenta-cta"
      href="/services/{orientation.service?.slug}"
    >
      {orientation.service?.name}
    </a>&nbsp;».
  </div>

  {#if showConfirmation}
    <ConfirmationBloc title="Votre message a été transmis" />
  {:else}
    <div class="pr-s16">
      <Form
        bind:data={formData}
        schema={contactPrescriberSchema}
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
        bind:requesting
      >
        <div class="mx-s4 mb-s20">
          <CheckboxesField
            id="ccBeneficiary"
            bind:value={ccBeneficiary}
            choices={ccBeneficiaryChoices}
            hideLabel
            vertical
          />
          <CheckboxesField
            id="ccReferent"
            bind:value={ccReferent}
            choices={ccReferentChoices}
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
    </div>
  {/if}
</Modal>
