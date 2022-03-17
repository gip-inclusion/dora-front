<script>
  import { page } from "$app/stores";
  import Label from "$lib/components/label.svelte";
  import { mapPinIcon } from "$lib/icons";
  import Tabs from "$lib/components/tabs-links.svelte";

  export let structure;
  export let tabId = "informations";
  export let hasServices = false;
  export let hasAntennes = false;

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

  const tabs = [
    {
      id: "informations",
      name: "Informations",
      href: `/structures/${structure.slug}/`,
    },
  ];

  if (hasAntennes) {
    tabs.splice(1, 0, {
      id: "antennes",
      name: "Antennes",
      href: `/structures/${structure.slug}/antennes`,
    });
  }

  if (hasServices || structure.canWrite) {
    tabs.splice(1, 0, {
      id: "services",
      name: "Services",
      href: `/structures/${structure.slug}/services`,
    });
  }

  if (structure.canWrite) {
    tabs.splice(1, 0, {
      id: "collaborateurs",
      name: "Collaborateurs",
      href: `/structures/${structure.slug}/collaborateurs`,
    });
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
<div class="mt-s24">
  <Tabs items={tabs} itemId={tabId} />
</div>
