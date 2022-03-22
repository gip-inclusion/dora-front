<script context="module">
  import { get } from "svelte/store";
  import { userInfo } from "$lib/auth";
  import { getStructure, getStructureServices } from "$lib/structures";

  export async function load({ params }) {
    const slug = params.slug;
    const structure = await getStructure(slug);

    if (!structure) {
      return {
        status: 404,
        error: "Page Not Found",
      };
    }

    const info = get(userInfo);
    const canEdit = structure.isMember || info?.isStaff;
    const services = await getStructureServices(slug, {
      publishedOnly: !canEdit,
    });

    const antennes = [
      {
        siret: "82245456700030",
        codeSafirPe: null,
        typology: "ASSO",
        typologyDisplay: "Associations",
        slug: "garage-antenne",
        name: "GARAGE Antenne",
        shortDesc:
          "Le Garage Solidaire de Lorraine est une association qui accompagne les usagers dans l'accès à un véhicule : réparations et ventes de voitures à tarifs différenciés et locations solidaires. Il propose également des ateliers d'information autour de l'accès et l'usage du véhicule.",
        url: "",
        fullDesc:
          "<p>Le Garage Solidaire de Lorraine propose à tous de faire réparer, acheter ou louer un véhicule avec des tarifs solidaires pour les personnes en difficulté et offre aux autres la possibilité de participer à une économie sociale et solidaire.</p>\n<p>Le Garage Solidaire de Lorraine est également un chantier d'insertion qui offre un tremplin aux personnes souhaitant être accompagnées et se professionnaliser sur des postes au sein de son atelier mécanique et à l'accueil.</p>",
        facebookUrl: "",
        linkedinUrl: "",
        twitterUrl: "",
        youtubeUrl: "",
        instagramUrl: "",
        ressourcesUrl: "",
        phone: "9566593413",
        faqUrl: "",
        contactFormUrl: "",
        email: "jovani@example.com",
        postalCode: "54320",
        cityCode: "54357",
        city: "MAXEVILLE",
        department: "54",
        address1: "33 AV DE LA MEURTHE",
        address2: "",
        hasServices: false,
        ape: "45.20A",
        longitude: 6.177757,
        latitude: 48.709338,
        creationDate: "2022-01-03T10:14:10.995663+01:00",
        modificationDate: "2022-03-17T15:03:35.502120+01:00",
        canWrite: true,
      },
    ];

    return {
      props: {
        structure,
        services,
        antennes,
      },
      stuff: {
        structure,
        services,
        antennes,
      },
    };
  }
</script>

<script>
  import CenteredGrid from "$lib/components/layout/centered-grid.svelte";
  import Header from "./_header.svelte";

  export let structure;
  export let services;
  export let antennes;
</script>

<CenteredGrid --col-bg="var(--col-magenta-brand)" topPadded>
  <div class="col-span-full">
    <Header
      {structure}
      hasServices={!!services?.length}
      hasAntennes={!!antennes?.length}
    />
  </div>
</CenteredGrid>

<CenteredGrid
  roundedbg
  --col-under-bg="var(--col-magenta-brand)"
  --col-content-bg="var(--col-bg)"
  topPadded
>
  <slot />
</CenteredGrid>
