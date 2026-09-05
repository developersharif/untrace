<script>
  import ThemeToggle from "./ThemeToggle.svelte";
  import Icon from "./Icon.svelte";
</script>

<header class="topbar">
  <div class="wrap inner">
    <a class="wordmark" href="/" aria-label="Untrace home">
      <span class="r-mark" aria-hidden="true">U</span>
      <span>Untrace</span>
    </a>

    <nav class="actions" aria-label="Site">
      <a
        class="btn btn-ghost repo"
        href="https://github.com/developersharif/untrace"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon name="github" size="sm" />
        <span>Source</span>
      </a>
      <ThemeToggle />
    </nav>
  </div>
</header>

<style>
  .actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .repo {
    height: var(--space-8);
    padding-inline: var(--space-3);
  }

  .repo:hover {
    text-decoration: none;
  }

  .repo span {
    display: none;
  }

  @media (min-width: 560px) {
    .repo span {
      display: inline;
    }
  }
</style>
