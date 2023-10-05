<script lang="ts">
  import { setBookmark, setDiBookmark } from "$lib/requests/services";
  import { refreshUserInfo, userInfo } from "$lib/utils/auth";

  export let slug: string;
  export let isDI = false;

  $: isBookmarked =
    $userInfo?.bookmarks
      .map((bookmark) => bookmark.service.slug)
      .includes(slug) ||
    $userInfo?.diBookmarks.map((diBookmark) => diBookmark.diId).includes(slug);

  async function handleFavClick() {
    if (isDI) {
      await setDiBookmark(slug, !isBookmarked);
    } else {
      await setBookmark(slug, !isBookmarked);
    }
    await refreshUserInfo();
  }
</script>

<slot onBookmark={handleFavClick} {isBookmarked} />
