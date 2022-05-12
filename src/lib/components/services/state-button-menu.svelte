<script>
  import { arrowDownSIcon } from "$lib/icons";

  import ButtonMenu from "$lib/components/button-menu.svelte";
  import StateMenu from "./state-menu.svelte";

  export let service;
  export let onRefresh;
</script>

<ButtonMenu icon={arrowDownSIcon} let:onClose={onCloseParent}>
  <StateMenu
    {service}
    onRefresh={async () => {
      await onCloseParent();
      await onRefresh();
    }}
  />
</ButtonMenu>
