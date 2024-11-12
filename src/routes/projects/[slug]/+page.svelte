<script lang="ts">
  import Section from "$lib/components/general/Section.svelte";
  import type { Project } from "$lib/types/Project";
  import ContentBlock from "./blocks/ContentBlock.svelte";
  import ProjectTileList from "$lib/components/projects/ProjectTileList.svelte";

  export let data;
  let project: Project;

  $: project = data.project;
</script>

<Section title={project.title} subtitle={project.tagline}>
  {#each project.content as block}
    <ContentBlock content={block} />
  {/each}
</Section>

<Section>
  <p>While you're here, check out some other projects:</p>
  <ProjectTileList projects={data.otherProjects} />
</Section>
