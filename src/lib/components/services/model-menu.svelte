<script>
  import LinkButton from "$lib/components/link-button.svelte";

  export let model;
  export let secondary = false;
  export let inline = false;
</script>

<div class:flex={inline} class:gap-s8={inline} class:items-start={inline}>
  <LinkButton
    label="Modifier"
    to="/modeles/{model.slug}/editer"
    small
    noBackground={!secondary}
    {secondary}
  />
</div>
