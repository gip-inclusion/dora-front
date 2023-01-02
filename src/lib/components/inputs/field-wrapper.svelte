<script lang="ts">
  import {
    contextValidationKey,
    type ValidationContext,
  } from "$lib/validation/validation";
  import { getContext } from "svelte";
  import Alert from "../display/alert.svelte";

  export let name: string;
  export let label: string;
  export let errorMessages: string[];
  export let description: string;
  export let hidden: boolean;
  export let hideLabel: boolean;
  export let required: boolean;
  export let vertical: boolean;
  export let allowHTMLError = false;

  const context = getContext<ValidationContext>(contextValidationKey);

  function handleBlur(evt) {
    if (context) context.onBlur(evt);
  }

  function handleChange(evt) {
    if (context) context.onChange(evt);
  }
</script>

<div
  class="items-top flex flex-col gap-s8"
  class:lg:flex-row={!vertical}
  class:hidden
>
  <div class="flex flex-col{vertical ? '' : ' lg:w-1/4'}">
    <label for={name} class="flex">
      <h4 class="my-s4" class:hidden={hideLabel}>
        {label}
      </h4>
      {#if required} <span class="ml-s6 text-error"> *</span>{/if}</label
    >
    {#if description}
      <small>{description}</small>
    {/if}
    <slot name="description" onBlur={handleBlur} onChange={handleChange} />
  </div>
  <div class="flex flex-col{vertical ? '' : ' lg:w-3/4'}">
    <slot onBlur={handleBlur} />

    {#each errorMessages || [] as msg}
      <Alert id="{name}-error" label={msg} />
    {/each}
  </div>
</div>
