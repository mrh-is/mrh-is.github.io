<script lang="ts">
  import Section from "$lib/components/general/Section.svelte";
  import type { Project } from "$lib/types/Project";
  import ContentBlock from "./blocks/ContentBlock.svelte";
  import ProjectTileList from "$lib/components/projects/ProjectTileList.svelte";
  import ContactCTA from "$lib/components/ContactCTA.svelte";
  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }

  const { data }: Props = $props();
  const project: Project = $derived(data.project);
  const firstImageIndex = $derived(
    project.content.findIndex(
      (b) => b.kind === "image" || b.kind === "carousel",
    ),
  );
</script>

<Section title={project.title} subtitle={project.tagline} headingLevel={1}>
  {#each project.content as block, index (index)}
    <ContentBlock content={block} hero={index === firstImageIndex} />
  {/each}
</Section>

<ContactCTA leadIn={project.ctaLeadIn} />

<Section>
  <p>While you’re here, check out some other projects:</p>
  <ProjectTileList projects={data.otherProjects} />
</Section>
