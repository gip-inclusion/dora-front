<script lang="ts">
  import FieldWrapper from "./field-wrapper.svelte";
  import AdminDivisionSearch from "../specialized/admin-division-search.svelte";

  export let id: string;
  export let value: string | undefined = undefined;
  export let disabled = false;
  export let readonly = false;
  export let placeholder = "";
  export let initialValue = "";

  // Spécifiques:
  export let searchType: string;
  export let onChange: (newValue: string) => void;
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
  <AdminDivisionSearch
    {id}
    {searchType}
    {onChange}
    {initialValue}
    bind:value
    bind:choices
    {placeholder}
    {disabled}
    {readonly}
  />
</FieldWrapper>
