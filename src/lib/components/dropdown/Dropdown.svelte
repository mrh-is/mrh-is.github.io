<script lang="ts" module>
  let instanceCount = 0;
</script>

<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    toggle: Snippet;
    children: Snippet;
  }

  let { toggle, children }: Props = $props();
  const idNumber = instanceCount;
  instanceCount += 1;

  const toggleId = `dropdownToggle${idNumber}`;
  const menuId = `dropdownMenu${idNumber}`;

  let mode: "hover" | "focus" | undefined = $state(undefined);
</script>

<div
  role="region"
  class:expanded={!!mode}
  onmouseleave={() => {
    if (mode !== "hover") return;
    mode = undefined;
  }}
>
  <!-- Technique from https://svelte.dev/repl/2f5ab01c05f84790bcb94a0f79afee7b -->
  <button
    id={toggleId}
    aria-controls={menuId}
    aria-haspopup="menu"
    aria-expanded={!!mode}
    onmouseenter={() => {
      if (mode) return;
      mode = "hover";
    }}
    onclick={(e) => {
      if (mode === undefined) {
        mode = "focus";
      } else if (mode === "focus") {
        e.currentTarget?.blur();
      }
    }}
    onblur={() => {
      if (mode !== "focus") return;
      mode = undefined;
    }}
  >
    {@render toggle()}
  </button>

  <menu id={menuId} aria-labelledby={toggleId}>
    {@render children()}
  </menu>
</div>

<style>
  div {
    position: relative;
  }

  button {
    border: none;
    background-color: inherit;
    padding: 0 0 1rem;
  }

  menu {
    position: absolute;
    right: 0;
    width: max-content;

    visibility: hidden;
    opacity: 0;
    /* Technique from https://greywyvern.com/337 */
    --fade-duration: 0.1s;
    transition:
      visibility 0s linear var(--fade-duration),
      opacity var(--fade-duration) ease-in-out;

    list-style: none;
    padding: 0;
    margin: 0;
    border-radius: 0.25rem;

    background-color: var(--panel-background-color);
    box-shadow: rgba(0, 0, 0, 0.25) 0 0.25rem 0.5rem;
  }

  :global(.expanded) button {
    color: var(--color-light-link);
  }

  :global(.expanded) menu {
    visibility: visible;
    opacity: 1;
    transition-delay: 0s;
  }

  @media (max-width: 800px) {
    menu {
      right: unset;
      left: 0;
      max-width: 80vw;
    }
  }

  @media (prefers-color-scheme: dark) {
    :global(.expanded) button {
      color: var(--color-dark-link);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    menu {
      transition: none;
    }
  }
</style>
