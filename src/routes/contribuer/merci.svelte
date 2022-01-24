<script>
  import ContributionPic from "$lib/assets/illu_contribution.svg";

  import { addCircleIcon } from "$lib/icons";
  import CenteredGrid from "$lib/components/layout/centered-grid.svelte";
  import LinkButton from "$lib/components/link-button.svelte";
</script>

<svelte:head>
  <title>Merci pour votre contribution | DORA</title>
  <meta
    name="description"
    content="Aidez-nous à identifier et référencer l’ensemble de l’offre de l’insertion"
  />
</svelte:head>
<CenteredGrid
  topPadded
  extraClass="bg-gradient-to-b from-magenta-10 to-magenta-10/0"
>
  <div class="col-span-full mb-s40">
    <div class="flex gap-s24 ">
      <img
        class="flex-none"
        src={ContributionPic}
        width="587"
        height="532"
        alt=""
      />
      <div class="flex-1">
        <h1 class="text-france-blue">Merci pour votre contribution&nbsp;!</h1>

        <p class="paragraph mt-s24 mb-s32 text-gray-dark">
          Les informations que vous avez proposées ont été enregistrées. Dès que
          la structure validera et complètera vos propositions, le service sera
          réferencé sur la plateforme DORA.
        </p>

        <LinkButton
          label="Proposer un nouveau service"
          to={"/contribuer/etape1"}
          icon={addCircleIcon}
          iconOnRight
        />
      </div>
    </div>
  </div>
</CenteredGrid>
