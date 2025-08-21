<script lang="ts">
  import Section from "$lib/components/general/Section.svelte";
  import type { Project } from "$lib/types/Project";
  import ContentBlock from "./blocks/ContentBlock.svelte";
  import ProjectTileList from "$lib/components/projects/ProjectTileList.svelte";
  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }

  const { data }: Props = $props();
  const project: Project = $derived(data.project);
</script>

<Section title={project.title} subtitle={project.tagline}>
  {#each project.content as block, index (index)}
    <ContentBlock content={block} />
  {/each}
</Section>

<Section>
  <p>While you’re here, check out some other projects:</p>
  <ProjectTileList projects={data.otherProjects} />
</Section>
