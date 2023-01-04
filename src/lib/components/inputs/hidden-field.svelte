<script lang="ts">
  import FieldWrapper from "./field-wrapper.svelte";

  export let id: string;
  export let value: any | undefined = undefined;
</script>

<FieldWrapper
  let:onBlur
  {id}
  label=""
  hidden
  description=""
  hideLabel
  required={false}
  vertical={false}
>
  <input type="hidden" bind:value {id} />
</FieldWrapper>
