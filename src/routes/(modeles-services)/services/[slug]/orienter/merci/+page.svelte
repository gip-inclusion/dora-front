<script lang="ts">
  import LinkButton from "$lib/components/display/link-button.svelte";
  import { arrowLeftLineIcon } from "$lib/icons";
  import Layout from "../layout.svelte";
  import type { PageData } from "./$types";
  import { orientation } from "../store";
  import { userInfo } from "$lib/utils/auth";

  export let data: PageData;

  console.log($userInfo);
  console.log($orientation);

  const concernedPublic = data.servicesOptions.concernedPublic.filter((elt) =>
    $orientation.concernedPublic?.includes(elt.value)
  );
  // const credentials = data.servicesOptions.credentials.filter((elt) =>
  //   $orientation.credentials?.includes(elt.value)
  // );

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
</script>

<Layout {data}>
  <h2>Votre demande a été transmise à la structure porteuse du service</h2>
  <p>
    Une copie de cette demande vous sera transmise par e-mail, et le
    bénéficiaire recevra également une notice d’information.
  </p>

  <LinkButton
    label="Retour à la fiche"
    to="/services/{data.service.slug}"
    icon={arrowLeftLineIcon}
    noBackground
  />
  <hr class="mb-s48" />

  <h3>Voici l'email qui serait envoyé à la structure</h3>
  <div class="mx-auto max-w-2xl rounded-md bg-service-gray p-s12">
    Bonjour,<br /><br />
    {$userInfo?.fullName} de la structure
    <strong>
      {$userInfo?.structures[$userInfo.structures.length - 1].name}
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
        {$orientation.beneficiaryEmail} - {$orientation.beneficiaryPhone} (joignable
        par {contactPrefDisplay})
      </li>
      <li>
        est disponible à partir de {$orientation.beneficiaryDisponibility}.
      </li>
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
    Vous allez retrouver en pièce jointe : aides-a-la-recherche.pdf, loremipsum.doc,
    3 derniers avis d'imposition, Attestation Reconnaissance Qualité Travailleur
    Handicapé, Attestation sur l'honneur, CV. <br /><br />

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
    Les détails : <br /><br />
    <p class="italic">
      Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh,
      ut fermentum massa justo sit amet risus. Lorem ipsum dolor sit amet,
      consectetur adipiscing elit. Duis mollis, est non commodo luctus, nisi
      erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis
      consectetur purus sit amet fermentum. Donec sed odio dui. Aenean eu leo
      quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Maecenas
      faucibus mollis interdum.
    </p>
    <br />
    Actions possibles:<br /><br />

    <a href="" class="underline">Contacter l'accompagnateur</a><br />
    <a href="" class="underline">Contacter le bénéficiaire </a><br />
    <a href="" class="underline">Valider la demande</a><br />
    <a href="" class="underline">Invalider la demande </a><br />
    <a href="" class="underline">Être notifié·e dans une semaine</a>
  </div>
</Layout>
