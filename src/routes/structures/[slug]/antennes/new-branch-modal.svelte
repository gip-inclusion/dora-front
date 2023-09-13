<script lang="ts">
  import Modal from "$lib/components/hoc/modal.svelte";

  export let isOpen = false;
</script>

{#if isOpen}
  <Modal
    bind:isOpen
    on:close
    overflow
    title="Créer une ou plusieurs antennes"
    width="medium"
  >
    <h2>Qu’est-ce qu’une antenne ?</h2>

    <p class="text-f16">
      Une antenne est une <strong>nouvelle structure</strong> sur Dora
      <strong>rattachée à votre structure principale</strong>. Une antenne a
      ainsi la possibilité d’afficher <strong>propres offres</strong> et d’être
      gérée par ses <strong>propres administrateurs et collaborateurs</strong>.
      Une antenne peut avoir le même numéro SIRET que la structure principale ou
      un numéro de SIRET différent.
    </p>

    <h2 class="mt-s32">
      Quand la création d’une antenne est-elle nécessaire ?
    </h2>

    <p class="text-f16">
      Entre votre structure principale et votre(vos) antenne(s), les
      collaborateurs qui diffusent les offres sur DORA sont :
    </p>

    <ul class="mt-s10 list-disc pl-s16 text-gray-text">
      <li class="text-f16">
        Différents : ✅ OUI, la création d’antenne est nécessaire
      </li>
      <li class="text-f16">
        Les mêmes : ❌ NON, la création d’antenne n’est pas nécessaire et dans
        cas, choisissez la simplicité 😉 : gérez toutes vos offres sur votre
        structure principale en créant plusieurs services (un par localité par
        exemple) !
      </li>
    </ul>

    <h2 class="mt-s32">Comment créer une nouvelle antenne ?</h2>

    <p class="mb-s20 text-f16">
      Pour demander la création d’une ou plusieurs antennes, il suffit
      simplement de nous en faire la demande
      <a
        href="https://aide.dora.inclusion.beta.gouv.fr/fr/"
        class="text-magenta-cta underline"
      >
        via notre chatbot
      </a> (bouton "Discuter avec nous" en bas de la page).
    </p>

    <p
      class="mb-s20 border-l-4 border-l-warning bg-warning-light p-s10 pl-s20 text-f16"
    >
      Vous aurez besoin de vous munir du nom de cette nouvelle structure et de
      son numéro Siret
    </p>

    <p
      class="mb-s20 border-l-4 border-l-success bg-success-light p-s10 pl-s20 text-f16"
    >
      Le numéro Siret peut être différent ou identique à la structure principale
    </p>

    <p class="text-f16">
      Une fois créée, vous retrouverez l’accès à <strong>vos structures</strong>
      depuis votre tableau de bord principal.
    </p>
  </Modal>
{/if}
