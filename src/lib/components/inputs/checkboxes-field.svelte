<script lang="ts">
  import FieldWrapper from "./field-wrapper.svelte";
  import Checkboxes from "./others/checkboxes.svelte";

  export let id: string;
  export let value;
  export let disabled = false;
  export let readonly: true | undefined = undefined;

  // Spécifiques
  export let choices;

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
  {id}
  {label}
  {description}
  {hidden}
  {hideLabel}
  {required}
  {vertical}
>
  <Checkboxes
    {id}
    name={id}
    bind:group={value}
    on:change
    {choices}
    {disabled}
    {readonly}
  />
</FieldWrapper>
