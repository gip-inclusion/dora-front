<script>
  import CenteredGrid from "$lib/components/layout/centered-grid.svelte";
  import LinkButton from "$lib/components/link-button.svelte";

  import ContributionPic from "$lib/assets/illu_contribution.svg";
  import { addCircleIcon, checkIcon } from "$lib/icons";
</script>

<svelte:head>
  <title>Contribuer | DORA</title>
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
        <h1 class="text-france-blue">
          Aidez-nous à identifier et référencer l’ensemble de l’offre de
          l’insertion
        </h1>

        <p class="paragraph mt-s24 text-gray-dark">
          Vous connaissez des services et structures qui ne sont pas encore
          référencés sur la plateforme DORA ? Vous pouvez dès à présent
          contribuer à la construction de la première base de données publique
          de l’offre d’insertion nationale.
        </p>

        <div class="mt-s24 mb-s48 flex flex-col gap-s20">
          <div class="flex">
            <div class="icon ">
              {@html checkIcon}
            </div>
            <div class="paragraph-small">
              Vous complétez uniquement les informations que vous possédez sur
              le service, au minimum la structure, le nom du service, la
              thématique, le type de service et une courte description@nbsp;;
            </div>
          </div>
          <div class="flex">
            <div class="icon ">
              {@html checkIcon}
            </div>
            <div class="paragraph-small">
              Les services renseignés sont enregistrés dans la base de données
              DORA, en attendant d’être validés et complétés par la
              structure@nbsp;;
            </div>
          </div>

          <div class="flex">
            <div class="icon ">
              {@html checkIcon}
            </div>
            <div class="paragraph-small">
              Si vous le souhaitez, vous pouvez créer un compte afin de pouvoir
              suivre la mise en ligne des structures et fiches. <span
                class="text-magenta-brand"
              >
                Bientot !</span
              >
            </div>
          </div>
        </div>

        <LinkButton
          label="Proposer un service"
          to={"/contribuer/saisie"}
          icon={addCircleIcon}
          iconOnRight
        />
      </div>
    </div>
  </div>
</CenteredGrid>

<style lang="postcss">
  .icon {
    @apply w-s24 mr-s12 fill-current text-magenta-brand flex-initial self-center;
  }
</style>
