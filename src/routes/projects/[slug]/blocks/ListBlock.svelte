<script lang="ts">
  interface Props {
    elements: string[];
  }

  let { elements }: Props = $props();
</script>

<ul>
  {#each elements as element}
    <li>{element}</li>
  {/each}
</ul>
