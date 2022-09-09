<script lang="ts">
  import Alert from "$lib/components/forms/alert.svelte";

  import type { Day, DayPeriod } from "$lib/types";
  import {
    fromJsonToOsmString,
    getHoursFromStr,
    returnEmptyHoursData,
  } from "$lib/utils/structure";
  import { createEventDispatcher } from "svelte";
  import DayField from "./day-field.svelte";

  export let label: string;
  export let value;
  export let name;
  export let errorMessages: string[];

  const dispatch = createEventDispatcher();

  const data = value ? getHoursFromStr(value) : returnEmptyHoursData();

  function handleHourChange(day: Day, time: DayPeriod) {
    data[day][time].touched = true;
    value = fromJsonToOsmString(data);
    dispatch("change", name);
  }
</script>

<fieldset>
  <legend class="bold mb-s8 font-bold text-gray-dark first-letter:capitalize">
    {label}
  </legend>

  {#each errorMessages || [] as msg}
    <Alert id="opening-hours-field" label={msg} />
  {/each}

  <div class="mt-s24">
    <div class="day-grid hidden md:block">
      <div>&nbsp;</div>
      <div class="text-center font-bold" aria-hidden="true">Matin</div>
      <div class="text-center font-bold" aria-hidden="true">Après-midi</div>
    </div>

    <!-- Lundi -->
    <div class="day-grid day">
      <div class="self-center font-bold text-gray-dark">Lundi</div>
      <div class="!mb-s10 block text-center font-bold md:hidden">Matin</div>

      <div class="mr-s0 md:mr-s8">
        <DayField
          bind:isOpen={data.monday.morning.isOpen}
          bind:touched={data.monday.morning.touched}
          bind:openAt={data.monday.morning.openAt}
          bind:closeAt={data.monday.morning.closeAt}
          label="lundi matin"
          day="monday"
          dayPeriod="morning"
          on:change={() => handleHourChange("monday", "morning")}
        />
      </div>
      <div>
        <div class="mb-s10 block text-center font-bold md:hidden">
          Après-midi
        </div>
        <DayField
          bind:isOpen={data.monday.afternoon.isOpen}
          bind:openAt={data.monday.afternoon.openAt}
          bind:touched={data.monday.afternoon.touched}
          bind:closeAt={data.monday.afternoon.closeAt}
          label="lundi après-midi"
          day="monday"
          dayPeriod="afternoon"
          on:change={() => handleHourChange("monday", "afternoon")}
        />
      </div>
    </div>

    <!-- Mardi -->
    <div class="day-grid day">
      <div class="self-center font-bold text-gray-dark">Mardi</div>
      <div class="!mb-s10 block text-center font-bold md:hidden">Matin</div>

      <div class="mr-s0 md:mr-s8">
        <DayField
          bind:isOpen={data.tuesday.morning.isOpen}
          bind:touched={data.tuesday.morning.touched}
          bind:openAt={data.tuesday.morning.openAt}
          bind:closeAt={data.tuesday.morning.closeAt}
          label="mardi matin"
          day="tuesday"
          dayPeriod="morning"
          on:change={() => handleHourChange("tuesday", "morning")}
        />
      </div>
      <div>
        <div class="mb-s10 block text-center font-bold md:hidden">
          Après-midi
        </div>
        <DayField
          bind:isOpen={data.tuesday.afternoon.isOpen}
          bind:openAt={data.tuesday.afternoon.openAt}
          bind:touched={data.tuesday.afternoon.touched}
          bind:closeAt={data.tuesday.afternoon.closeAt}
          label="mardi après-midi"
          day="tuesday"
          dayPeriod="afternoon"
          on:change={() => handleHourChange("tuesday", "afternoon")}
        />
      </div>
    </div>

    <!-- Mercredi -->
    <div class="day-grid day">
      <div class="self-center font-bold text-gray-dark">Mercredi</div>
      <div class="!mb-s10 block text-center font-bold md:hidden">Matin</div>

      <div class="mr-s0 md:mr-s8">
        <DayField
          bind:isOpen={data.wednesday.morning.isOpen}
          bind:touched={data.wednesday.morning.touched}
          bind:openAt={data.wednesday.morning.openAt}
          bind:closeAt={data.wednesday.morning.closeAt}
          label="mercredi matin"
          day="wednesday"
          dayPeriod="morning"
          on:change={() => handleHourChange("wednesday", "morning")}
        />
      </div>
      <div>
        <div class="mb-s10 block text-center font-bold md:hidden">
          Après-midi
        </div>

        <DayField
          bind:isOpen={data.wednesday.afternoon.isOpen}
          bind:openAt={data.wednesday.afternoon.openAt}
          bind:touched={data.wednesday.afternoon.touched}
          bind:closeAt={data.wednesday.afternoon.closeAt}
          label="mercredi après-midi"
          day="wednesday"
          dayPeriod="afternoon"
          on:change={() => handleHourChange("wednesday", "afternoon")}
        />
      </div>
    </div>

    <!-- Jeudi -->
    <div class="day-grid day">
      <div class="self-center font-bold text-gray-dark">Jeudi</div>
      <div class="!mb-s10 block text-center font-bold md:hidden">Matin</div>

      <div class="mr-s0 md:mr-s8">
        <DayField
          bind:isOpen={data.thursday.morning.isOpen}
          bind:touched={data.thursday.morning.touched}
          bind:openAt={data.thursday.morning.openAt}
          bind:closeAt={data.thursday.morning.closeAt}
          label="jeudi matin"
          day="thursday"
          dayPeriod="morning"
          on:change={() => handleHourChange("thursday", "morning")}
        />
      </div>
      <div>
        <div class="mb-s10 block text-center font-bold md:hidden">
          Après-midi
        </div>

        <DayField
          bind:isOpen={data.thursday.afternoon.isOpen}
          bind:openAt={data.thursday.afternoon.openAt}
          bind:touched={data.thursday.afternoon.touched}
          bind:closeAt={data.thursday.afternoon.closeAt}
          label="jeudi après-midi"
          day="thursday"
          dayPeriod="afternoon"
          on:change={() => handleHourChange("thursday", "afternoon")}
        />
      </div>
    </div>
  </div>

  <!-- Vendredi -->
  <div class="day-grid day">
    <div class="self-center font-bold text-gray-dark">Vendredi</div>
    <div class="!mb-s10 block text-center font-bold md:hidden">Matin</div>

    <div class="mr-s0 md:mr-s8">
      <DayField
        bind:isOpen={data.friday.morning.isOpen}
        bind:touched={data.friday.morning.touched}
        bind:openAt={data.friday.morning.openAt}
        bind:closeAt={data.friday.morning.closeAt}
        label="vendredi matin"
        day="friday"
        dayPeriod="morning"
        on:change={() => handleHourChange("friday", "morning")}
      />
    </div>
    <div>
      <div class="mb-s10 block text-center font-bold md:hidden">Après-midi</div>
      <DayField
        bind:isOpen={data.friday.afternoon.isOpen}
        bind:openAt={data.friday.afternoon.openAt}
        bind:touched={data.friday.afternoon.touched}
        bind:closeAt={data.friday.afternoon.closeAt}
        label="vendredi après-midi"
        day="friday"
        dayPeriod="afternoon"
        on:change={() => handleHourChange("friday", "afternoon")}
      />
    </div>
  </div>

  <!-- Samedi -->
  <div class="day-grid day">
    <div class="self-center font-bold text-gray-dark">Samedi</div>
    <div class="!mb-s10 block text-center font-bold md:hidden">Matin</div>

    <div class="mr-s0 md:mr-s8">
      <DayField
        bind:isOpen={data.saturday.morning.isOpen}
        bind:touched={data.saturday.morning.touched}
        bind:openAt={data.saturday.morning.openAt}
        bind:closeAt={data.saturday.morning.closeAt}
        label="samedi matin"
        day="saturday"
        dayPeriod="morning"
        on:change={() => handleHourChange("saturday", "morning")}
      />
    </div>
    <div>
      <div class="mb-s10 block text-center font-bold md:hidden">Après-midi</div>
      <DayField
        bind:isOpen={data.saturday.afternoon.isOpen}
        bind:openAt={data.saturday.afternoon.openAt}
        bind:touched={data.saturday.afternoon.touched}
        bind:closeAt={data.saturday.afternoon.closeAt}
        label="samedi après-midi"
        day="saturday"
        dayPeriod="afternoon"
        on:change={() => handleHourChange("saturday", "afternoon")}
      />
    </div>
  </div>

  <!-- Dimanche -->
  <div class="day-grid day">
    <div class="self-center font-bold text-gray-dark">Dimanche</div>
    <div class="!mb-s10 block text-center font-bold md:hidden">Matin</div>

    <div class="mr-s0 md:mr-s8">
      <DayField
        bind:isOpen={data.sunday.morning.isOpen}
        bind:touched={data.sunday.morning.touched}
        bind:openAt={data.sunday.morning.openAt}
        bind:closeAt={data.sunday.morning.closeAt}
        label="dimanche matin"
        day="sunday"
        dayPeriod="morning"
        on:change={() => handleHourChange("sunday", "morning")}
      />
    </div>
    <div>
      <div class="mb-s10 block text-center font-bold md:hidden">Après-midi</div>
      <DayField
        bind:isOpen={data.sunday.afternoon.isOpen}
        bind:openAt={data.sunday.afternoon.openAt}
        bind:touched={data.sunday.afternoon.touched}
        bind:closeAt={data.sunday.afternoon.closeAt}
        label="dimanche après-midi"
        day="sunday"
        dayPeriod="afternoon"
        on:change={() => handleHourChange("sunday", "afternoon")}
      />
    </div>
  </div>
</fieldset>

<style lang="postcss">
  .day-grid.day > div:first-child {
    grid-column-start: 1;
    grid-column-end: 5;
  }
  .day-grid.day > div {
    @apply mb-s24;
  }

  @screen md {
    .day-grid {
      display: grid;
      grid-template-columns: 1fr 2fr 2fr;
      @apply mb-s24;
    }
    .day-grid.day > div:first-child {
      grid-column-start: auto;
      grid-column-end: auto;
    }
  }
</style>
