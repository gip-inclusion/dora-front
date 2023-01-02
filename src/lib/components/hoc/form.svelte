<script lang="ts">
  import {
    contextValidationKey,
    formErrors,
    injectAPIErrors,
    validate,
    type ValidationContext,
  } from "$lib/validation/validation";
  import { onDestroy, onMount, setContext } from "svelte";

  export let extraClass = "";
  export let data;
  export let schema;
  export let requesting = false;
  export let serverErrorsDict = {};
  export let onSubmit, onSuccess;
  export let onChange: ((data) => void) | undefined = undefined;

  onMount(() => {
    $formErrors = {};
  });

  onDestroy(() => {
    $formErrors = {};
  });

  async function handleEltChange(evt) {
    $formErrors.nonFieldErrors = [];

    // We want to listen to both DOM and component events
    const fieldName = evt.target?.name || evt.detail;

    // Sometimes (particularly with Select components), the event is received
    // before the field value is updated in  `structure`, although it's not
    // supposed to happen. This setTimeout is an unsatisfying workaround to that.

    // TODO: try replacing that with an await tick()
    await new Promise((resolve) => {
      setTimeout(() => {
        const { validatedData, valid } = validate(data, schema, {
          fieldName,
          noScroll: true,
        });

        if (valid && onChange) {
          onChange(validatedData);
        }

        resolve(true);
      }, 200);
    });
  }

  setContext<ValidationContext>(contextValidationKey, {
    onBlur: handleEltChange,
    onChange: handleEltChange,
  });

  async function getJsonResult(result) {
    let jsonResult;
    try {
      jsonResult = await result.json();
    } catch (err) {
      jsonResult = null;
    }
    return jsonResult;
  }

  async function handleSubmit() {
    $formErrors = {};
    const { validatedData, valid } = validate(data, schema);
    if (valid) {
      try {
        requesting = true;
        const result = await onSubmit(validatedData);
        if (result.ok) {
          await onSuccess(await getJsonResult(result));
        } else {
          injectAPIErrors(await getJsonResult(result), serverErrorsDict);
        }
      } catch (err) {
        injectAPIErrors(
          {
            nonFieldErrors: [
              { code: "fetch-error", message: "Erreur de connexion" },
            ],
          },
          serverErrorsDict
        );

        throw err;
      } finally {
        requesting = false;
      }
    }
  }
</script>

<form
  on:submit|preventDefault={handleSubmit}
  novalidate
  class="flex-row gap-s24 {extraClass}"
>
  <slot />
</form>
