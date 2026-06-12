<script lang="ts">
  import Icon from "$lib/components/general/Icon.svelte";
</script>

<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-top">
      <span class="domain header-font">mrh.is</span>
      <div class="footer-icons">
        <a href="mailto:me@mrh.is" aria-label="Email me">
          <Icon name="Mail" size={20} />
        </a>
        <a
          href="https://www.linkedin.com/in/michaelhelmbrecht/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <Icon name="LinkedIn" size={20} />
        </a>
      </div>
    </div>
    <p class="footer-sub">
      designed &amp; built by me · <a
        href="https://github.com/mrh-is/mrh-is.github.io"
        target="_blank"
        rel="noopener noreferrer">view source</a
      >
    </p>
  </div>
</footer>

<style>
  .site-footer {
    padding: 3rem 10vw 4rem;
  }

  .footer-inner {
    max-width: var(--max-width);
    margin-left: auto;
    margin-right: auto;
  }

  .footer-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .domain {
    font-size: 2rem;
    font-weight: 800;
    color: var(--text-color);
    text-decoration: none;
  }

  .footer-icons {
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }

  .footer-icons a {
    color: var(--color-light-link);
    display: flex;
    align-items: center;
  }

  .footer-sub {
    margin-top: 0.75rem;
    font-size: 1.2rem;
    color: var(--text-color);
    opacity: 0.4;
  }

  .footer-sub a {
    color: inherit;
  }

  @media (prefers-color-scheme: dark) {
    .footer-icons a {
      color: var(--color-dark-link);
    }
  }
</style>
