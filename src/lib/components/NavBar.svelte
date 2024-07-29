<script lang="ts">
  import type { ProjectNavLink } from "$lib/types/Project";
  import ProjectsDropdown from "./ProjectsDropdown.svelte";

  export let projects: ProjectNavLink[];
</script>

<div>
  <nav>
    <a href="/" class="home header-font">Michael Helmbrecht</a>
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

  .home {
    font-size: 2rem;
    font-weight: bold;
  }

  .page-list {
    display: flex;
    flex-direction: row;
    column-gap: 2rem;
  }

  div :global(a):not(:hover) {
    color: var(--text-color);
  }

  div :global(a):hover {
    text-decoration-color: transparent;
  }

  @media (max-width: 800px) {
    nav {
      flex-direction: column;
    }

    .home {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
  }
</style>
