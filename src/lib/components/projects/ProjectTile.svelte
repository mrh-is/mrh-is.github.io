<script lang="ts">
  import type { ProjectPreview } from "$lib/types/Project";

  export let project: ProjectPreview;
</script>

<a class={$$props.class} href="/projects/{project.slug}">
  <img src={project.imageSrc} alt="" />
  <p class="title">{project.title}</p>
  <p class="subtitle">{project.subtitle}</p>
</a>

<style>
  a {
    display: inline-block;
  }

  img {
    width: 100%;
  }

  p {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .title {
    font-size: 2rem;
    font-weight: 500;
  }

  .subtitle {
    color: var(--text-color);
  }
</style>
