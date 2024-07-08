<script lang="ts" context="module">
  let instanceCount = 0;
</script>

<script lang="ts">
  const idNumber = instanceCount;
  instanceCount += 1;

  const toggleId = `dropdownToggle${idNumber}`;
  const menuId = `dropdownMenu${idNumber}`;

  let expanded = false;
</script>

<div>
  <!-- Technique from https://svelte.dev/repl/2f5ab01c05f84790bcb94a0f79afee7b -->
  <button
    id={toggleId}
    aria-controls={menuId}
    aria-haspopup="menu"
    aria-expanded={expanded}
    on:mouseenter={() => {
      expanded = true;
    }}
    on:mouseleave={() => {
      expanded = false;
    }}
  >
    <slot name="toggle" />
  </button>

  <menu id={menuId} aria-labelledby={toggleId}>
    <slot />
  </menu>
</div>

<style>
  div {
    position: relative;
  }

  button {
    border: none;
    background-color: inherit;
    font-weight: inherit;
    padding-bottom: 1rem;
  }

  menu {
    position: absolute;
    right: 0;

    visibility: hidden;
    opacity: 0;
    /* Technique from https://greywyvern.com/337 */
    --fade-duration: 0.1s;
    transition: visibility 0s linear var(--fade-duration),
      opacity var(--fade-duration) ease-in-out;

    list-style: none;
    padding: 0;
    margin: 0;
    border-radius: 0.25rem;

    box-shadow: rgba(0, 0, 0, 0.25) 0 0.25rem 0.5rem;
  }

  div:hover > menu,
  div:focus > menu {
    visibility: visible;
    opacity: 1;
    transition-delay: 0s;
  }
</style>
