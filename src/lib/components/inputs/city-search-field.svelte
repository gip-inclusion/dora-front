<script lang="ts">
  import FieldWrapper from "./field-wrapper.svelte";
  import CitySearch from "./geo/city-search.svelte";

  export let id: string;
  export let disabled = false;
  export let placeholder = "";
  export let initialValue = "";

  // Spécifique
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
  <CitySearch
    on:blur={onBlur}
    {onChange}
    {initialValue}
    {id}
    {disabled}
    {placeholder}
  />
</FieldWrapper>
