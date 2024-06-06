<script lang="ts">
  export let title: string | undefined = undefined;
  export let text: string;
</script>

<p>
  {#if title}
    <span class="title">{title}:</span>
  {/if}

  {@html text}
</p>

<style>
  .title {
    font-weight: 400;
  }
</style>