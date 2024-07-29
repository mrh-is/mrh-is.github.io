<script lang="ts">
  import type { TimelineEntry } from "$lib/types/TimelineEntry";

  export let entry: TimelineEntry;

  const formatDate = (date: Date) =>
    date.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
</script>

<div class="entry">
  <h2>{entry.title}</h2>

  <p class="subtitle">
    {#if entry.institution.link}
      <a href={entry.institution.link}>{entry.institution.name}</a>
    {:else}
      {entry.institution.name}
    {/if}
    ·
    {#if entry.startDate}
      {formatDate(entry.startDate)}–{formatDate(entry.endDate)}
    {:else}
      {formatDate(entry.endDate)}
    {/if}
  </p>

  {#if entry.description}
    {#each entry.description as description}
      <p>{@html description}</p>
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
