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
  import InfoLine from "../../_info-line.svelte";
  import StructureContacts from "../../_structure-contacts.svelte";
  import Date from "$lib/components/date.svelte";
  import SmallLink from "../../_small-link.svelte";
  import CenteredGrid from "$lib/components/layout/centered-grid.svelte";

  export let structure;

  const description = markdownToHTML(structure.fullDesc);
</script>

<svelte:head>
  <title>Administration | {capitalize(structure.name)} | DORA</title>
</svelte:head>

<CenteredGrid bgColor="bg-gray-bg">
  <div class="text-f12">
    <h2>
      <a href="/admin/structures">Structures</a>
      <span class="text-f10">
        <a href="#contacts">Contacts</a> |
        <a href="#infos">Informations</a>
        {#if structure.members.length}| <a href="#collabs"
            >Collaborateurs•trices</a
          >{/if}
        {#if structure.pendingMembers.length}| <a href="#pending-collabs"
            >Collaborateurs•trices en attente</a
          >{/if}
        {#if structure.branches.length}| <a href="#branches">Antennes</a>{/if}
        {#if structure.models.length}| <a href="#models">Modèles</a>{/if}
        {#if structure.services.length}| <a href="#services">Services</a>{/if}
      </span>
    </h2>

    <h3>
      {structure.name}
      <SmallLink link="/structures/{structure.slug}" label="front" />
      <SmallLink
        link="{getApiURL()}/admin/structures/structure/{structure.id}/"
        label="back"
      />
      <WebSearchLink searchString={structure.name} />
    </h3>

    {#if structure.parent.slug}
      <InfoLine>
        Antenne de <strong>{structure.parent.name}</strong>
        <SmallLink link="/structures/{structure.parent.slug}" label="front" />
        <SmallLink
          link="/admin/structures/{structure.parent.slug}"
          label="admin"
        />
        <SmallLink
          link="{getApiURL()}/admin/structures/structure/{structure.parent.id}/"
          label="back"
        />
      </InfoLine>
    {/if}

    <h4 id="contacts">Contacts</h4>

    <StructureContacts {structure} />

    <h4 id="infos">Informations</h4>
    <InfoLine condition={structure.shortDesc}>
      <div class="italic">
        {structure.shortDesc}
      </div>
    </InfoLine>
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
      <SmallLink
        link="https://annuaire-entreprises.data.gouv.fr/etablissement/{structure.siret}"
        label="annuaire entreprise"
      />
      <WebSearchLink searchString={structure.siret} />
    </InfoLine>

    <InfoLine condition={structure.typologyDisplay}>
      Typologie: {structure.typologyDisplay}
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
        <SmallLink
          link="https://www.google.com/maps/search/?api=1&query={structure.latitude},{structure.longitude}"
          label="google map"
        />
      {/if}<br />
      {#if structure.address1}{structure.address1} <br />{/if}
      {#if structure.address2}{structure.address2}<br />{/if}
      {#if structure.postalCode}{structure.postalCode}<br />{/if}
      {#if structure.city}{structure.city}<br />{/if}
    </InfoLine>

    <InfoLine condition={structure.ape}>
      Code APE: {structure.ape}
      <SmallLink
        link="https://www.insee.fr/fr/metadonnees/nafr2/sousClasse/{structure.ape}"
        label="insee"
      />
    </InfoLine>

    <InfoLine>
      Date de création: <Date date={structure.creationDate} />
    </InfoLine>
    <InfoLine>
      Date de dernière modification: <Date date={structure.modificationDate} />
    </InfoLine>

    {#if structure.members.length}
      <h4 id="collabs">Collaborateurs•trices</h4>

      {#each structure.members as member}
        <InfoLine>
          <UserInfo user={member.user} {structure} />
          <strong>{member.isAdmin ? "Administrateur•trice" : ""}</strong>
        </InfoLine>
      {/each}
    {/if}

    {#if structure.pendingMembers.length}
      <h4 id="pending-collabs">Collaborateurs•trices en attente</h4>
      {#each structure.pendingMembers as member}
        <InfoLine>
          <UserInfo user={member.user} {structure} />
          <strong>{member.isAdmin ? "Administrateur•trice" : ""}</strong>
          <strong>{member.invitedByAdmin ? "Invité•e" : ""}</strong>
        </InfoLine>
      {/each}
    {/if}

    {#if structure.branches.length}
      <h4 id="branches">Antennes</h4>
      {#each structure.branches as branch}
        <h5>
          {branch.name}

          <SmallLink link="/structures/{branch.slug}" label="front" />
          <SmallLink link="/admin/structures/{branch.slug}" label="admin" />
          <SmallLink
            link="{getApiURL()}/admin/structures/structure/{branch.id}/"
            label="back"
          />
        </h5>

        <InfoLine condition={branch.shortDesc}>
          {branch.shortDesc}
        </InfoLine>
      {/each}
    {/if}

    {#if structure.models.length}
      <h4 id="models">Modèles</h4>

      {#each structure.models as model}
        <h5>
          name: {model.name}

          <SmallLink link="/models/{model.slug}" label="front" />
          <SmallLink
            link="{getApiURL()}/admin/services/servicemodel/{model.id}/"
            label="back"
          />
        </h5>
        <InfoLine condition={model.shortDesc}>
          {model.shortDesc}
        </InfoLine>
      {/each}
    {/if}

    {#if structure.services.length}
      <h4 id="services">Services</h4>

      {#each structure.services as service}
        <h5>
          name: {service.name}

          <SmallLink link="/services/{service.slug}" label="front" />
          <SmallLink link="/admin/services/{service.slug}" label="admin" />
          <SmallLink
            link="{getApiURL()}/admin/services/service/{service.id}/"
            label="back"
          />
        </h5>
        <InfoLine condition={service.shortDesc}>
          {service.shortDesc}
        </InfoLine>
      {/each}
    {/if}
  </div>
</CenteredGrid>
