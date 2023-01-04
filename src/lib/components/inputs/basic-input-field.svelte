<script lang="ts">
  import FieldWrapper from "./field-wrapper.svelte";

  export let id: string;
  export let type: "email" | "tel" | "text" | "url" | "date" | "number" =
    "text";
  export let value: any | undefined = undefined;
  export let autocomplete = undefined;
  export let disabled = false;
  export let readonly: true | undefined = undefined;
  export let placeholder: string | undefined = undefined;

  // Proxy vers le FieldWrapper
  export let label = "";
  export let description = "";
  export let hidden = false;
  export let hideLabel = false;
  export let required = false;
  export let vertical = false;

  $: props = {
    id,
    name: id,
    autocomplete,
    disabled,
    readonly,
    placeholder,
  };
</script>

<FieldWrapper
  {id}
  let:onBlur
  let:onChange
  let:onInput
  {label}
  {description}
  {hidden}
  {hideLabel}
  {required}
  {vertical}
>
  <slot slot="description" name="description" />

  {#if type === "text"}
    <input
      type="text"
      bind:value
      on:blur={onBlur}
      on:change={onChange}
      on:input={onInput}
      {...props}
    />
  {:else if type === "date"}
    <input
      type="text"
      bind:value
      on:blur={onBlur}
      on:change={onChange}
      on:input={onInput}
      {...props}
    />
  {:else if type === "number"}
    <input
      type="number"
      bind:value
      on:blur={onBlur}
      on:change={onChange}
      on:input={onInput}
      {...props}
    />
  {:else if type === "email"}
    <input
      type="email"
      bind:value
      on:blur={onBlur}
      on:change={onChange}
      on:input={onInput}
      {...props}
    />
  {:else if type === "tel"}
    <input
      type="tel"
      bind:value
      on:blur={onBlur}
      on:change={onChange}
      on:input={onInput}
      {...props}
    />
  {:else if type === "url"}
    <input
      type="url"
      bind:value
      on:blur={onBlur}
      on:change={onChange}
      on:input={onInput}
      {...props}
    />
  {:else if type === "date"}
    <input
      type="date"
      bind:value
      on:blur={onBlur}
      on:change={onChange}
      on:input={onInput}
      {...props}
    />
  {/if}
</FieldWrapper>

<style lang="postcss">
  input[type="text"],
  input[type="number"],
  input[type="url"],
  input[type="email"],
  input[type="tel"],
  input[type="date"] {
    @apply h-s48 rounded border border-gray-03 px-s12 py-s6 text-f14 placeholder-gray-text-alt outline-none focus:shadow-focus;
  }

  input {
    @apply grow read-only:text-gray-03 disabled:bg-gray-00;
  }
</style>
