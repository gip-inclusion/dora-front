<script lang="ts">
  import ButtonMenu from "$lib/components/display/button-menu.svelte";
  import { moreIcon } from "$lib/icons";

  export let member;
  export let isMyself = false;
  export let isOnlyAdmin = false;
  export let readOnly = false;
</script>

<div
  class="flex items-center gap-s16 rounded-md border border-gray-01 py-s16 px-s24"
>
  <div class="flex flex-col">
    <strong class="mb-s4">{member.user.fullName}</strong>
    <p class="mb-s0 text-f14 text-gray-text">{member.user.email}</p>
  </div>
  <div class="grow" />
  {#if isMyself}
    <div class="mr-s12 rounded bg-magenta-10 px-s12 py-s6 text-f14">Vous</div>
  {/if}
  <slot name="label" />
  {#if !readOnly && !isOnlyAdmin}
    <div>
      <ButtonMenu icon={moreIcon} let:onClose={onCloseParent}>
        <slot name="actions" {onCloseParent} />
      </ButtonMenu>
    </div>
  {/if}
</div>
