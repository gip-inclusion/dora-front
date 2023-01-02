<script lang="ts">
  import FieldWrapper from "./field-wrapper.svelte";
  import CitySearch from "./geo/city-search.svelte";

  export let name: string;
  export let disabled = false;
  export let placeholder: string | undefined = undefined;
  export let initialValue: string | undefined = undefined;

  // Spécifique
  export let onChange: (newValue: string) => void;

  // Proxy vers le FieldWrapper
  export let label: string;
  export let errorMessages: string[] = [];
  export let description = "";
  export let hidden = false;
  export let hideLabel = false;
  export let required = false;
  export let vertical = false;
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
  <CitySearch {onChange} {initialValue} {name} {disabled} {placeholder} />
</FieldWrapper>
