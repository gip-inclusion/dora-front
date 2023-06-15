<script lang="ts">
  import { getABTestingUserGroup } from "$lib/utils/ab-testing";

  export let abTestingName: string;
  export let showIfGroups: string[] = [];

  const userGroup = getABTestingUserGroup(abTestingName);
</script>

{#if showIfGroups.includes(userGroup)}
  <slot />
{/if}
