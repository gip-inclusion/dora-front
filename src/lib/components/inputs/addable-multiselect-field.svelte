<script lang="ts">
  import type { Choice } from "$lib/types";
  import Button from "../display/button.svelte";
  import BasicInputField from "./basic-input-field.svelte";
  import FieldWrapper from "./field-wrapper.svelte";
  import Select from "./select/select.svelte";

  export let id: string;
  export let disabled = false;
  export let readonly = false;
  export let placeholder = "";

  // Spécifiques
  export let choices: Choice[];
  export let sort = false;
  export let onChange = undefined;
  export let placeholderMulti = "";
  export let multiple = false;
  export let canAdd = true;
  export let values;
  export let structure = null;
  let textInputVisible = false;
  let newValue;
  let newValueErrors = [];

  // Proxy vers le FieldWrapper
  export let label: string;
  export let description = "";
  export let hidden = false;
  export let hideLabel = false;
  export let required = false;
  export let vertical = false;

  const maxLength = 140;
  const errorMsg = `${maxLength} caractères maximum`;

  $: filteredChoices = choices.filter(
    (c) => c.structure == null || c.structure === structure
  );

  function handleAddValue() {
    const value = newValue;
    if (value.length > maxLength) {
      newValueErrors = [errorMsg];
      return;
    }
    choices = [...choices, { value, label: value }];
    values = [...values, value];
    newValue = "";
    textInputVisible = false;
  }

  function handleChangeValue(evt) {
    const length = evt.target.value.length;
    if (length > maxLength) {
      newValueErrors = [errorMsg];
    } else {
      newValueErrors = [];
    }
  }
</script>

<FieldWrapper
  {id}
  let:onBlur
  {label}
  {description}
  {hidden}
  {hideLabel}
  {required}
  {vertical}
>
  <Select
    {id}
    {sort}
    bind:value={values}
    choices={filteredChoices}
    on:blur={onBlur}
    {onChange}
    {placeholder}
    {placeholderMulti}
    {disabled}
    {readonly}
    {multiple}
  />
  <div class="flex flex-col" class:mt-s12={canAdd}>
    {#if canAdd}
      <div class:hidden={textInputVisible}>
        <Button
          label="Ajouter une autre option"
          secondary
          small
          on:click={() => (textInputVisible = true)}
        />
      </div>
      <div class="flex flex-row gap-s16 " class:hidden={!textInputVisible}>
        <div class="flex-grow">
          <BasicInputField
            {id}
            type="text"
            bind:value={newValue}
            on:input={handleChangeValue}
            vertical
          />
        </div>
        <div class="self-center">
          <div class="flex flex-col gap-s8 md:flex-row">
            <Button
              label="Ajouter"
              small
              disabled={!newValue}
              on:click={handleAddValue}
            />

            <Button
              label="Annuler"
              secondary
              small
              on:click={() => (textInputVisible = false)}
            />
          </div>
        </div>
      </div>
    {/if}
  </div>
</FieldWrapper>

<div />
