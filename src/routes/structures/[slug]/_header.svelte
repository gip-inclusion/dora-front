<script>
  import { page } from "$app/stores";
  import Label from "$lib/components/label.svelte";
  import { mapPinIcon } from "$lib/icons";
  import Tabs from "$lib/components/tabs-links.svelte";
  import { userInfo } from "$lib/auth";
  import PendingNotice from "./_pending-notice.svelte";
  import Notice from "$lib/components/notice.svelte";
  import LinkButton from "$lib/components/link-button.svelte";

  export let structure;
  export let tabId = "informations";

  let tabs = [];

  $: {
    tabs = [
      {
        id: "informations",
        name: "Informations",
        href: `/structures/${structure.slug}/`,
      },
    ];

    if (!structure.parent && structure.branches?.length) {
      tabs.splice(1, 0, {
        id: "antennes",
        name: "Antennes",
        href: `/structures/${structure.slug}/antennes`,
      });
    }

    if (
      !!structure.services?.length ||
      structure.isMember ||
      $userInfo?.isStaff
    ) {
      tabs.splice(1, 0, {
        id: "services",
        name: "Services",
        href: `/structures/${structure.slug}/services`,
      });
    }

    if (structure.isAdmin || $userInfo?.isStaff || $userInfo?.isBizdev) {
      tabs.splice(1, 0, {
        id: "collaborateurs",
        name: "Collaborateurs",
        href: `/structures/${structure.slug}/collaborateurs`,
      });
    }
  }

  $: {
    if ($page.url.pathname.endsWith("/services")) {
      tabId = "services";
    } else if ($page.url.pathname.endsWith("/antennes")) {
      tabId = "antennes";
    } else if ($page.url.pathname.endsWith("/collaborateurs")) {
      tabId = "collaborateurs";
    } else {
      tabId = "informations";
    }
  }
</script>

<h1 class="mb-s24 text-white">{structure.name}</h1>

<Label
  label={`${structure.address1}${
    structure.address2 ? `, ${structure.address2}` : ""
  }, ${structure.postalCode} ${structure.city}`}
  icon={mapPinIcon}
  darkBg
  smallIcon
/>

{#if structure.isPendingMember}
  <div class="mt-s24"><PendingNotice /></div>
{/if}

{#if !structure.hasAdmin}
  <div class="mt-s24">
    <Notice title="Vous êtes le gestionnaire de cette structure ?">
      <p class="mb-s4 text-f14">
        Créez votre compte sur DORA. Vous pourrez ensuite mettre à jour les
        services de votre structure.
      </p>

      <div slot="button">
        {#if $userInfo}
          <LinkButton
            label="Demander l’accès"
            to="https://itou.typeform.com/doracontactsupp"
            otherTab
            nofollowsmall
            secondary
            small
          />
        {:else}
          <LinkButton
            label="Demander l’accès"
            to="/auth/inscription?siret={structure.siret}"
            otherTab
            nofollow
            small
            secondary
          />
        {/if}
      </div>
    </Notice>
  </div>
{/if}

<div class="noprint mt-s24">
  <Tabs items={tabs} itemId={tabId} />
</div>

<style lang="postcss">
  @media print {
    h1 {
      color: var(--col-magenta-brand);
    }
  }
</style>
