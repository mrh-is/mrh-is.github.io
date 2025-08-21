<script lang="ts">
  interface Props {
    elements: string[];
  }

  const { elements }: Props = $props();
</script>

<ul>
  {#each elements as element, index (index)}
    <li>{element}</li>
  {/each}
</ul>
