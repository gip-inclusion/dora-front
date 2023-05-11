<script lang="ts">
  import LinkButton from "$lib/components/display/link-button.svelte";
  import { arrowLeftLineIcon } from "$lib/icons";
  import Layout from "../layout.svelte";
  import type { PageData } from "./$types";
  import { orientation } from "../store";

  export let data: PageData;
  $: concernedPublic = data.servicesOptions.concernedPublic.filter((elt) =>
    $orientation.concernedPublic?.includes(elt.value)
  );
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

  <div class="bg-service-gray">
    Bonjour,<br />
    [prénom_accompagnateur] [nom_accompagnateur] de la structure [structure_accompagnateur]
    vous a adressé un bénéficiaire pour le service [nom_service]. <br />

    La personne orientée :<br />
    [prenom_beneficiaire] [nom_beneficiaire]<br />
    [email_beneficiaire] - [téléphone_beneficiaire] (joignable par [preference_beneficiaire])
    est disponible à partir de [disponibilite_beneficiaire]. <br />

    La personne répond aux critères suivants : <br />
    <ul class="list-inside list-disc">
      {#each concernedPublic as cP}
        <li>{cP.label}</li>
      {/each}
    </ul>
    ---<br />
    Vous allez retrouver en pièce jointe : aides-a-la-recherche.pdf, loremipsum.doc,
    3 derniers avis d'imposition, Attestation Reconnaissance Qualité Travailleur
    Handicapé, Attestation sur l'honneur, CV. <br />

    La personne référente est :<br />
    [prenom_référente] [nom_référente] <br />[email_référente] -
    [téléphone_référente]<br />
    Vous pouvez la contacter pour avoir plus de détails sur le bénéficiaire

    <br />Les détails : <br />Fusce dapibus, tellus ac cursus commodo, tortor
    mauris condimentum nibh, ut fermentum massa justo sit amet risus. Lorem
    ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis, est non
    commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
    Cras mattis consectetur purus sit amet fermentum. Donec sed odio dui. Aenean
    eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.
    Maecenas faucibus mollis interdum. <br />Actions possibles :
  </div>
</Layout>
