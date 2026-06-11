<script lang="ts">
  import type { TimelineEntry } from "$lib/types/TimelineEntry";
  import FormattedText from "$lib/components/general/FormattedText.svelte";

  interface Props {
    entry: TimelineEntry;
  }

  const { entry }: Props = $props();

  const formatDate = (date: Date) =>
    date.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
</script>

<div class="entry">
  <h3>{entry.title}</h3>

  <p class="subtitle">
    {#if entry.institution.link}
      <a href={entry.institution.link} target="_blank" rel="noopener noreferrer"
        >{entry.institution.name}</a
      >
    {:else}
      {entry.institution.name}
    {/if}
    ·
    {#if entry.dates.type === "current"}
      {formatDate(entry.dates.start)}–Now
    {:else if entry.dates.type === "past"}
      {formatDate(entry.dates.start)}–{formatDate(entry.dates.end)}
    {:else if entry.dates.type === "graduation"}
      {formatDate(entry.dates.date)}
    {/if}
  </p>

  {#if entry.description}
    {#each entry.description as paragraph, index (index)}
      <p>
        <FormattedText text={paragraph} />
      </p>
    {/each}
  {/if}
</div>

<style>
  .entry {
    margin-top: 4rem;
    margin-bottom: 8rem;
  }

  .subtitle {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
</style>
