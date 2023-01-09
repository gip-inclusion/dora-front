<script lang="ts">
  import RichText from "$lib/components/inputs/rich-text/editor.svelte";
  import FieldWrapper from "./field-wrapper.svelte";

  export let id: string;
  export let value;
  export let disabled = false;
  export let readonly = false;
  export let placeholder = "";

  // Proxy vers le FieldWrapper
  export let label = "";
  export let description = "";
  export let hidden = false;
  export let hideLabel = false;
  export let required = false;
  export let vertical = false;
  let editor;

  export function updateValue(newValue: string) {
    editor.updateValue(newValue);
  }
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
  <RichText
    bind:this={editor}
    bind:htmlContent={value}
    initialContent={value}
    {id}
    name={id}
    {disabled}
    {readonly}
    {placeholder}
  />
</FieldWrapper>
