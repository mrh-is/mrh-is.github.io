<script lang="ts">
	import type { ProjectPreview } from "$lib/types/Project";

  export let size: "small" | "large";
  export let project: ProjectPreview;
</script>

<a class={size} href="/projects/{project.slug}">
  <img src={project.imageSrc} alt="">
  <p class="title">{project.title}</p>
  <p class="subtitle">{project.subtitle}</p>
</a>

<style>
  a {
    display: inline-block;
  }

  a.large {
    width: 70%;
  }

  a.small {
    width: 40%;
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
