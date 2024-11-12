<script lang="ts">
  export let title: string | undefined = undefined;
  export let subtitle: string | undefined = undefined;
</script>

<div class="section" id={title?.toLocaleLowerCase()}>
  {#if title}
    <h1>{title}</h1>
  {/if}
  {#if subtitle}
    <p class="subtitle">{subtitle}</p>
  {/if}
  <slot />
</div>

<style>
  .section {
    margin-top: 15rem;
    margin-bottom: 15rem;
  }

  .subtitle {
    font-weight: 400;
    font-size: 2.5rem;
    line-height: 1.3;
    margin-bottom: 2rem;
  }

  @media (max-width: 800px) {
    .section {
      margin-top: 10rem;
      margin-bottom: 10rem;
    }
  }
</style>
