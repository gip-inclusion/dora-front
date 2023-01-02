<script lang="ts">
  import type { Choice } from "$lib/types";
  import FieldWrapper from "./field-wrapper.svelte";
  import Select from "./select/select.svelte";

  export let name: string;
  export let value: any | undefined = undefined;
  export let autocomplete = undefined;
  export let disabled = false;
  export let readonly: true | undefined = undefined;
  export let placeholder: string | undefined = undefined;
  export let initialValue = undefined;

  // Spécifique du select
  export let choices: Choice[];
  export let sort = false;
  export let onSelectChange = undefined;
  export let placeholderMulti = "";
  export let multiple = false;

  // Proxy vers le FieldWrapper
  export let label: string;
  export let errorMessages: string[] = [];
  export let description = "";
  export let hidden = false;
  export let hideLabel = false;
  export let required = false;
  export let vertical = false;

  $: props = {
    id: name,
    name,
    autocomplete,
    disabled,
    readonly,
    placeholder,
  };
</script>

<FieldWrapper
  let:onBlur
  {name}
  {label}
  {errorMessages}
  {description}
  {hidden}
  {hideLabel}
  {required}
  {vertical}
>
  <Select
    {name}
    {choices}
    {sort}
    bind:value
    on:blur
    onChange={onSelectChange}
    {placeholder}
    {placeholderMulti}
    {disabled}
    {readonly}
    {initialValue}
    {multiple}
  />
</FieldWrapper>
