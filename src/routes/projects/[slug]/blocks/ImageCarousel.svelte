<script lang="ts">
  import type { ImageCarouselSlide } from "$lib/types/Project";
  import type { BiggerPictureInstance } from "bigger-picture";
  import {
    getImageUrl,
    getLargestImageUrl,
    type ImageSource,
  } from "$lib/utils/imageUrl";
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

  onMount(async () => {
    if (!domElement) {
      return;
    }
    bp = BiggerPicture({
      target: domElement.ownerDocument.body,
    });

    bpItems = await Promise.all(
      slides.map(
        (slide) =>
          new Promise<{
            img: string;
            width: number;
            height: number;
            caption?: string;
          }>((resolve) => {
            const slideUrl = getLargestImageUrl(slide.src);
            const measurer = new Image();
            measurer.onload = () => {
              resolve({
                img: slideUrl,
                width: measurer.naturalWidth,
                height: measurer.naturalHeight,
                caption: slide.caption,
              });
            };
            measurer.src = slideUrl;
          }),
      ),
    );
  });

  const open = (e: MouseEvent) => {
    e.preventDefault();
    bp.open({
      items: bpItems,
      el: domElement,
    });
  };

  interface Props {
    coverSrc?: ImageSource | undefined;
    coverAlt?: string;
    slides: ImageCarouselSlide[];
    hero?: boolean;
  }

  const {
    coverSrc = undefined,
    coverAlt,
    slides,
    hero = false,
  }: Props = $props();
  const currentCover = $derived(coverSrc ?? slides[0].src);
  const currentCoverUrl = $derived(getImageUrl(currentCover));
  const currentCoverAlt = $derived(
    coverAlt ?? slides[0].alt ?? slides[0].caption,
  );
</script>

<div>
  <a
    href={currentCoverUrl}
    bind:this={domElement}
    onclick={open}
    aria-label="View image gallery"
  >
    <img
      src={currentCoverUrl}
      alt={currentCoverAlt}
      fetchpriority={hero ? "high" : undefined}
      loading={hero ? undefined : "lazy"}
    />
  </a>
</div>

<p class="instructions">Click the image above to embiggen & see notes.</p>

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

  .instructions {
    opacity: 80%;
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
