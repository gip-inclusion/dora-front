<script lang="ts">
  import {
    currentFormData,
    currentSchema,
    isRequired,
  } from "$lib/validation/validation";
  import FieldWrapper from "../field-wrapper.svelte";
  import RadioButtons from "../../inputs/radio-buttons.svelte";

  export let id: string;
  export let value;

  export let disabled = false;
  export let readonly = $currentSchema?.[id]?.readonly;

  // Spécifiques
  export let choices;

  // Proxy vers le FieldWrapper
  export let description = "";
  export let hidden = false;
  export let hideLabel = false;
  export let vertical = false;
</script>

{#if $currentSchema && id in $currentSchema}
  <FieldWrapper
    {id}
    let:onChange
    let:errorMessages
    label={$currentSchema[id].label}
    required={isRequired($currentSchema[id], $currentFormData)}
    {description}
    {hidden}
    {hideLabel}
    {vertical}
    {disabled}
    {readonly}
  >
    <RadioButtons
      bind:group={value}
      on:change={onChange}
      {id}
      name={id}
      {choices}
      {disabled}
      {readonly}
      {errorMessages}
    />
  </FieldWrapper>
{/if}
