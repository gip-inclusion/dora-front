<script>
  import Date from "$lib/components/date.svelte";
  import CopyableText from "./_copyable-text.svelte";

  import WebSearchLink from "./_web-search-link.svelte";

  export let user;
</script>

<div>
  {user.firstName}
  {user.lastName}
  <br />
  {user.email}
  <a class="text-f12 underline" href="mailto:{user.email}">mailto</a>
  <WebSearchLink searchString={user.email} />
  <CopyableText text={user.email} />
  <br />
  tel: {user.phoneNumber}
  <br />
  actif: {user.isActive ? "oui" : "non"} valide: {user.isValid ? "oui" : "non"} infolettre:
  {user.newsletter ? "oui" : "non"}
  <br />
  inscription: <Date date={user.dateJoined} />
</div>
