<script lang="ts" module>
  let hasBeenImageYet = false;
</script>

<script lang="ts">
  import type { BiggerPictureInstance } from "bigger-picture";
  import BiggerPicture from "bigger-picture";
  import "bigger-picture/css";
  import { onMount } from "svelte";

  let bp: BiggerPictureInstance;
  let bpItems: {
    img: string;
    width: number;
    height: number;
    caption?: string;
  }[];
  let domElement: HTMLElement | undefined = $state();

  onMount(() => {
    if (!domElement) {
      return;
    }
    bp = BiggerPicture({
      target: domElement.ownerDocument.body,
    });

    const measurer = new Image();
    measurer.src = src;

    bpItems = [
      {
        img: src,
        width: measurer.naturalWidth,
        height: measurer.naturalHeight,
        caption: caption,
      },
    ];
  });

  const open = (e: MouseEvent) => {
    e.preventDefault();
    bp.open({
      items: bpItems,
      el: domElement,
    });
  };

  const isFirstImageOnPage = !hasBeenImageYet;
  hasBeenImageYet = true;

  interface Props {
    src: string;
    caption: string;
    rounded?: boolean;
  }

  const { src, caption, rounded }: Props = $props();
</script>

<div>
  <a href={src} bind:this={domElement} onclick={open}>
    <img
      {src}
      alt=""
      fetchpriority={isFirstImageOnPage ? "high" : undefined}
      class={rounded ? "rounded" : ""}
    />
  </a>
</div>

<p class="caption">{caption}</p>

<style>
  div {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  a {
    display: inline-block;
  }

  img {
    max-height: 100vh;
  }

  img.rounded {
    border-radius: 2rem;
  }

  .caption {
    opacity: 60%;
    margin-top: 0.25rem;
    font-size: 1rem;
    font-style: italic;
    font-weight: 200;
  }

  @media (max-width: 800px) {
    a {
      margin: 0 -5vw;
    }
  }
</style>
