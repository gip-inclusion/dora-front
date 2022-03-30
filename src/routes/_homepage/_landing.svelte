<script>
  import CenteredGrid from "$lib/components/layout/centered-grid.svelte";

  import SearchForm from "./_search-form.svelte";

  import NewsletterButton from "$lib/components/newsletter-button.svelte";
  import LinkButton from "$lib/components/link-button.svelte";
  import logoPoleEmploi from "$lib/assets/logo-pole-emploi.svg";
  import logoMobIn from "$lib/assets/logo-mob-in.svg";
  import logoDepartementArdennes from "$lib/assets/logo-departement-ardennes.svg";
  import logoDepartementReunion from "$lib/assets/logo-departement-reunion.svg";
  import logoAfpa from "$lib/assets/logo-afpa.svg";
  import logoCaf from "$lib/assets/logo-caf.svg";

  import illuRecenser from "$lib/assets/illu-recenser.svg";
  import illuMobiliser from "$lib/assets/illu-mobiliser.svg";
  import illuAccompagner from "$lib/assets/illu-accompagner.svg";

  export let servicesOptions;
</script>

<CenteredGrid --col-bg="var(--col-magenta-10)" topPadded roundedBottom>
  <div class="col-span-full mb-s40 flex flex-col gap-s40">
    <div class="text-center">
      <h1>Donnez de la visibilité <br />à votre offre d’insertion</h1>
      <p class="mb-s0">
        Publiez et mettez à jour vos services en toute simplicité.
      </p>
    </div>
    <div class="flex justify-center gap-s16">
      <LinkButton label="Référencer un service" to={`/services/creer`} />
      <LinkButton
        label="Participer à un webinaire"
        secondary
        nofollow
        otherTab
        to={`https://app.livestorm.co/dora-1 `}
      />
    </div>

    <div>
      <p class="text-center text-f12">
        Plus de 450 structures ont déjà référencé leurs services sur DORA.
      </p>
      <div class="flex justify-center gap-s24">
        <div class="flex gap-s24">
          <img src={logoPoleEmploi} alt="logo Pole Emploi" />

          <img src={logoMobIn} alt="logo Mob'In" />

          <img
            src={logoDepartementArdennes}
            alt="logo Conseil Départemental des Ardennes"
          />
        </div>
        <div class="flex gap-s24">
          <img
            src={logoDepartementReunion}
            alt="logo Conseil départemental de la Réunion"
          />

          <img src={logoAfpa} alt="logo Afpa" />

          <img src={logoCaf} alt="logo Allocations Familiales" />
        </div>
      </div>
    </div>
  </div>
</CenteredGrid>

<CenteredGrid --col-bg="var(--col-transparent)" topPadded>
  <div class="col-span-full mb-s40">
    <h2 class="text-center">
      Tous les services d’insertion sur votre territoire
    </h2>
    <SearchForm {servicesOptions} />
  </div>
</CenteredGrid>

<CenteredGrid --col-bg="var(--col-transparent)" topPadded>
  <div class="col-span-full mb-s40">
    <h2 class="text-center">Comment ça fonctionne</h2>
    <div class="flex flex-col gap-s24 md:flex-row">
      <div class="md:flex-1">
        <img
          src={illuRecenser}
          alt="illustration d'un personnage avec une machine à écrire"
          class="mb-s16 w-full"
        />
        <h3>Recensement de l’offre d’insertion</h3>
        <p class="text-f16">
          Les structures qui offrent des services d’insertion renseignent toutes
          les informations nécessaires et gagnent en visibilité.
        </p>
      </div>
      <div class="md:flex-1">
        <img
          src={illuMobiliser}
          alt="illustration d'un ordinateur avec le visage d'un personnage satisfait sur l'écran"
          class="mb-s16 w-full"
        />
        <h3>Mobilisation de service d’insertion</h3>
        <p class="text-f16">
          Les acteurs de l'insertion trouvent rapidement et facilement les
          services adaptés à leurs bénéficiaires, le bon contact, les bons
          documents.
        </p>
      </div>
      <div class="md:flex-1">
        <img
          src={illuAccompagner}
          alt="illustration avec deux personnages souriants, face à face, chacun dans une bulle qui communiquent avec leur ordinateur."
          class="mb-s16 w-full"
        />
        <h3>Accompagnement des bénéficiaires</h3>
        <p class="text-f16">
          Les acteurs de l'insertion trouvent rapidement et facilement les
          services adaptés à leurs bénéficiaires, le bon contact, les bons
          documents.
        </p>
      </div>
    </div>
  </div>
</CenteredGrid>

<CenteredGrid --col-bg="var(--col-gray-00)">
  <div
    class="col-span-full mb-s40 mt-s32 flex flex-col items-center justify-between gap-s16 md:flex-row"
  >
    <div>
      <h3 class="mb-s8 text-gray-dark">Infolettre</h3>
      <p class="max-w-2xl text-f12 leading-relaxed text-gray-dark">
        En renseignant votre adresse courriel, vous acceptez de recevoir nos
        actualités. Vous pouvez vous désinscrire à l’aide des liens de
        désinscription ou en <a
          target="_blank"
          rel="noopener nofollow"
          class="underline"
          href="https://itou.typeform.com/doracontactsupp">nous contactant</a
        >.
      </p>
    </div>

    <NewsletterButton />
  </div>
</CenteredGrid>

<style lang="postcss">
  h1,
  h2 {
    color: var(--col-france-blue);
  }

  h1 {
    margin-bottom: var(--s24);
  }

  h2 {
    margin-top: var(--s24);
    margin-bottom: var(--s24);
    line-height: var(--s40);
  }

  p {
    color: var(--col-text);
  }

  .content-mission {
    margin-top: var(--s32);
  }

  .content-mission h2,
  .content-mission h5 {
    color: var(--col-white);
  }

  .content-mission p,
  .content-mission li {
    color: var(--col-gray-02);
  }

  .content-mission ul {
    margin-top: var(--s16);
    margin-bottom: var(--s16);
  }

  .content-mission li {
    margin-bottom: var(--s8);

    /* base64 encoded from remixicon/icons/System/check-line.svg,
       adding stroke="white" on the 2nd path */
    list-style-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+CiAgICA8Zz4KICAgICAgICA8cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDB6Ii8+CiAgICAgICAgPHBhdGggc3Ryb2tlPSJ3aGl0ZSIgZD0iTTEwIDE1LjE3Mmw5LjE5Mi05LjE5MyAxLjQxNSAxLjQxNEwxMCAxOGwtNi4zNjQtNi4zNjQgMS40MTQtMS40MTR6Ii8+CiAgICA8L2c+Cjwvc3ZnPgo=");
    list-style-position: inside;
  }

  @screen lg {
    h1 {
      line-height: var(--s56);
    }
  }
</style>
