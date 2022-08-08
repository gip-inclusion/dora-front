<script context="module">
  import { getStructureMod } from "$lib/structures";

  export async function load({ params, fetch }) {
    const structure = await getStructureMod(params.slug, { kitFetch: fetch });
    if (!structure) {
      return {
        status: 404,
        error: "Page Not Found",
      };
    }

    return {
      props: {
        structure,
      },
    };
  }
</script>

<script>
  import TextClamp from "$lib/components/text-clamp.svelte";
  import WebSearchLink from "../../_web-search-link.svelte";
  import { capitalize, markdownToHTML } from "$lib/utils";
  import { getApiURL } from "$lib/utils/api";
  import UserInfo from "../../_user-info.svelte";
  import CopyableText from "../../_copyable-text.svelte";
  import InfoLine from "../../_info-line.svelte";
  import Date from "$lib/components/date.svelte";

  export let structure;

  const administrators = structure.members.filter((m) => m.isAdmin);
  const description = markdownToHTML(structure.fullDesc);
</script>

<svelte:head>
  <title>Administration | {capitalize(structure.name)} | DORA</title>
</svelte:head>

<h1>{structure.name} <WebSearchLink searchString={structure.name} /></h1>

Contacts • Collaborateurs•trices • Antennes • Modèles •<a href="#services"
  >Services</a
>

<div class="mb-s32 flex flex-row gap-s24">
  <a class="underline" href="/structures/{structure.slug}" target="_blank">
    Lien front
  </a>

  <a
    class="underline"
    href="{getApiURL()}/admin/structures/structure/{structure.id}/"
    target="_blank">Lien back</a
  >
</div>

<h2>Contacts</h2>

<InfoLine condition={structure.phone}>
  téléphone: {structure.phone}
</InfoLine>

<InfoLine condition={structure.email}>
  email: {structure.email}
  <a class="text-f12 underline" href="mailto:{structure.email}">mailto</a>
  <CopyableText text={structure.email} />
</InfoLine>

<InfoLine>
  créée par: <UserInfo user={structure.creator} /><br />
</InfoLine><InfoLine>
  dernière modification par: <UserInfo user={structure.lastEditor} /><br />
</InfoLine><InfoLine>
  Orpheline: {structure.hasAdmin ? "non" : "oui"}
</InfoLine>

