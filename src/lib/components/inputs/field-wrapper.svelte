<script lang="ts">
  import {
    contextValidationKey,
    formErrors,
    fieldsMetadata,
    type ValidationContext,
  } from "$lib/validation/validation";
  import { getContext } from "svelte";
  import Alert from "../display/alert.svelte";

  export let id: string;
  export let label = "";
  export let description = "";
  export let hidden = false;
  export let hideLabel = false;
  export let required = false;
  export let vertical = false;

  const context = getContext<ValidationContext>(contextValidationKey);

  function handleBlur(evt) {
    if (context) context.onBlur(evt);
  }

  function handleChange(evt) {
    if (context) context.onChange(evt);
  }

  function handleInput(_evt) {
    // console.log("input");
    // if (context) context.onInput(evt);
  }

  $: errorMessages = $formErrors[id];

  $fieldsMetadata[id] = {
    label: label,
    required,
  };
</script>

<div
  class="items-top flex flex-col items-stretch gap-s8 lg:items-start"
  class:lg:flex-row={!vertical}
  class:lg:items-stretch={vertical}
  class:hidden
>
  <div class="flex flex-col" class:one-fourth={!vertical}>
    <label for={id} class="mt-s8">
      <span class=" text-f17 font-bold text-gray-dark" class:hidden={hideLabel}>
        {label}{#if required}<span class="ml-s6 text-error">&nbsp;*</span>{/if}
      </span>
    </label>
    {#if description}
      <small>{description}</small>
    {/if}
    {#if $$slots.description}
      <div class="mb-s4">
        <slot name="description" />
      </div>
    {/if}
  </div>
  <div class="flex flex-col " class:three-fourths={!vertical}>
    <!-- Slot principal -->
    <slot onBlur={handleBlur} onChange={handleChange} onInput={handleInput} />
    <!--  -->
    {#each errorMessages || [] as msg, i}
      <Alert id="{id}-error-{i}" label={msg} />
    {/each}
  </div>
</div>

<style lang="postcss">
  .one-fourth {
    @apply lg:w-1/4;
  }

  .three-fourths {
    @apply lg:w-3/4;
  }
</style>
