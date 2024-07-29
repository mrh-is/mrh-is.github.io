<script lang="ts">
  import type { ProjectPreview } from "$lib/types/Project";

  export let size: "small" | "large";
  export let project: ProjectPreview;
</script>

<a class={size} href="/projects/{project.slug}">
  <img src={project.imageSrc} alt="" />
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

  @media (max-width: 1000px) {
    a.large,
    a.small {
      width: 90%;
    }
  }

  @media (max-width: 400px) {
    a.large,
    a.small {
      width: 100%;
    }
  }
</style>
