<script lang="ts">
  import Breadcrumb from "$lib/components/display/breadcrumb.svelte";
  import CenteredGrid from "$lib/components/display/centered-grid.svelte";
  import { userInfo } from "$lib/utils/auth";
</script>

<CenteredGrid bgColor="bg-gray-text">
  <div class="mb-s24">
    <Breadcrumb currentLocation="my-account" />
  </div>

  <h1 class="mb-s64 bg-gray-text text-white">{$userInfo?.fullName}</h1>
</CenteredGrid>

<CenteredGrid>
  <slot />
</CenteredGrid>
