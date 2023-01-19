<script lang="ts">
  import {
    alertIcon,
    checkboxCircleFillIcon,
    closeCircleIcon,
    closeIcon,
    informationIcon,
  } from "$lib/icons";
  import Button from "./button.svelte";

  export let title = "";
  export let type: "info" | "success" | "warning" | "error" = "info";
  export let hasCloseButton = false;
  export let showIcon = true;

  const types = {
    info: {
      bg: "bg-info-light",
      text: "text-info",
      title: "text-france-blue",
      icon: informationIcon,
    },
    success: {
      bg: "bg-success-light",
      text: "text-success",
      title: "text-success",
      icon: checkboxCircleFillIcon,
    },
    warning: {
      bg: "bg-warning-light",
      text: "text-warning",
      title: "text-warning",
      icon: alertIcon,
    },
    error: {
      bg: "bg-error-light",
      text: "text-error",
      title: "text-error",
      icon: closeCircleIcon,
    },
  };

  let visible = true;

  function handleHide() {
    visible = !visible;
  }
</script>

{#if visible}
  <div
    class="flex rounded-lg {types[type].bg} py-s24 pr-s24 pl-s24"
    class:pl-s8={showIcon}
  >
    {#if showIcon}
      <div class="hidden text-center sm:block sm:flex-[0_0_64px]">
        <div
          class="{types[type].text} m-auto h-s32 w-s32 shrink-0 fill-current"
        >
          {@html types[type].icon}
        </div>
      </div>
    {/if}

    <div>
      {#if title || hasCloseButton}
        <div class="flex items-center justify-between">
          {#if title}
            <h4 class="mb-s0 {types[type].title} flex leading-32">
              {#if showIcon}
                <div class="mr-s8 inline-block text-center sm:hidden">
                  <div
                    class="{types[type]
                      .text} m-auto h-s32 w-s32 shrink-0 fill-current"
                  >
                    {@html types[type].icon}
                  </div>
                </div>
              {/if}

              {title}
            </h4>
          {/if}
          {#if hasCloseButton}
            <div>
              <Button
                icon={closeIcon}
                noBackground
                on:click={handleHide}
                small
              />
            </div>
          {/if}
        </div>
      {/if}
      {#if $$slots?.default || $$slots.button}
        <div
          class="flex flex-row flex-wrap items-start justify-between gap-s12"
          class:mt-s16={!!title}
          class:mt-s8={!title}
        >
          <slot />

          {#if $$slots.button}
            <div class="mb-s24 self-end">
              <slot name="button" />
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}