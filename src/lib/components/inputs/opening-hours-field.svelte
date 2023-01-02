<script lang="ts">
  import FieldWrapper from "./field-wrapper.svelte";
  import DaysGrid from "./opening-hours/days-grid.svelte";

  export let name: string;
  export let value: any | undefined = undefined;

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
  <DaysGrid bind:value {name} />
</FieldWrapper>
