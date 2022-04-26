<script>
  import CG from "$lib/components/layout/centered-grid.svelte";

  function hR(id) {
    iFrameResize({}, id);
  }
</script>

<svelte:head>
  <title>Statistiques | DORA</title>
  <script
    src="https://metabase.dora.fabrique.social.gouv.fr/app/iframeResizer.js">
  </script>
</svelte:head>

<CG>
  <div class="col-span-full text-center">
    <h1 class="text-france-blue">Statistiques</h1>
  </div>
</CG>

<CG>
  <iframe
    class="col-span-full"
    title="Dashboard Plausible"
    src="https://plausible.io/share/dora.incubateur.net?auth=LQk4ORKTzLFyGJSBAl761&embed=true&theme=light&background=%23FFFFFF"
    frameborder="0"
    allowtransparency
    on:load={hR("#plausibleIframe")}
    id="plausibleIframe"
  />

  <script async src="https://plausible.io/js/embed.host.js"></script>

  <iframe
    class="col-span-full"
    title="Dashboard Metabase"
    src="https://metabase.dora.fabrique.social.gouv.fr/public/dashboard/9f65d982-fe2e-48f6-bb41-b829b89c29f9#bordered=false&titled=false"
    frameborder="0"
    allowtransparency
    on:load={hR("#metabaseIframe")}
    id="metabaseIframe"
  />
</CG>

<style lang="postcss">
  iframe {
    width: 100%;
  }
</style>
