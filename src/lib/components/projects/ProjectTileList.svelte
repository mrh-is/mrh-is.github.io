<script lang="ts">
  import type { ProjectPreview } from "$lib/types/Project";
  import ProjectTile from "./ProjectTile.svelte";

  interface Props {
    projects: ProjectPreview[];
  }

  const { projects }: Props = $props();
</script>

<div class="project-tiles">
  {#each projects as project (project.slug)}
    <div class="tile-wrapper">
      <ProjectTile {project} class="hover-effect" />
    </div>
  {/each}
</div>

<style>
  .project-tiles {
    display: flex;
    flex-wrap: wrap;
    gap: 4rem;
    justify-content: center;
    margin-top: 3rem;
  }

  .tile-wrapper {
    width: 100%;
    max-width: 360px;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  :global(.hover-effect) {
    transition: transform 0.2s ease-out;
  }

  :global(.hover-effect:hover) {
    transform: translateY(-5px);
  }
</style>
