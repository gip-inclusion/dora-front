<script>
  import { userInfo } from "$lib/auth";

  import EnsureLoggedIn from "$lib/components/ensure-logged-in.svelte";
  import CenteredGrid from "$lib/components/layout/centered-grid.svelte";
  import SearchResult from "../_homepage/_search-result.svelte";

  // TODO:
  // - empty state
  // - don't remove unbookmarked cards from this page, to allow undoing
  // - those are not 'search results' ! refactor
</script>

<svelte:head>
  <title>Mes favoris | DORA</title>
</svelte:head>

<EnsureLoggedIn>
  <CenteredGrid>
    <h1 class="mb-s64 text-center text-france-blue">Mes favoris</h1>

    <p class="mb-s40 text-f21 font-bold text-gray-dark">
      Vous avez {$userInfo.bookmarks.length} fiches sauvegardées.
    </p>
    {#each $userInfo.bookmarks as bookmark}
      <SearchResult result={bookmark.service} />
    {/each}
  </CenteredGrid>
</EnsureLoggedIn>
