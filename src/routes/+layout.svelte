<script>
	import NavBar from "$lib/components/NavBar.svelte";

  import '$lib/assets/normalize.css';
  import '$lib/assets/styles.css';
</script>

<svelte:head>
  <link rel="preconnect" href="https://rsms.me/">
  <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
</svelte:head>

<NavBar />

<div class="content">
  <div class="container">
    <slot></slot>
  </div>
</div>

<style>
  .content {
    min-height: 80vh;
    margin: 0 10vw 10vh;
  }

  .container {
    max-width: 940px;
    margin-left: auto;
    margin-right: auto;
  }
</style>