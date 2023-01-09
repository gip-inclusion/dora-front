<script lang="ts">
  import FieldSet from "$lib/components/display/fieldset.svelte";
  import BasicInputField from "$lib/components/inputs/basic-input-field.svelte";
  import ToggleField from "$lib/components/inputs/toggle-field.svelte";

  export let servicesOptions, service, structure;
</script>

<FieldSet title="Contact">
  <div slot="help">
    <p class="text-f14">
      Coordonnées de la personne responsable de la réception et du traitement
      des demandes d’orientation. À défaut, renseignez le courriel et le numéro
      de téléphone de votre structure.
    </p>
    <p class="text-f14">
      Par défaut, ces informations sont disponibles uniquement aux
      accompagnateurs qui ont un compte DORA. En cochant la case « Rendre
      public », les informations seront rendues disponibles à tous les visiteurs
      du site.
    </p>
  </div>
  <BasicInputField
    label="Prénom et nom"
    placeholder="Prénom et nom"
    id="contactName"
    bind:value={service.contactName}
  />
  <BasicInputField
    type="tel"
    label="Téléphone"
    placeholder="00 00 00 00 00"
    id="contactPhone"
    bind:value={service.contactPhone}
  />
  <BasicInputField
    type="email"
    label="Email"
    placeholder="nom@exemple.org"
    id="contactEmail"
    bind:value={service.contactEmail}
  />
  <ToggleField
    label="Rendre public"
    id="isContactInfoPublic"
    bind:value={service.isContactInfoPublic}
  />
</FieldSet>
