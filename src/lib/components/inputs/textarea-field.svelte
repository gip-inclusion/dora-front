<script lang="ts">
  import FieldWrapper from "./field-wrapper.svelte";

  export let id: string;
  export let value;
  export let autocomplete = "";
  export let disabled = false;
  export let readonly: true | undefined = undefined;
  export let placeholder: string | undefined = undefined;
  export let rows = 4;

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
  <textarea
    bind:value
    on:blur={onBlur}
    {id}
    name={id}
    {autocomplete}
    {disabled}
    {readonly}
    {placeholder}
    {rows}
  />
</FieldWrapper>

<style lang="postcss">
  textarea {
    @apply min-h-[3rem] rounded border border-gray-03 px-s12 py-s6 text-f14 placeholder-gray-text-alt outline-none focus:shadow-focus;
    @apply grow read-only:text-gray-03 disabled:bg-gray-00;
  }
</style>
