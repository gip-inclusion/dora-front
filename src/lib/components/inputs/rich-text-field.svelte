<script lang="ts">
  import RichText from "$lib/components/inputs/rich-text/editor.svelte";
  import FieldWrapper from "./field-wrapper.svelte";

  export let name: string;
  export let value: any | undefined = undefined;
  export let disabled = false;
  export let readonly: true | undefined = undefined;
  export let placeholder: string | undefined = undefined;

  // Proxy vers le FieldWrapper
  export let label: string;
  export let errorMessages: string[] = [];
  export let description = "";
  export let hidden = false;
  export let hideLabel = false;
  export let required = false;
  export let vertical = false;

  $: props = {
    id: name,
    name,
    disabled,
    readonly,
    placeholder,
  };
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
  <RichText
    bind:htmlContent={value}
    initialContent={value}
    {...props}
  /></FieldWrapper
>
