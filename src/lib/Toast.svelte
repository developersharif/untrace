<script>
  import { fade } from "svelte/transition";
  import { motionSafe } from "./theme.js";
  import Icon from "./Icon.svelte";

  /** @type {{id: number, message: string, tone: 'ok'|'err'}[]} */
  export let toasts = [];
  export let dismiss = () => {};
</script>

<div class="toast-region" role="status" aria-live="polite">
  {#each toasts as toast (toast.id)}
    <div
      class="toast"
      data-tone={toast.tone}
      out:fade={{ duration: motionSafe(200) }}
    >
      <span class="icon" aria-hidden="true">
        <Icon name={toast.tone === "err" ? "close" : "check"} size="sm" />
      </span>
      <span class="message">{toast.message}</span>
      <button type="button" on:click={() => dismiss(toast.id)} aria-label="Dismiss">
        <Icon name="close" size="sm" />
      </button>
    </div>
  {/each}
</div>

<style>
  .toast-region {
    left: var(--space-4);
    right: var(--space-4);
    top: calc(var(--topbar-h) + var(--space-3));
    bottom: auto;
    justify-items: stretch;
  }

  @media (min-width: 768px) {
    .toast-region {
      left: auto;
      top: auto;
      right: var(--space-5);
      bottom: var(--space-5);
      max-width: calc(var(--space-9) * 4);
    }
  }

  .toast[data-tone="err"] {
    border-left-color: var(--error);
  }

  .toast[data-tone="err"] .icon {
    color: var(--error);
  }

  .icon {
    display: inline-flex;
    flex: none;
  }

  .message {
    flex: 1;
  }

  .toast button {
    display: inline-flex;
    flex: none;
  }
</style>
