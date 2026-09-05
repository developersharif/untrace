<script>
  import { theme } from "./theme.js";
  import Icon from "./Icon.svelte";
</script>

<button
  class="theme-toggle"
  type="button"
  on:click={() => theme.toggle()}
  aria-label="Switch to {$theme === 'light' ? 'dark' : 'light'} theme"
>
  <Icon name={$theme === "light" ? "moon" : "sun"} size="sm" />
  <span class="text">{$theme === "light" ? "Dark" : "Light"}</span>
</button>

<style>
  .text {
    display: none;
  }

  @media (min-width: 560px) {
    .text {
      display: inline;
    }
  }
</style>
