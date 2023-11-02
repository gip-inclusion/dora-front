<script lang="ts">
  import Breadcrumb from "$lib/components/display/breadcrumb.svelte";
  import CenteredGrid from "$lib/components/display/centered-grid.svelte";
  import StaticMarkdown from "$lib/components/display/static-markdown.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<CenteredGrid>
  <div class="mb-s48">
    <Breadcrumb currentLocation="privacy" dark />
  </div>

  <StaticMarkdown content={data.content} />

  <div id="matomo-opt-out">dfasdf</div>

  <script
    src="https://matomo.inclusion.beta.gouv.fr/index.php?module=CoreAdminHome&action=optOutJS&divId=matomo-opt-out&language=fr&backgroundColor=FFFFFF&fontColor=000000&fontSize=12px&fontFamily=Arial&showIntro=1"
  >
  </script>
</CenteredGrid>
