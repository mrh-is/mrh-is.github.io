<script lang="ts">
  import type { TimelineEntry } from "$lib/types/TimelineEntry";

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
      <a href={entry.institution.link}>{entry.institution.name}</a>
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
        {#each paragraph as segment, segmentIndex (segmentIndex)}
          <!-- hrefs are absolute (https://...) or root-relative (/...) — no protocol-relative, hash, or bare-relative paths -->
          {#if typeof segment === "string"}{segment}{:else if segment.href.startsWith("/")}<a
              href={segment.href}>{segment.text}</a
            >{:else}<a
              href={segment.href}
              target="_blank"
              rel="noopener noreferrer">{segment.text}</a
            >{/if}
        {/each}
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
