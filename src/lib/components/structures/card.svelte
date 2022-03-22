<script>
  import Tag from "$lib/components/tag.svelte";
  import { mapPinIcon } from "$lib/icons";
  import Label from "$lib/components/label.svelte";
  export let structure;
</script>

<div class="rounded-md px-s20 py-s12 shadow-md">
  <div class="my-s8 flex flex-col gap-s16">
    <h4><a href="/structure/{structure.slug}">{structure.name}</a></h4>

    <Tag selfStart>{structure.categoryDisplay}</Tag>
    {#if structure.postalCode || structure.city}
      <Label
        label={`${structure.postalCode}, ${structure.city}`}
        smallIcon
        icon={mapPinIcon}
      />
    {/if}
  </div>
</div>