{#if administrators.length}
  <h3>Administrateurs•trices</h3>
  {#each administrators as administrator}
    <InfoLine>
      <UserInfo user={administrator.user} />
    </InfoLine>
  {/each}
{/if}

<h2>Informations</h2>

<InfoLine condition={structure.url}>
  <a
    href={structure.url}
    class="underline"
    target="_blank"
    rel="noopener nofollow">{structure.url}</a
  >
</InfoLine>

<InfoLine condition={structure.source}>
  source: {structure.source}
</InfoLine>

<InfoLine condition={structure.siret}>
  siret: {structure.siret}
  <a
    class="text-f12 underline"
    href="https://annuaire-entreprises.data.gouv.fr/etablissement/{structure.siret}"
    target="_blank">annuaire entreprise</a
  >
  <WebSearchLink searchString={structure.siret} />
</InfoLine>

<InfoLine condition={structure.typologyDisplay}>
  Typologie: {structure.typologyDisplay}
</InfoLine>

<InfoLine condition={structure.shortDesc}>
  Description courte: {structure.shortDesc}
</InfoLine>
<InfoLine condition={structure.fullDesc}>
  Description longue:
  <div class="rounded-md border-2 border-gray-02 p-s16">
    <TextClamp text={description} />
  </div>
</InfoLine>

<InfoLine condition={structure.department}>
  Département: {structure.department}
</InfoLine>

<InfoLine condition={structure.address1}>
  Adresse: {structure.address1}
  {structure.address2}
</InfoLine>
<InfoLine condition={structure.postalCode}>
  Code postal: {structure.postalCode}
</InfoLine>
<InfoLine condition={structure.city}>
  Ville: {structure.city}
</InfoLine>
{#if structure.longitude && structure.latitude}
  <a
    class="text-f12 underline"
    href="https://www.google.com/maps/search/?api=1&query={structure.latitude},{structure.longitude}"
    target="_blank"
    rel="noopener nofollow noreferrer">google map</a
  >

  <InfoLine condition={structure.ape}>
    Code APE: {structure.ape}

    <a
      class="text-f12 underline"
      href="https://www.insee.fr/fr/metadonnees/nafr2/sousClasse/{structure.ape}"
      target="_blank">description</a
    >
  </InfoLine>
{/if}

<InfoLine>
  Date de création: <Date date={structure.creationDate} />
</InfoLine>
<InfoLine>
  Date de dernière modification: <Date date={structure.modificationDate} />
</InfoLine>

{#if structure.members}
  <h2>Collaborateurs•trices</h2>

  {#each structure.members as member}
    <InfoLine>
      <UserInfo user={member.user} />
      <strong>{member.isAdmin ? "Administrateur•trice" : ""}</strong>
    </InfoLine>
  {/each}
{/if}

{#if structure.pendingMembers}
  <h2>Collaborateurs•trices en attente</h2>
  {#each structure.pendingMembers as member}
    <InfoLine>
      <UserInfo user={member.user} />
      <strong>{member.isAdmin ? "Administrateur•trice" : ""}</strong>
      <strong>{member.invitedByAdmin ? "Invité•e" : ""}</strong>
    </InfoLine>
  {/each}
{/if}

# TODO: format parent: {structure.parent} # TODO: link, is it a branch

{#if structure.branches.length}
  <h2>Antennes</h2>
  {#each structure.branches as branch}
    slug: {branch.slug} # TODO: link, link back name: {branch.name}
    department: {branch.department}
    typologyDisplay: {branch.typologyDisplay}
    modificationDate: {branch.modificationDate} # TODO: format numServices: {branch.numServices}
  {/each}
{/if}

{#if structure.models.length}
  <h2>Modèles</h2>
  numModels : {structure.numModels}

  {#each structure.models as model}
    <h3>
      name: {model.name}
      <a class="text-f12 underline" target="_blank" href="/modeles/{model.slug}"
        >ouvrir</a
      >
    </h3>
    # TODO link, link back slug: {model.slug}
    name: {model.name}
    department: {model.department}
    modificationDate: {model.modificationDate}
    categoriesDisplay: {model.categoriesDisplay}
    shortDesc: {model.shortDesc}
    structure: {model.structure}
    numServices: {model.numServices}
  {/each}
{/if}

{#if structure.services.length}
  <h2 id="services">Services</h2>
  numServices : {structure.numServices}

  {#each structure.services as service}
    <h3>
      name: {service.name}
      <a
        class="text-f12 underline"
        target="_blank"
        href="/services/{service.slug}">ouvrir</a
      >
      <a
        class="text-f12 underline"
        target="_blank"
        href="/admin/services/{service.slug}">admin</a
      >
    </h3>
    # TODO link, link back category: {service.category}
    categoryDisplay: {service.categoryDisplay}
    slug: {service.slug}

    postalCode: {service.postalCode}
    city: {service.city}
    department: {service.department}
    status: {service.status}
    modificationDate: {service.modificationDate}
    categoriesDisplay: {service.categoriesDisplay}
    shortDesc: {service.shortDesc}
    diffusionZoneType: {service.diffusionZoneType}
    diffusionZoneTypeDisplay: {service.diffusionZoneTypeDisplay}
    diffusionZoneDetailsDisplay: {service.diffusionZoneDetailsDisplay}
    modelChanged: {service.modelChanged}
    model: {service.model}
    structure: {service.structure}
  {/each}
{/if}

{#if structure.archivedServices.length}
  <h2 id="archived-services">Services archivés</h2>
  {#each structure.archivedServices as service}
    <h3>name: {service.name}</h3>
    # TODO link, link back category: {service.category}
    categoryDisplay: {service.categoryDisplay}
    slug: {service.slug}
    postalCode: {service.postalCode}
    city: {service.city}
    department: {service.department}
    status: {service.status}
    modificationDate: {service.modificationDate}
    categoriesDisplay: {service.categoriesDisplay}
    shortDesc: {service.shortDesc}
    diffusionZoneType: {service.diffusionZoneType}
    diffusionZoneTypeDisplay: {service.diffusionZoneTypeDisplay}
    diffusionZoneDetailsDisplay: {service.diffusionZoneDetailsDisplay}
    modelChanged: {service.modelChanged}
    model: {service.model}
    structure: {service.structure}
  {/each}
{/if}
