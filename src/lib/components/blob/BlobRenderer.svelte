<script lang="ts">
  interface Props {
    path: string;
    strokeWidth?: number;
    size?: number;
  }

  const { path, strokeWidth = 300, size = 600 }: Props = $props();
</script>

<svg style="width: {size}px; height: {size}px">
  <path style="stroke-width: {strokeWidth}" d={path} />
</svg>

<style>
  path {
    fill: none;
    stroke: inherit;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
</style>
