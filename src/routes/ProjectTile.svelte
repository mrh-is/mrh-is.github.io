<script lang="ts">
	import type { Project } from "$lib/types/Project";

  export let project: Project;
</script>

<a href={project.imageSrc}>
  <img src={project.imageSrc} alt="">
  <p class="title">{project.title}</p>
  <p class="subtitle">{project.subtitle}</p>
</a>

<style>
  a {
    display: inline-block;
    width: 70%;
  }

  img {
    width: 100%;
  }

  .title {
    font-size: 2rem;
    font-weight: 500;
    line-height: 150%;
  }

  .subtitle {
    color: var(--text-color);
  }
</style>
