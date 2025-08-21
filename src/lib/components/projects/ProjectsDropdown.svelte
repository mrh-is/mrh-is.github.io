<script lang="ts">
  import type { ProjectNavLink } from "$lib/types/Project";
  import Dropdown from "../dropdown/Dropdown.svelte";
  import DropdownItem from "../dropdown/DropdownItem.svelte";

  interface Props {
    projects: ProjectNavLink[];
  }

  const { projects }: Props = $props();
</script>

<Dropdown>
  {#snippet toggle()}
    <span>Projects ↓</span>
  {/snippet}

  {#each projects as project (project.slug)}
    <DropdownItem>
      <a href="/projects/{project.slug}">{project.title}</a>
    </DropdownItem>
  {/each}
</Dropdown>
