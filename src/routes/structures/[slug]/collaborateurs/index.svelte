<script context="module">
  import { get } from "svelte/store";
  import { browser } from "$app/env";
  import {
    getStructure,
    getMembers,
    getPutativeMembers,
  } from "$lib/structures";
  import { userInfo, userStructures } from "$lib/auth";

  export async function load({ params }) {
    const info = get(userInfo);

    const structureSlug = params.slug;

    const structures = get(userStructures);

    const canSeeStructure = structures.find((s) => (s.slug = structureSlug));

    const structMembers = await getMembers(structureSlug);
    const userIsAdminOfStruct = structMembers?.find(
      (m) => m.user.email === info.email && m.isAdmin
    );

    const structure = await getStructure(structureSlug);

    if (!structure || (!canSeeStructure && !info?.isBizdev && !info?.isStaff)) {
      // sur le serveur, info est toujours null,
      // donc on ne veut retourner une 404 que sur le client
      if (browser) {
        return {
          status: 404,
          error: "Page Not Found",
        };
      }

      return {};
    }

    const canSeeMembers =
      userIsAdminOfStruct || info?.isBizdev || info?.isStaff;

    return {
      props: {
        structure,
        members: structMembers,
        putativeMembers: canSeeMembers
          ? await getPutativeMembers(structureSlug)
          : [],
        canSeeMembers,
        canEditMembers: userIsAdminOfStruct || info?.isStaff,
        canInviteMembers:
          userIsAdminOfStruct || info?.isStaff || info?.isBizdev,
      },
    };
  }
</script>

<script>
  import EnsureLoggedIn from "$lib/components/ensure-logged-in.svelte";
  import MemberInvited from "./_member_invited.svelte";
  import MemberToConfirm from "./_member_to_confirm.svelte";
  import Button from "$lib/components/button.svelte";
  import AddUserModal from "./_add-user-modal.svelte";
  import MemberStandard from "./_member_standard.svelte";

  export let structure, members, putativeMembers;
  export let canSeeMembers, canEditMembers, canInviteMembers;
  let addUserModalIsOpen = false;

  async function handleRefreshMemberList() {
    members = await getMembers(structure.slug);
    putativeMembers = await getPutativeMembers(structure.slug);
  }

  function sortedMembers(items) {
    return items.sort((a, b) => {
      if (a.isAdmin && !b.isAdmin) return -1;
      if (!a.isAdmin && b.isAdmin) return 1;
      const lA = a.user.lastName || a.user.email;
      const lB = b.user.lastName || b.user.email;
      return lA.localeCompare(lB, "fr");
    });
  }
</script>

<svelte:head>
  <title>{structure?.name} | Collaborateurs | DORA</title>
</svelte:head>

<EnsureLoggedIn>
  <AddUserModal
    bind:isOpen={addUserModalIsOpen}
    {structure}
    {members}
    onRefresh={handleRefreshMemberList}
  />

  <div class="col-span-full md:flex md:items-center md:justify-between">
    <h2 class="mb-s24 text-france-blue">Collaborateurs</h2>

    {#if structure.canWrite && canInviteMembers}
      <Button
        to={`/structures/${structure.slug}/editer`}
        label="Inviter un collaborateur…"
        small
        on:click={() => (addUserModalIsOpen = true)}
      />
    {/if}
  </div>

  {#if canSeeMembers && members}
    <div class="col-span-full mt-s32 mb-s32 flex flex-col gap-s8">
      {#if putativeMembers}
        {#each sortedMembers(putativeMembers) as member}
          {#if member.invitedByAdmin}
            <MemberInvited
              {member}
              onRefresh={handleRefreshMemberList}
              readOnly={!canEditMembers}
            />
          {:else}
            <MemberToConfirm
              {member}
              onRefresh={handleRefreshMemberList}
              readOnly={!canEditMembers}
            />
          {/if}
        {/each}
      {/if}
      {#each sortedMembers(members) as member}
        <MemberStandard
          {member}
          onRefresh={handleRefreshMemberList}
          isMyself={member.user.email === $userInfo.email}
          isOnlyAdmin={member.user.email === $userInfo.email &&
            members.filter((m) => m.isAdmin).length === 1}
          readOnly={!canEditMembers}
        />
      {/each}
    </div>
  {/if}
</EnsureLoggedIn>
