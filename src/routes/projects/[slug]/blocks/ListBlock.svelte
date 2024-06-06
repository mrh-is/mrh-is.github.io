<script lang="ts">
  export let elements: string[];
</script>

<ul>
  {#each elements as element}
    <li>{element}</li>
  {/each}
</ul>