<script lang="ts">
  import FieldSet from "$lib/components/display/fieldset.svelte";
  import BasicInputField from "$lib/components/inputs/basic-input-field.svelte";
  import CheckboxesField from "$lib/components/inputs/checkboxes-field.svelte";
  import FieldsAddress from "$lib/components/specialized/services/fields-address.svelte";
  import type { Service, ServicesOptions, Structure } from "$lib/types";
  import { moveToTheEnd } from "$lib/utils/misc";

  export let servicesOptions: ServicesOptions, service: Service;
  export let structure: Structure | undefined = undefined;
</script>

<FieldSet title="Accueil">
  <CheckboxesField
    label="Mode d’accueil"
    id="locationKinds"
    bind:value={service.locationKinds}
    required
    choices={moveToTheEnd(servicesOptions.locationKinds, "value", "a-distance")}
  />

  {#if service.locationKinds.includes("a-distance")}
    <BasicInputField
      placeholder="https://"
      type="url"
      label="Lien visioconférence"
      id="remoteUrl"
      bind:value={service.remoteUrl}
    />
  {/if}

  {#if service.locationKinds.includes("en-presentiel")}
    <FieldsAddress bind:entity={service} parent={structure} />
  {/if}
</FieldSet>
