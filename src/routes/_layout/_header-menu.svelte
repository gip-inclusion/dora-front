<script>
  import { loginIcon, userFillIcon } from "$lib/icons.js";

  import LinkButton from "$lib/components/link-button.svelte";
  import TopLinks from "./_top-links.svelte";

  export let structures;
</script>

<LinkButton
  label="Mon compte"
  to={`/mon-compte`}
  icon={userFillIcon}
  iconOnRight
  noBackground
/>

<LinkButton
  label="Deconnexion"
  to={`/auth/deconnexion`}
  icon={loginIcon}
  iconOnRight
  noBackground
/>

<div class="block lg:hidden">
  {#if !!structures?.length}
    <hr class="border-t border-gray-01" />
    {#each structures as structure}
      <LinkButton
        label={structure.name}
        to={`/structures/${structure.slug}`}
        noBackground
        small
      />
    {/each}
  {/if}
  <hr class="border-t border-gray-01" />
  <TopLinks />
</div>
