<script lang="ts">
  import type { ProjectPreview } from "$lib/types/Project";

  interface Props {
    project: ProjectPreview;
    class?: string;
  }

  let { project, class: className }: Props = $props();
</script>

<a class={className} href="/projects/{project.slug}">
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
