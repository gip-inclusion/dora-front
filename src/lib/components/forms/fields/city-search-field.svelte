<script lang="ts">
  import {
    currentFormData,
    currentSchema,
    isRequired,
  } from "$lib/validation/validation";
  import FieldWrapper from "../field-wrapper.svelte";
  import CitySearch from "../../inputs/geo/city-search.svelte";
  import type { GeoApiValue } from "$lib/types";

  export let id: string;

  export let disabled = false;
  export let readonly = $currentSchema?.[id]?.readonly;
  export let initialValue = "";

  // Spécifique
  export let onChange: (newValue: GeoApiValue) => void;

  // Proxy vers le FieldWrapper
  export let description =
    "Commencez à saisir le nom et choisissez dans la liste.";
  export let hidden = false;
  export let hideLabel = false;
  export let vertical = false;
</script>

{#if $currentSchema && id in $currentSchema}
  <FieldWrapper
    {id}
    let:onBlur
    label={$currentSchema[id].label}
    required={isRequired($currentSchema[id], $currentFormData)}
    {description}
    {hidden}
    {hideLabel}
    {vertical}
    {disabled}
    {readonly}
  >
    <CitySearch on:blur={onBlur} {id} {onChange} {initialValue} {disabled} />
  </FieldWrapper>
{/if}
