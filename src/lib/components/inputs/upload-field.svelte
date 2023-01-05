<script lang="ts">
  import FieldWrapper from "./field-wrapper.svelte";
  import Uploader from "./others/uploader.svelte";

  export let id: string;
  export let disabled = false;

  // Spécifique du select
  export let fileKeys: string[];
  export let structureSlug;

  // Proxy vers le FieldWrapper
  export let label: string;
  export let description = "";
  export let hidden = false;
  export let hideLabel = false;
  export let required = false;
  export let vertical = false;
</script>

<FieldWrapper
  {id}
  let:onBlur
  {label}
  {description}
  {hidden}
  {hideLabel}
  {required}
  {vertical}
>
  <Uploader {id} {structureSlug} on:blur={onBlur} bind:fileKeys {disabled} />
</FieldWrapper>
