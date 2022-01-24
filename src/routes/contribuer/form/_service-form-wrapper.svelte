<script>
  import { setContext, onMount, onDestroy } from "svelte";

  import { goto } from "$app/navigation";

  import CenteredGrid from "$lib/components/layout/centered-grid.svelte";
  import {
    validate,
    // injectAPIErrors,
    contextValidationKey,
    formErrors,
  } from "$lib/validation.js";

  import NavButtons from "./_nav-buttons.svelte";

  import serviceSchema, {
    step1Schema,
    step2Schema,
  } from "$lib/schemas/service-contrib.js";

  // import { createOrModifyService,  } from "$lib/services";
  import { assert /* logException*/ } from "$lib/logger";
  import Alert from "$lib/components/forms/alert.svelte";

  const schemas = new Map([
    [1, step1Schema],
    [2, step2Schema],
  ]);

  export let currentStep;
  export let service;

  onMount(() => {
    $formErrors = {};
  });

  onDestroy(() => {
    $formErrors = {};
  });

  async function handleEltChange(evt) {
    // We want to listen to both DOM and component events
    const fieldname = evt.target?.name || evt.detail;
    // Sometimes (particularly with Select components), the event is received
    // before the field value is updated in  `service`, although it's not
    // supposed to happen. This setTimeout is a unsatisfying workaround to that.
    await new Promise((resolve) => {
      setTimeout(() => {
        const filteredSchema = Object.fromEntries(
          Object.entries(serviceSchema).filter(
            ([name, _rules]) => name === fieldname
          )
        );
        const { validatedData, valid } = validate(
          service,
          filteredSchema,
          serviceSchema,
          { skipDependenciesCheck: false, noScroll: true }
        );
        if (valid) {
          service = { ...service, ...validatedData };
        }
        resolve();
      }, 200);
    });
  }

  setContext(contextValidationKey, {
    onBlur: handleEltChange,
    onChange: handleEltChange,
  });

  let navInfo = {};
  let scrollY;
  let errorDiv;

  $: switch (currentStep) {
    case 1:
      navInfo = {
        next: 2,
        showPublish: true,
      };
      break;
    case 2:
      navInfo = {
        previous: 1,
        showPublish: true,
      };
      break;

    default:
      console.log("?");
  }

  function isValid(_schema) {
    // TODO
    // return schema.isValidSync(service);
  }

  export async function publish() {
    // Validate the whole form
    const { _validatedData, valid } = validate(
      service,
      serviceSchema,
      serviceSchema,
      { skipDependenciesCheck: true, noScroll: false }
    );

    if (valid) {
      assert(service.slug);

      // Validation OK, let's send it to the API endpoint
      goto(`/contribuer/merci`);
      // try {
      //   const result = await publishDraft(service.slug);
      //   goto(`/services/${result.slug}`);
      // } catch (error) {
      //   logException(error);
      // }
    }
  }

  function goToPage(number) {
    currentStep = number;
    scrollY = 0;
  }

  function handleGoBack() {
    goToPage(navInfo.previous);
  }

  async function handleGoForward() {
    if (
      validate(service, schemas.get(currentStep), serviceSchema, {
        skipDependenciesCheck: true,
        noScroll: false,
      }).valid
    ) {
      goToPage(navInfo.next);
    }
  }

  async function handlePublish() {
    if (currentStep === 5) {
      publish();
    } else {
      if (
        validate(service, schemas.get(currentStep), serviceSchema, {
          skipDependenciesCheck: true,
          noScroll: false,
        }).valid
      ) {
        publish();
      }
    }
  }
</script>

<svelte:window bind:scrollY />

<CenteredGrid topPadded>
  <div class="col-start-1 col-span-full text-center mb-s48">
    <div class="mx-auto">
      <h1 class="text-france-blue text-f45">Proposez un service</h1>
      <div class="paragraph-small mt-s16">
        Aidez-nous à identifier et référencer l’ensemble de l’offre de
        l’insertion.<br />
        Seuls les champs marqués d’un astérisque
        <span style="color: var(--col-error);">*</span> sont obligatoires.
      </div>
    </div>
  </div>
</CenteredGrid>
<CenteredGrid roundedbg>
  <div class="col-span-8 col-start-1 mb-s64">
    <div bind:this={errorDiv}>
      {#each $formErrors.nonFieldErrors || [] as msg}
        <Alert iconOnLeft label={msg} />
      {/each}
    </div>
    <slot />
  </div>
</CenteredGrid>

<CenteredGrid sticky>
  <NavButtons
    _currentPageIsValid={isValid(schemas.get(currentStep))}
    onGoBack={handleGoBack}
    onGoForward={handleGoForward}
    onPublish={handlePublish}
    withBack={!!navInfo?.previous}
    withForward={!!navInfo?.next && !navInfo?.showPreview}
    withPublish={navInfo?.showPublish}
  />
</CenteredGrid>
