<script lang="ts">
  import FieldWrapper from "./field-wrapper.svelte";

  export let name: string;
  export let value: any | undefined = undefined;

  $: props = {
    id: name,
    name,
  };
</script>

<FieldWrapper
  let:onBlur
  {name}
  label=""
  hidden
  errorMessages={[]}
  description=""
  hideLabel
  required={false}
  vertical={false}
  allowHTMLError={false}
>
  <input type="hidden" bind:value on:input />
</FieldWrapper>
