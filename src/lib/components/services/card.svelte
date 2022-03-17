<script>
  import Tag from "$lib/components/tag.svelte";
  import { mapPinIcon } from "$lib/icons";
  import Label from "$lib/components/label.svelte";
  import { checkBoxBlankIcon } from "$lib/icons";

  export let service;
</script>

<div class="rounded-md px-s20 py-s24 shadow-md">
  {#if service.isSuggestion}
    <Label label="Suggestion" icon={checkBoxBlankIcon} smallIcon error bold />
  {:else if service.isDraft}
    <Label label="Brouillon" icon={checkBoxBlankIcon} smallIcon wait bold />
  {:else}
    <Label label="Publié" icon={checkBoxBlankIcon} smallIcon success bold />
  {/if}
  <h4><a href="/services/{service.slug}">{service.name}</a></h4>
  <div class="mt-s8 flex flex-col gap-s16">
    <Tag selfStart>{service.categoryDisplay}</Tag>
    <Label
      label={`${service.postalCode}, ${service.city}`}
      smallIcon
      icon={mapPinIcon}
    />
  </div>
</div>
