<script lang="ts">
  import { moreIcon } from "$lib/icons";
  import type {
    Service,
    DashboardService,
    SERVICE_UPDATE_STATUS,
  } from "$lib/types";

  import ButtonMenu from "$lib/components/button-menu.svelte";
  import ServiceMenu from "./service-menu.svelte";

  export let service: Service | DashboardService;
  export let updateStatus: SERVICE_UPDATE_STATUS | undefined;
  export let onRefresh: () => void | undefined;
</script>

<ButtonMenu
  icon={moreIcon}
  small
  wrapperExtraClass="border border-magenta-cta rounded py-s4"
>
  <ServiceMenu {service} {updateStatus} {onRefresh} />
</ButtonMenu>
