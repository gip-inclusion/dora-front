<script lang="ts">
  import { userInfo } from "$lib/utils/auth";
  import MainActivityForm from "./main-activity-form.svelte";
  import Modal from "$lib/components/hoc/modal.svelte";
  import dayjs from "dayjs";

  const MAIN_ACTIVITY_KEY = "noMainActivityModalUntil";

  let isOpen = false;

  function isMainActivityModalOpen(): boolean {
    if ($userInfo.mainActivity) {
      return false;
    }

    const mainActivityUntil = localStorage.getItem(MAIN_ACTIVITY_KEY);
    if (mainActivityUntil === null) {
      return true;
    }

    try {
      return dayjs().isAfter(dayjs(mainActivityUntil));
    } catch (_err) {
      return true;
    }
  }

  function onSuccess() {
    isOpen = false;
  }

  function onClose() {
    localStorage.setItem(
      MAIN_ACTIVITY_KEY,
      dayjs().add(10, "hours").toISOString()
    );
    isOpen = false;
  }

  $: isOpen = isMainActivityModalOpen();
</script>

<Modal bind:isOpen title="Dites-nous plus sur vous !" on:close={onClose}>
  <MainActivityForm {onSuccess} />
</Modal>
