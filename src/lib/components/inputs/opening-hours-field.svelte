<script lang="ts">
  import FieldWrapper from "./field-wrapper.svelte";
  import DaysGrid from "./opening-hours/days-grid.svelte";

  export let id: string;
  export let value;

  // Proxy vers le FieldWrapper
  export let label = "";
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
  <DaysGrid bind:value {id} />
</FieldWrapper>
