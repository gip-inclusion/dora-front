<script>
  import Date from "$lib/components/date.svelte";
  import EmailLine from "./_email-line.svelte";

  import WebSearchLink from "./_web-search-link.svelte";

  export let user, structure;
</script>

<div>
  <strong>
    {user.firstName}
    {user.lastName}
  </strong>

  <WebSearchLink
    searchString="{user.firstName} {user.lastName} {structure.name}"
  />

  <EmailLine email={user.email} />

  {#if user.phoneNumber}
    tel: {user.phoneNumber}
    <br />
  {/if}
  actif: {user.isActive ? "oui" : "non"} valide: {user.isValid ? "oui" : "non"} infolettre:
  {user.newsletter ? "oui" : "non"}
  <br />
  inscription: <Date date={user.dateJoined} />
</div>
