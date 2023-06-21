<script lang="ts">
  import Breadcrumb from "$lib/components/display/breadcrumb.svelte";
  import Form from "$lib/components/forms/form.svelte";
  import EnsureLoggedIn from "$lib/components/hoc/ensure-logged-in.svelte";
  import type { PageData } from "./$types";
  import * as v from "$lib/validation/schema-utils";

  export let data: PageData;

  let requesting = false;

  const feedbackSchema: v.Schema = {
    fullName: {
      label: "Nom",
      default: "",
      rules: [v.isString(), v.maxStrLength(140)],
      post: [v.trim],
      required: true,
    },
    email: {
      label: "Courriel",
      default: "",
      rules: [v.isEmail(), v.maxStrLength(255)],
      post: [v.lower, v.trim],
      required: true,
    },
    message: {
      label: "Message",
      default: "",
      rules: [v.isString()],
      required: true,
    },
  };

  onMount(() => {
    if ($userInfo) {
      suggesterFullName = $userInfo.fullName;
      suggesterEmail = $userInfo.email;
    }
  });

  function handleChange(_validatedData) {}

  function handleSubmit(validatedData) {
    // TODO
    /*
    return fetch(url, {
      method: "POST",
      body: JSON.stringify({
        ...validatedData,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json; version=1.0",
      },
    });
    */
  }

  function handleSuccess(_jsonResult) {
    // TODO
  }

  $: formData = {
    fullName: suggesterFullName,
    email: suggesterEmail,
    message,
  };
</script>

<EnsureLoggedIn>
  <div class="mb-s32">
    <Breadcrumb currentLocation="preferences" dark />
  </div>

  <div class="flex">
    <div class="flex-[2] rounded-md border border-gray-02 md:relative">
      <div
        class="flex flex-wrap items-center justify-between gap-s12 border-b border-gray-02 px-s35 py-s28"
      >
        <h1 class="m-s0 text-f23 leading-20 text-france-blue">
          Mes préférences
        </h1>
      </div>
      <div class="flex flex-col gap-s35 p-s35">
        <Form
          bind:data={formData}
          schema={feedbackSchema}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onSuccess={handleSuccess}
          bind:requesting
        >
          <Fieldset>
            <BasicInputField
              id="fullName"
              bind:value={suggesterFullName}
              vertical
              placeholder="Aurélien Durand"
              autocomplete="name"
            />

            <BasicInputField
              type="email"
              id="email"
              bind:value={suggesterEmail}
              placeholder="nom.prenom@organisation.fr"
              autocomplete="email"
              vertical
            />

            <TextareaField
              id="message"
              bind:value={message}
              description="Détaillez les éléments qui vous semblent erronés ou incomplets."
              vertical
              rows={6}
              placeholder="Renseigner ici les détails"
            />
          </Fieldset>
        </Form>
      </div>
    </div>
    <div class="flex-1" />
  </div>
</EnsureLoggedIn>
