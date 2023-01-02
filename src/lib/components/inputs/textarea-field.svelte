<script lang="ts">
  import FieldWrapper from "./field-wrapper.svelte";

  export let name: string;
  export let value: any | undefined = undefined;
  export let autocomplete = undefined;
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
    autocomplete,
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
  <textarea bind:value on:blur={onBlur} on:input {...props} />
</FieldWrapper>

<style lang="postcss">
  textarea {
    @apply min-h-[3rem] rounded border border-gray-03 px-s12 py-s6 text-f14 placeholder-gray-text-alt outline-none focus:shadow-focus;
    @apply grow read-only:text-gray-03 disabled:bg-gray-00;
  }
</style>
