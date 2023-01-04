<script lang="ts">
  import EnsureLoggedIn from "$lib/components/hoc/ensure-logged-in.svelte";
  import { goto } from "$app/navigation";
  import Button from "$lib/components/display/button.svelte";
  import BasicInputField from "$lib/components/inputs/basic-input-field.svelte";

  import Fieldset from "$lib/components/display/fieldset.svelte";
  import Form from "$lib/components/hoc/form.svelte";
  import { arrowRightSIcon } from "$lib/icons";
  import { getApiURL } from "$lib/utils/api";
  import { refreshUserInfo, token, userInfo } from "$lib/utils/auth";
  import userProfileSchema from "$lib/validation/schemas/user-profile";

  function handleChange(validatedData) {
    console.log(validatedData);
    phoneNumber = validatedData.phoneNumber;
  }

  function handleSubmit(validatedData) {
    const url = `${getApiURL()}/profile/change/`;
    const { firstName, lastName, newsletter, phoneNumber } = validatedData;
    return fetch(url, {
      method: "POST",
      body: JSON.stringify({
        firstName,
        lastName,
        newsletter,
        phoneNumber,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json; version=1.0",
        Authorization: `Token ${$token}`,
      },
    });
  }

  async function handleSuccess(_result) {
    await refreshUserInfo();
    goto("/mon-compte");
  }

  let requesting = false;
  let { firstName, lastName, email, phoneNumber } = $userInfo;
  // At the moment we don't want to expose this field
  const newsletter = $userInfo.newsletter;

  $: infoIsMissing = !firstName || !lastName || !email || !phoneNumber;
  $: infoChanged =
    firstName !== $userInfo?.firstName ||
    lastName !== $userInfo?.lastName ||
    email !== $userInfo?.email ||
    phoneNumber !== $userInfo?.phoneNumber;
</script>

<EnsureLoggedIn>
  <div class="lg:w-2/3">
    <Form
      data={{ firstName, lastName, email, phoneNumber, newsletter }}
      schema={userProfileSchema}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      bind:requesting
    >
      <Fieldset title="Informations" noTopPadding>
        <BasicInputField
          id="firstName"
          label="Prénom"
          bind:value={firstName}
          placeholder="Aurélien"
          disabled
          vertical
        />

        <BasicInputField
          id="lastName"
          label="Nom"
          bind:value={lastName}
          placeholder="Durand"
          disabled
          vertical
        />

        <BasicInputField
          id="email"
          label="Courriel"
          bind:value={email}
          placeholder="nom.prenom@organisation.fr"
          disabled
          vertical
        />

        <BasicInputField
          id="phoneNumber"
          type="tel"
          label="Numéro de téléphone"
          bind:value={phoneNumber}
          placeholder="0X XX XX XX XX"
          vertical
        />

        <div class="self-end">
          <Button
            type="submit"
            label="Valider"
            disabled={requesting || infoIsMissing || !infoChanged}
            iconOnRight
            icon={arrowRightSIcon}
            preventDefaultOnMouseDown
          />
        </div>
      </Fieldset>
    </Form>
  </div>
</EnsureLoggedIn>
