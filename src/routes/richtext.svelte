<script>
  import Tiptap from "$lib/tiptap.svelte";
  import { onMount } from "svelte";

  let content = "";
  // let turndownService;

  onMount(async () => {
    // const TurndownService = (await import("turndown")).default;
    // turndownService = new TurndownService({ headingStyle: "atx" });
  });
</script>

<div class="w-3/4 m-5 mx-auto">
  <Tiptap
    bind:htmlContent={content}
    className="prose prose-sm p-2 w-full max-w-none h-64 border-2 overflow-auto focus:outline-none" />
  <!--
  <pre
    class="w-full h-64 p-2 mt-8 overflow-auto font-mono bg-gray-200">
    {#if turndownService}
    {turndownService.turndown(content)}
    {/if}
  </pre> -->
</div>
