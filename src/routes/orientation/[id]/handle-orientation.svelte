<script lang="ts">
  import Button from "$lib/components/display/button.svelte";
  import DenyOrientationModal from "./deny-orientation-modal.svelte";
  import AcceptOrientationModal from "./accept-orientation-modal.svelte";
  import ContactBeneficiaryModal from "./contact-beneficiary-modal.svelte";
  import ContactServiceModal from "./contact-service-modal.svelte";
  import { browser } from "$app/environment";
  import type { SendOrientation } from "./types";
  import Notice from "$lib/components/display/notice.svelte";
  import { formatNumericDate } from "$lib/utils/date";

  export let sendOrientation: SendOrientation;
  export let onRefresh;

  let modalOpened:
    | "accept"
    | "deny"
    | "contact-beneficiary"
    | "contact-service"
    | undefined = undefined;

  function closeModal() {
    modalOpened = undefined;
  }

  let statusMessage: { label?: string; cssClass?: string } = {};
  $: {
    if (sendOrientation.status === "validée") {
      statusMessage = { label: "Validé", cssClass: "text-success" };
    } else if (sendOrientation.status === "ouverte") {
      statusMessage = {
        label: "Ouverte / En cours de traitement",
        cssClass: "text-blue-information-dark",
      };
    } else if (sendOrientation.status === "refusée") {
      statusMessage = { label: "Refusé", cssClass: "text-error" };
    }
  }
</script>

{#if browser}
  <DenyOrientationModal
    isOpen={modalOpened === "deny"}
    on:close={closeModal}
    {sendOrientation}
    {onRefresh}
  />
  <AcceptOrientationModal
    isOpen={modalOpened === "accept"}
    on:close={closeModal}
    {sendOrientation}
    {onRefresh}
  />

  <ContactBeneficiaryModal
    isOpen={modalOpened === "contact-beneficiary"}
    on:close={closeModal}
    {onRefresh}
    {sendOrientation}
  />
  <ContactServiceModal
    isOpen={modalOpened === "contact-service"}
    on:close={closeModal}
    {sendOrientation}
    {onRefresh}
  />
{/if}

<div class="rounded-md border border-gray-02 p-s32">
  <h2>Traiter la demande</h2>

  <div class="mb-s24">
    <strong class="text-gray-text">Statut de la demande:<br /></strong>
    {#if statusMessage.label}
      <span class={statusMessage.cssClass}>
        {statusMessage.label}
      </span>
    {/if}
  </div>

  {#if sendOrientation.status === "ouverte"}
    <div class="flex flex-col gap-s12">
      <Button
        label="Valider la demande"
        on:click={() => (modalOpened = "accept")}
      />
      <Button
        secondary
        label="Refuser la demande"
        extraClass="!border-error !text-error hover:!text-white hover:border-error hover:!bg-error"
        on:click={() => (modalOpened = "deny")}
      />
      <Button
        secondary
        extraClass="!border-gray-dark !text-gray-text hover:!text-white hover:border-gray-dark hover:!bg-gray-dark"
        label="Contacter le ou la bénéficiaire"
        on:click={() => (modalOpened = "contact-beneficiary")}
      />
      <Button
        secondary
        extraClass="!border-gray-dark !text-gray-text hover:!text-white hover:border-gray-dark hover:!bg-gray-dark"
        label="Contacter le ou la prescripteur·rice"
        on:click={() => (modalOpened = "contact-service")}
      />
    </div>
  {:else if sendOrientation.status === "validée"}
    <Notice
      type="info"
      title="Vous avez validé cette demande le {formatNumericDate(
        sendOrientation.processingDate
      )}"
    >
      <p class="text-left text-f14 text-gray-text">
        Vous ne pouvez plus revenir sur une décision qui a déjà été actée.
      </p>
    </Notice>
  {:else if sendOrientation.status === "refusée"}
    <Notice
      type="error"
      title="Vous avez refusé cette demande le {formatNumericDate(
        sendOrientation.processingDate
      )}"
    >
      <p class="text-left text-f14 text-gray-text">
        Vous ne pouvez plus revenir sur une décision qui a déjà été actée.
      </p>
    </Notice>
  {/if}
</div>
