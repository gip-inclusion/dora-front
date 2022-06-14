<script>
  import StructureCard from "$lib/components/structures/card.svelte";
  import Date from "../date.svelte";

  export let model;
</script>

<div class="flex flex-col gap-s16 lg:flex-row-reverse lg:justify-between">
  <div class="lg:w-1/3 lg:self-end">
    <StructureCard structure={model.structureInfo} showAddress={false} />
  </div>

  <div class="lg:w-2/3">
    <div class="flex items-center">
      <p class="mb-s0 text-f12 text-gray-text">
        Mis à jour le <Date date={model.modificationDate} />
      </p>
    </div>
    <h1 class="text-france-blue">{model.name}</h1>

    <p class="mb-s0 text-f14">
      {model.numServices} service{model.numServices > 1 ? "s" : ""}
    </p>
  </div>
</div>
