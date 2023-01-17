<script lang="ts">
  import type { Choice } from "$lib/types";
  import FieldWrapper from "./field-wrapper.svelte";
  import Select from "./select/select.svelte";

  export let id: string;
  export let value: string[] | number[] | undefined = undefined;
  export let disabled = false;
  export let readonly = false;
  export let placeholder = "";
  export let initialValue = undefined;

  // Spécifique du select
  export let choices: Choice[];
  export let sort = false;
  export let onChange: ((newValues: string[]) => void) | undefined = undefined;
  export let placeholderMulti = "";

  // Proxy vers le FieldWrapper
  export let label: string;
  export let description = "";
  export let hidden = false;
  export let hideLabel = false;
  export let required = false;
  export let vertical = false;
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
    {choices}
    bind:value
    on:blur={onBlur}
    {onChange}
    {sort}
    {placeholder}
    {placeholderMulti}
    {disabled}
    {readonly}
    {initialValue}
    multiple
  />
</FieldWrapper>
