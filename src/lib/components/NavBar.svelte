<script lang="ts">
  import type { ProjectNavLink } from "$lib/types/Project";
  import ProjectsDropdown from "./ProjectsDropdown.svelte";

  export let projects: ProjectNavLink[];
</script>

<div>
  <nav>
    <a href="/" class="home">Michael Helmbrecht</a>
    <div class="page-list">
      <ProjectsDropdown {projects} />
      <a href="/timeline">Timeline</a>
    </div>
  </nav>
</div>

<style>
  nav {
    margin: 0 10vw;
    padding: 1.5rem 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .page-list {
    display: flex;
    flex-direction: row;
    column-gap: 2rem;
  }

  .home {
    font-weight: 500;
  }

  div :global(a):not(:hover) {
    color: var(--text-color);
  }
</style>
