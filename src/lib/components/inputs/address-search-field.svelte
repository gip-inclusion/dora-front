<script lang="ts">
  import StreetSearch from "./geo/street-search.svelte";
  import FieldWrapper from "./field-wrapper.svelte";

  export let id: string;
  export let value: string | undefined = undefined;
  export let disabled = false;
  export let readonly = false;
  export let placeholder = "";
  export let initialValue = "";

  // Spécifiques:
  export let cityCode: string;
  export let onChange: (newValue: string) => void;

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
  <StreetSearch
    bind:value
    {onChange}
    {cityCode}
    {initialValue}
    {id}
    {disabled}
    {readonly}
    {placeholder}
  />
</FieldWrapper>
