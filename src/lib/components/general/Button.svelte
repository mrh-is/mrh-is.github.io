<script lang="ts">
  export let href: string | undefined = undefined;
</script>

{#if href}
  <a {href}>
    <button type="button" on:click>
      <slot />
    </button>
  </a>
{:else}
  <button type="button" on:click>
    <slot />
  </button>
{/if}

<style>
  button {
    font-size: 2rem;
    padding: 1.5rem 3rem;
    background: var(--color-dark-blob);
    color: var(--color-dark-text);
    border: none;
    border-radius: 3rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
  }

  button:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  button:active {
    transform: scale(0.95);
  }

  a {
    text-decoration: none;
    display: inline-block;
  }

  @media (prefers-color-scheme: dark) {
    button {
      background: var(--color-light-blob);
      color: var(--color-light-text);
    }
  }
</style>
