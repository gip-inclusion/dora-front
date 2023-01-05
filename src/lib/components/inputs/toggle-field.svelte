<script lang="ts">
  import FieldWrapper from "./field-wrapper.svelte";
  import Toggle from "./others/toggle.svelte";

  export let id: string;
  export let value;
  export let disabled = false;
  export let readonly: true | undefined = undefined;

  // Spécifiques
  export let yesLabel: string | undefined = undefined;
  export let noLabel: string | undefined = undefined;

  // Proxy vers le FieldWrapper
  export let label: string;
  export let description = "";
  export let hidden = false;
  export let hideLabel = false;
  export let required = false;
  export let vertical = false;
</script>

<FieldWrapper
  let:onBlur
  let:onChange
  {id}
  {label}
  {description}
  {hidden}
  {hideLabel}
  {required}
  {vertical}
>
  <Toggle
    {id}
    bind:checked={value}
    on:change={onChange}
    {disabled}
    {readonly}
    {yesLabel}
    {noLabel}
  />
</FieldWrapper>
