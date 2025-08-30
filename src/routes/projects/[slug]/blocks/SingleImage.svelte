<script lang="ts" module>
  let hasBeenImageYet = false;
</script>

<script lang="ts">
  import { getImageUrl, type ImageSource } from "$lib/utils/imageUrl";
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
    measurer.src = imageUrl;

    bpItems = [
      {
        img: imageUrl,
        width: measurer.naturalWidth,
        height: measurer.naturalHeight,
        caption: caption,
      },
    ];
  });

  interface Props {
    src: ImageSource;
    caption: string;
    rounded?: boolean;
  }

  const { src, caption, rounded }: Props = $props();
  const imageUrl = getImageUrl(src);

  const open = (e: MouseEvent) => {
    e.preventDefault();
    bp.open({
      items: bpItems,
      el: domElement,
    });
  };

  const isFirstImageOnPage = !hasBeenImageYet;
  hasBeenImageYet = true;
</script>

<div class={isFirstImageOnPage ? "hero" : ""}>
  <a
    href={imageUrl}
    bind:this={domElement}
    onclick={open}
    aria-label="Open image in lightbox"
  >
    <enhanced:img
      {src}
      alt=""
      fetchpriority={isFirstImageOnPage ? "high" : undefined}
      class={rounded ? "rounded" : ""}
      sizes="(max-width: 800px) 90vw, (max-width: 1200px) 70vw, 60vw"
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
    display: block;
    width: 100%;
  }

  enhanced\:img {
    max-height: 100vh;
    width: 100%;
    height: auto;
  }

  enhanced\:img.rounded {
    border-radius: 2rem;
  }

  .hero {
    margin-left: -8vw;
    margin-right: -8vw;
    width: calc(100% + 16vw);
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
