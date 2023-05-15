<script lang="ts">
  // TODO: tout accepter - tout refuser - tout montrer - accepter/refuser individuellement

  import Button from "$lib/components/display/button.svelte";
  import Notice from "$lib/components/display/notice.svelte";
  import type { StructureService } from "$lib/types";

  export let services: StructureService[] = [];

  const LIST_LENGTH = 3;
  let showAll = false;

  $: servicesToUpdate = services.filter(({ modelChanged }) => modelChanged);
  $: updatedModels = new Set(
    servicesToUpdate.map(({ modelName }) => modelName)
  );

  async function cancelUpdate(serviceSlug: string) {}
  async function doUpdate(serviceSlug: string) {}
</script>

{#if services.length}
  <Notice
    title="Il existe des mises à jour pour {servicesToUpdate.length} de vos services"
    type="info"
  >
    <div>
      <p class="block text-f14">
        Suite à la mise à jour de {Array.from(updatedModels)
          .map((name) => `"${name}"`)
          .join(", ")}, {servicesToUpdate.length}
        {servicesToUpdate.length > 1 ? "services" : "service"} peuvent être mis à
        jour :
      </p>
      <ul class="ml-s16 block list-disc">
        {#each servicesToUpdate as service, index}
          {#if index < LIST_LENGTH || showAll}
            <li class="mb-s12 text-f14 font-bold">
              {service.name}
              <Button
                extraClass="ml-s16 text-magenta-cta !text-f14 !p-s0"
                noBackground
                noPadding
                label="Mettre à jour"
                on:click={() => {
                  doUpdate(service.slug);
                }}
              />
              <Button
                extraClass="ml-s10 text-marianne-red !text-f14 !p-s0"
                noBackground
                noPadding
                label="Refuser"
                on:click={() => {
                  cancelUpdate(service.slug);
                }}
              />
            </li>
          {/if}
        {/each}
      </ul>
      {#if servicesToUpdate.length >= LIST_LENGTH}
        <div>
          <Button
            extraClass="ml-s16 text-magenta-cta !text-f14 !p-s0"
            noBackground
            noPadding
            label={showAll ? "Réduire la liste" : "Voir toute la liste"}
            on:click={() => {
              showAll = !showAll;
            }}
          />
        </div>
      {/if}
    </div>

    <div class="mt-s16">
      <Button
        label="Tout mettre à jour"
        extraClass="py-s8 !px-s12"
        on:click={() => {}}
      />
      <Button
        secondary
        extraClass="py-s8 !px-s12"
        label="Tout refuser"
        on:click={() => {}}
      />
      <Button
        secondary
        extraClass="py-s8 !px-s12"
        label="Cacher cette fenêtre"
        on:click={() => {}}
      />
    </div>
  </Notice>
{/if}
