<script lang="ts">
  interface Props {
    text: string;
  }

  let { text }: Props = $props();
</script>

<h2>{text}</h2>
