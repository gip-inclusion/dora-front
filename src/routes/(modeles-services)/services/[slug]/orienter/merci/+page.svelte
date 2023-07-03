<script lang="ts">
  import LinkButton from "$lib/components/display/link-button.svelte";
  import { arrowLeftLineIcon, flashLightIcon } from "$lib/icons";
  import Layout from "../layout.svelte";
  import type { PageData } from "./$types";
  import { orientation } from "../store";
  // import { userInfo } from "$lib/utils/auth";
  import illustration from "$lib/assets/illustrations/illu-favs.svg";
  import { formatFilePath } from "$lib/utils/service";

  export let data: PageData;

  const concernedPublic = data.servicesOptions.concernedPublic.filter((elt) =>
    $orientation.concernedPublic?.includes(elt.value)
  );

  const accessConditions = data.servicesOptions.accessConditions.filter((elt) =>
    $orientation.accessConditions?.includes(elt.value)
  );

  const requirements = data.servicesOptions.requirements.filter((elt) =>
    $orientation.requirements?.includes(elt.value)
  );

  const contactPrefOptions = {
    phone: "téléphone",
    email: "e-mail",
    other: $orientation.beneficiaryOtherContactMethod,
  };

  const contactPrefDisplay = $orientation.beneficiaryContactPreferences
    ?.map((pref) => contactPrefOptions[pref])
    .join(", ");

  const contactInfoDisplay = [
    $orientation.beneficiaryEmail,
    $orientation.beneficiaryPhone,
    $orientation.beneficiaryOtherContactMethod,
  ]
    .filter((info) => !!info)
    .join(" – ");

  const attachments = [];

  data.servicesOptions.credentials
    .filter((elt) => data.service.credentials.includes(elt.value))
    .forEach((cred) => {
      attachments.push(cred.label);
    });

  data.service.formsInfo.forEach((form) => {
    attachments.push(formatFilePath(form.name));
  });
</script>

<Layout {data}>
  <div
    class="gap-s46 mt-s56 flex flex-col-reverse items-center justify-around rounded-md border border-gray-03 px-s20 py-s32 lg:flex-row"
  >
    <div class="max-w-lg basis-1/2 text-center">
      <div class="mx-auto mb-s12 h-s24 w-s24">
        {@html flashLightIcon}
      </div>
      <h2 class=" font-bold text-gray-text">
        Votre demande a été transmise à la structure porteuse du service
      </h2>
      <p class="legend">
        Une copie de cette demande vous sera transmise par e-mail, et le
        bénéficiaire recevra également une notice d’information.
      </p>
      <LinkButton
        icon={arrowLeftLineIcon}
        label="Retour à la fiche"
        to="/services/{data.service.slug}"
        noBackground
      />
    </div>
    <div class="flex-shrink-0">
      <img
        src={illustration}
        alt="Personne avec un sac à dos feuilletant des notes"
      />
    </div>
  </div>

  <hr class="mb-s48 mt-s48" />

  <h3 class="text-center">Voici l'email qui serait envoyé à la structure</h3>
  <div class="mx-auto max-w-2xl rounded-md bg-service-gray p-s32">
    Bonjour,<br /><br />
    <!-- {$userInfo?.fullName}  -->
    [Prénom accompagnateur] [nom accompagnateur] de la structure
    <strong>
      <!-- {$userInfo?.structures[$userInfo.structures.length - 1].name} -->
      [structure_accompagnateur]
    </strong>
    vous a adressé un bénéficiaire pour le service
    <strong
      ><a href="/services/{data.service.slug}" class="text-info underline"
        >{data.service.name}</a
      >.
    </strong>
    <br /><br />

    La personne orientée :<br />
    <ul class="list-inside list-disc">
      <li>
        {$orientation.beneficiaryFirstName}
        {$orientation.beneficiaryLastName}
      </li>
      <li>
        {contactInfoDisplay}
        (joignable par {contactPrefDisplay})
      </li>
      {#if $orientation.beneficiaryDisponibility}
        <li>
          est disponible à partir de {$orientation.beneficiaryDisponibility}.
        </li>
      {/if}
    </ul>
    <br />

    La personne répond aux critères suivants : <br />
    <ul class="list-inside list-disc">
      {#each concernedPublic || [] as cP}
        <li>{cP.label}</li>
      {/each}
      {#each requirements || [] as req}
        <li>{req.label}</li>
      {/each}
      {#each accessConditions || [] as ac}
        <li>{ac.label}</li>
      {/each}
      {#if $orientation.hasOtherConcernedPublic}
        <li>{$orientation.otherConcernedPublic}</li>
      {/if}
    </ul>
    <br />
    Pièces justificatives :
    <ul class="list-inside list-disc">
      {#each attachments as link}
        <li><a href="" class="underline">{link}</a></li>
      {/each}
    </ul>
    <br />

    La <strong>personne référente</strong> est :<br /><br />
    <ul class="list-inside list-disc">
      <li>{$orientation.referentFirstName} {$orientation.referentLastName}</li>
      <li>
        {$orientation.referentEmail} -
        {$orientation.referentPhone}
      </li>
      <li>
        Vous pouvez la contacter pour avoir plus de détails sur le bénéficiaire
      </li>
    </ul>
    <br />
    <br />

    {#if $orientation.orientationReasons}
      Les détails : <br /><br />
      <p class="italic">{$orientation.orientationReasons}</p>
      <br />
    {/if}

    <strong>Actions possibles:</strong><br /><br />

    <a href="" class="underline">Contacter l'accompagnateur</a><br />
    <a href="" class="underline">Contacter le bénéficiaire </a><br />
    <a href="" class="underline">Valider la demande</a><br />
    <a href="" class="underline">Invalider la demande </a><br />
    <a href="" class="underline">Être notifié·e dans une semaine</a>
  </div>
</Layout>
