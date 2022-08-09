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

<h1>
  {structure.name}
  <WebSearchLink searchString={structure.name} />
  <a
    class="text-f12 underline"
    href="/structures/{structure.slug}"
    target="_blank">front</a
  >
  <a
    class="text-f12 underline"
    href="{getApiURL()}/admin/structures/structure/{structure.id}/"
    target="_blank">back</a
  >
</h1>
{#if structure.parent.slug}
  <InfoLine>
    Antenne de <strong>{structure.parent.name}</strong>
    {structure.parent.slug}
    <a
      class="text-f12 underline"
      href="/structures/{structure.parent.slug}"
      target="_blank">front</a
    >
    <a
      class="text-f12 underline"
      href="/admin/structures/{structure.parent.slug}"
      target="_blank">admin</a
    >
    <a
      class="text-f12 underline"
      href="{getApiURL()}/admin/structures/structure/{structure.parent.id}/"
      target="_blank">back</a
    >
  </InfoLine>
{/if}

<nav class="my-s24 flex flex-row gap-s10 text-f12 uppercase italic underline">
  <a href="#contacts">Contacts</a> |
  <a href="#infos">Informations</a>
  {#if structure.members.length}| <a href="#collabs">Collaborateurs•trices</a
    >{/if}
  {#if structure.pendingMembers.length}| <a href="#pending-collabs"
      >Collaborateurs•trices en attente</a
    >{/if}
  {#if structure.branches.length}| <a href="#branches">Antennes</a>{/if}
  {#if structure.models.length}| <a href="#models">Modèles</a>{/if}
  {#if structure.services.length}| <a href="#services">Services</a>{/if}
</nav>

<h2 id="contacts">Contacts</h2>

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

<h2 id="infos">Informations</h2>

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
  {structure.shortDesc}
</InfoLine>
<InfoLine condition={structure.fullDesc}>
  Description longue:
  <div class="prose-sm rounded-md border-2 border-gray-02 p-s16">
    <TextClamp text={description} />
  </div>
</InfoLine>

<InfoLine condition={structure.department}>
  Département: {structure.department}
</InfoLine>

<InfoLine>
  Adresse: {#if structure.longitude && structure.latitude}
    <a
      class="text-f12 underline"
      href="https://www.google.com/maps/search/?api=1&query={structure.latitude},{structure.longitude}"
      target="_blank"
      rel="noopener nofollow noreferrer">google map</a
    >
  {/if}<br />
  {#if structure.address1}{structure.address1} <br />{/if}
  {#if structure.address2}{structure.address2}<br />{/if}
  {#if structure.postalCode}{structure.postalCode}<br />{/if}
  {#if structure.city}{structure.city}<br />{/if}
</InfoLine>

<InfoLine condition={structure.ape}>
  Code APE: {structure.ape}

  <a
    class="text-f12 underline"
    href="https://www.insee.fr/fr/metadonnees/nafr2/sousClasse/{structure.ape}"
    target="_blank">description</a
  >
</InfoLine>

<InfoLine>
  Date de création: <Date date={structure.creationDate} />
</InfoLine>
<InfoLine>
  Date de dernière modification: <Date date={structure.modificationDate} />
</InfoLine>

{#if structure.members.length}
  <h2 id="collabs">Collaborateurs•trices</h2>

  {#each structure.members as member}
    <InfoLine>
      <UserInfo user={member.user} />
      <strong>{member.isAdmin ? "Administrateur•trice" : ""}</strong>
    </InfoLine>
  {/each}
{/if}

{#if structure.pendingMembers.length}
  <h2 id="pending-collabs">Collaborateurs•trices en attente</h2>
  {#each structure.pendingMembers as member}
    <InfoLine>
      <UserInfo user={member.user} />
      <strong>{member.isAdmin ? "Administrateur•trice" : ""}</strong>
      <strong>{member.invitedByAdmin ? "Invité•e" : ""}</strong>
    </InfoLine>
  {/each}
{/if}

{#if structure.branches.length}
  <h2 id="branches">Antennes</h2>
  {#each structure.branches as branch}
    <InfoLine>
      <h3>{branch.name}</h3>

      <a
        class="text-f12 underline"
        href="/structures/{branch.slug}"
        target="_blank">front</a
      >
      <a
        class="text-f12 underline"
        href="/admin/structures/{branch.slug}"
        target="_blank">admin</a
      >
      <a
        class="text-f12 underline"
        href="{getApiURL()}/admin/structures/structure/{branch.id}/"
        target="_blank">back</a
      >
    </InfoLine>
    <InfoLine condition={branch.shortDesc}>
      {branch.shortDesc}
    </InfoLine>
  {/each}
{/if}

{#if structure.models.length}
  <h2 id="models">Modèles</h2>

  {#each structure.models as model}
    <h3>
      name: {model.name}
      <a class="text-f12 underline" href="/modeles/{model.slug}" target="_blank"
        >front</a
      >
      <a
        class="text-f12 underline"
        href="{getApiURL()}/admin/services/servicemodel/{model.id}/"
        target="_blank">back</a
      >
    </h3>
    <InfoLine condition={model.shortDesc}>
      {model.shortDesc}
    </InfoLine>
  {/each}
{/if}

{#if structure.services.length}
  <h2 id="services">Services</h2>

  {#each structure.services as service}
    <h3>
      name: {service.name}
      <a
        class="text-f12 underline"
        href="/services/{service.slug}"
        target="_blank">front</a
      >
      <a
        class="text-f12 underline"
        href="/admin/services/{service.slug}"
        target="_blank">admin</a
      >
      <a
        class="text-f12 underline"
        href="{getApiURL()}/admin/services/service/{service.id}/"
        target="_blank">back</a
      >
    </h3>
    <InfoLine condition={service.shortDesc}>
      {service.shortDesc}
    </InfoLine>
  {/each}
{/if}
