<script lang="ts">
  import { clearBookmark, setBookmark } from "$lib/requests/services";
  import { refreshUserInfo, userInfo } from "$lib/utils/auth";

  export let slug: string;
  export let isDI = false;

  $: isBookmarked = $userInfo?.bookmarks
    .map((bookmark) => bookmark.slug)
    .includes(slug);

  async function handleFavClick() {
    if (isBookmarked) {
      await clearBookmark(slug, isDI);
    } else {
      await setBookmark(slug, isDI);
    }

    await refreshUserInfo();
  }
</script>

<slot onBookmark={handleFavClick} {isBookmarked} />
