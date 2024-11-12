<script lang="ts">
  import Section from "$lib/components/general/Section.svelte";
  import Entry from "./Entry.svelte";

  import resumeSrc from "$lib/assets/Michael Helmbrecht resume.pdf";
  import OutboundLink from "$lib/components/general/OutboundLink.svelte";

  export let data;
</script>

<Section title="Work">
  {#each data.work as entry}
    <Entry {entry} />
  {/each}
</Section>

<Section title="Edu&shy;cation">
  {#each data.education as entry}
    <Entry {entry} />
  {/each}
</Section>

<Section>
  <p>
    Also available <OutboundLink href={resumeSrc}>as a PDF</OutboundLink>. Or
    you can read this on
    <OutboundLink href="https://www.linkedin.com/in/michaelhelmbrecht/">
      LinkedIn
    </OutboundLink>
    if you're into that sort of thing.
  </p>
</Section>
