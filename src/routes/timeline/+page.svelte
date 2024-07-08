<script lang="ts">
  import Section from "$lib/components/Section.svelte";
  import Entry from "./Entry.svelte";

  export let data;
</script>

<Section title="Work">
  {#each data.work as entry}
    <Entry {entry} />
  {/each}
</Section>

<Section title="Education">
  {#each data.education as entry}
    <Entry {entry} />
  {/each}
</Section>

<Section>
  <p>
    Also available
    <a href="/assets/resume.pdf">as a PDF</a>
    . Or you can read this on
    <a href="https://www.linkedin.com/in/michaelhelmbrecht/">LinkedIn</a>
    if you're into that sort of thing.
  </p>
</Section>
