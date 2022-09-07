<script>
  import { onMount } from "svelte";
  import { token, userInfo } from "$lib/auth";

  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  onMount(() => {
    if (!$token) {
      console.log($page.url.pathname + $page.url.search);
      goto(
        `/auth/connexion?next=${encodeURIComponent(
          $page.url.pathname + $page.url.search
        )}`
      );
    }
  });
</script>

{#if $userInfo}
  <slot />
{/if}
