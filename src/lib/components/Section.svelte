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
    margin-top: 30vh;
    margin-bottom: 30vh;
  }

  .subtitle {
    font-weight: 400;
  }
</style>
