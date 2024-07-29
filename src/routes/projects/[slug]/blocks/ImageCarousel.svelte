<script lang="ts">
  import type { ImageCarouselSlide } from "$lib/types/Project";
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
  let domElement: HTMLElement;

  onMount(() => {
    bp = BiggerPicture({
      target: domElement.ownerDocument.body,
    });

    const measurer = new Image();
    bpItems = slides.map((slide) => {
      measurer.src = slide.src;

      return {
        img: slide.src,
        width: measurer.naturalWidth,
        height: measurer.naturalHeight,
        caption: slide.caption,
      };
    });
  });

  const open = () => {
    bp.open({
      items: bpItems,
      el: domElement,
    });
  };

  $: currentCover = coverSrc ?? slides[0].src;

  export let coverSrc: string | undefined = undefined;
  export let slides: ImageCarouselSlide[];
</script>

<div>
  <a href={currentCover} bind:this={domElement} on:click|preventDefault={open}>
    <img src={currentCover} alt="" />
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
