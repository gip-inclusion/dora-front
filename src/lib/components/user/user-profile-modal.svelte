<script lang="ts">
  import { userInfo } from "$lib/utils/auth";
  import UserProfileForm from "./user-profile-form.svelte";
  import Modal from "$lib/components/hoc/modal.svelte";
  import dayjs from "dayjs";

  const USER_PROFILE_MODAL_KEY = "noUserProfileModalUntil";

  let isOpen = false;

  function isUserProfileModalOpen(): boolean {
    if ($userInfo.mainActivity) {
      return false;
    }

    const userProfileModalUntil = localStorage.getItem(USER_PROFILE_MODAL_KEY);
    if (userProfileModalUntil === null) {
      return true;
    }

    try {
      return dayjs().isAfter(dayjs(userProfileModalUntil));
    } catch (_err) {
      return true;
    }
  }

  function onSuccess() {
    isOpen = false;
  }

  function onClose() {
    localStorage.setItem(
      USER_PROFILE_MODAL_KEY,
      dayjs().add(10, "hours").toISOString()
    );
    isOpen = false;
  }

  $: isOpen = isUserProfileModalOpen();
</script>

<Modal bind:isOpen title="Dites-nous plus sur vous !" on:close={onClose}>
  <UserProfileForm {onSuccess} />
</Modal>
