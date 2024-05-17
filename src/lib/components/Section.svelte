<script lang="ts">
  export let title: string | undefined = undefined;
</script>

<div class="section" id={title?.toLocaleLowerCase()}>
  {#if title}
    <h1>{title}</h1>
  {/if}
  <slot></slot>
</div>

<style>
  .section {
    margin-top: 30vh;
    margin-bottom: 30vh;
  }
</style>