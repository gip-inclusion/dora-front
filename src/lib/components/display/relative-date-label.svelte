<script lang="ts">
  import { computeRelativeDateLabel } from "$lib/utils/date";

  export let date;
  export let prefix: string | undefined = undefined;
</script>

{computeRelativeDateLabel(date, prefix)}
