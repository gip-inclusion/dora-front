<script>
  import { onMount, onDestroy } from "svelte";
  import { Editor } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import Placeholder from "@tiptap/extension-placeholder";
  import Link from "@tiptap/extension-link";

  import {
    boldIcon,
    italicIcon,
    paraIcon,
    h1Icon,
    h2Icon,
    liIcon,
    linkIcon,
  } from "$lib/icons.js";

  import Button from "./button.svelte";
  import Separator from "./separator.svelte";

  let element;
  let editor;
  export let name;
  export let className = "prose bg-white h-s160";
  export let htmlContent = "";
  export let initialContent = "";
  export let placeholder = "";
  export let disabled = false;
  export let readonly;

  onMount(() => {
    editor = new Editor({
      element,
      extensions: [
        StarterKit,
        Placeholder.configure({ placeholder }),
        Link.configure({
          HTMLAttributes: {
            class: "underline",
          },
          openOnClick: false,
        }),
      ],
      content: initialContent,
      injectCSS: false,
      onTransaction: () => {
        // force re-render so `editor.isActive` works as expected
        htmlContent = editor.getHTML();
        editor = editor;
      },
      editorProps: {
        attributes: {
          id: { name },
          name,
          disabled,
          readonly,
          class: `${className} p-s16 whitespace-pre-wrap w-full max-w-none overflow-auto focus:outline-none`,
        },
      },
    });
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });

  function setLink() {
    const previousUrl = editor.getAttributes("link").href;
    // eslint-disable-next-line no-alert
    const url = window.prompt("URL", previousUrl);
    // cancelled
    if (url === null) {
      return;
    }
    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }
</script>

<div class="flex w-full flex-col border border-gray-03">
  {#if editor}
    <div class="flex flex-row items-center gap-s8 bg-gray-03 p-s12">
      <Button
        on:click={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        icon={boldIcon}
      />

      <Button
        on:click={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        icon={italicIcon}
      />

      <Separator />

      <Button
        on:click={() => editor.chain().focus().setParagraph().run()}
        active={editor.isActive("paragraph")}
        icon={paraIcon}
      />

      <Button
        on:click={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
        icon={h1Icon}
      />

      <Button
        on:click={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
        icon={h2Icon}
      />

      <Separator />

      <Button
        on:click={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        icon={liIcon}
      />

      <Separator />

      <Button
        on:click={setLink}
        active={editor.isActive("link")}
        icon={linkIcon}
      />
    </div>
  {/if}
  <div>
    <div bind:this={element} />
  </div>
</div>

<style lang="postcss">
  :global(.ProseMirror p.is-editor-empty:first-child::before) {
    content: attr(data-placeholder);

    @apply pointer-events-none float-left h-s0 text-gray-text-alt;
  }
</style>
