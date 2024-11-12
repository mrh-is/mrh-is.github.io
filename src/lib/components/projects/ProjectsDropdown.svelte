<script lang="ts">
  import type { ProjectNavLink } from "$lib/types/Project";
  import Dropdown from "../dropdown/Dropdown.svelte";
  import DropdownItem from "../dropdown/DropdownItem.svelte";

  export let projects: ProjectNavLink[];
</script>

<Dropdown>
  <span slot="toggle">Projects ↓</span>

  {#each projects as project}
    <DropdownItem>
      <a href="/projects/{project.slug}">{project.title}</a>
    </DropdownItem>
  {/each}
</Dropdown>
