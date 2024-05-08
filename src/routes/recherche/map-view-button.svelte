<script>
  import mapViewImage from "$lib/assets/illustrations/map-view.jpg";

  import Button from "$lib/components/display/button.svelte";
</script>

<div
  style={`background-image: url('${mapViewImage}'); height: 116px`}
  class="flex items-center justify-center rounded-ml bg-cover"
>
  <Button label="Voir sur la carte" />
</div>
