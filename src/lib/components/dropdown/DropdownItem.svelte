<li>
  <slot />
</li>

<style>
  li {
    margin: 1rem 1.5rem;
  }

  li :global(*) {
    hyphens: none;
  }
</style>
