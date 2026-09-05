<script>
  import { createEventDispatcher, onDestroy } from "svelte";
  import { fade } from "svelte/transition";
  import { extractMetadata } from "./metadata.js";
  import { cleanImage } from "./clean.js";
  import { motionSafe } from "./theme.js";
  import Dropzone from "./Dropzone.svelte";
  import ReviewPanel from "./ReviewPanel.svelte";
  import ResultPanel from "./ResultPanel.svelte";
  import Icon from "./Icon.svelte";

  const dispatch = createEventDispatcher();

  const steps = ["Scan", "Review", "Download"];

  /** @type {'idle'|'scanning'|'review'|'cleaning'|'done'} */
  let stage = "idle";
  let file = null;
  let metadata = null;
  let previewUrl = null;
  let result = null;

  $: current = stage === "idle" || stage === "scanning" ? 0 : stage === "done" ? 2 : 1;
  $: busy = stage === "scanning" || stage === "cleaning";

  function stepState(index, active) {
    if (index < active) return "done";
    if (index === active) return "current";
    return "upcoming";
  }

  function release() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (result?.url) URL.revokeObjectURL(result.url);
    previewUrl = null;
    result = null;
  }

  async function onSelect(event) {
    release();
    file = event.detail.file;
    previewUrl = URL.createObjectURL(file);
    metadata = null;
    stage = "scanning";

    try {
      metadata = await extractMetadata(file);
      stage = "review";
    } catch (error) {
      console.error("Scan failed:", error);
      stage = "idle";
      dispatch("notify", {
        tone: "err",
        message: "That image could not be read. Try a different file.",
      });
    }
  }

  async function clean() {
    if (!file) return;
    stage = "cleaning";
    result = await cleanImage(file);
    stage = "done";

    if (result.fallback) {
      dispatch("notify", {
        tone: "err",
        message:
          "This image could not be re-encoded, so nothing was removed. Try converting it to JPEG or PNG first.",
      });
    } else {
      dispatch("notify", { tone: "ok", message: "Metadata removed." });
    }
  }

  function reset() {
    release();
    file = null;
    metadata = null;
    stage = "idle";
  }

  onDestroy(release);
</script>

<section class="card tool" id="tool" aria-labelledby="tool-heading">
  <h2 class="visually-hidden" id="tool-heading">Clean an image</h2>

  <ol class="stepper">
    {#each steps as label, index}
      <li class="step" data-state={stepState(index, current)}>
        <span class="num" aria-hidden="true">
          {#if stepState(index, current) === "done"}
            <Icon name="check" size="sm" />
          {:else}
            {index + 1}
          {/if}
        </span>
        <span class="label">{label}</span>
      </li>
    {/each}
  </ol>

  <div class="panel" aria-live="polite">
    {#if stage === "idle"}
      <div in:fade={{ duration: motionSafe(200) }}>
        <Dropzone
          {busy}
          on:select={onSelect}
          on:reject={(e) => dispatch("notify", { tone: "err", message: e.detail.message })}
        />
      </div>
    {:else if stage === "scanning"}
      <div class="loading" in:fade={{ duration: motionSafe(200) }}>
        <div class="skeleton block"></div>
        <div class="lines">
          <div class="skeleton line"></div>
          <div class="skeleton line short"></div>
          <div class="skeleton line"></div>
        </div>
        <p class="loading-text">Reading metadata from {file.name}…</p>
      </div>
    {:else}
      <div in:fade={{ duration: motionSafe(200) }}>
        {#if stage === "done" && result}
          <ResultPanel {result} {previewUrl} />
        {:else}
          <ReviewPanel {file} {metadata} {previewUrl} />
        {/if}
      </div>
    {/if}
  </div>

  {#if stage !== "idle" && stage !== "scanning"}
    <div class="action-bar">
      {#if stage === "done" && result}
        {#if result.fallback}
          <button type="button" class="btn btn-primary btn-block" on:click={reset}>
            <Icon name="refresh" size="sm" />
            Try another image
          </button>
        {:else}
          <a
            class="btn btn-primary btn-block"
            href={result.url}
            download={result.filename}
          >
            <Icon name="download" size="sm" />
            Download clean image
          </a>
          <button type="button" class="btn btn-secondary btn-block" on:click={reset}>
            <Icon name="refresh" size="sm" />
            Clean another image
          </button>
        {/if}
      {:else}
        <button
          type="button"
          class="btn btn-primary btn-block"
          aria-disabled={stage === "cleaning"}
          on:click={clean}
        >
          {#if stage === "cleaning"}
            <span class="spinner" aria-hidden="true"></span>
            Cleaning…
          {:else}
            <Icon name="shield" size="sm" />
            Clean image
          {/if}
        </button>
        <button
          type="button"
          class="btn btn-ghost btn-block"
          disabled={stage === "cleaning"}
          on:click={reset}
        >
          Choose a different image
        </button>
      {/if}
    </div>
  {/if}
</section>

<style>
  .tool {
    padding: var(--space-4);
    scroll-margin-top: calc(var(--topbar-h) + var(--space-4));
  }

  @media (min-width: 768px) {
    .tool {
      padding: var(--space-5);
    }
  }

  .panel {
    min-height: calc(var(--space-9) * 2);
  }

  .loading {
    display: grid;
    gap: var(--space-4);
  }

  @media (min-width: 900px) {
    .loading {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      align-items: start;
    }

    .loading-text {
      grid-column: 1 / -1;
    }
  }

  .block {
    height: calc(var(--space-9) * 2);
  }

  .lines {
    display: grid;
    gap: var(--space-3);
    align-content: start;
  }

  .line {
    height: var(--space-5);
  }

  .line.short {
    width: 60%;
  }

  .loading-text {
    color: var(--text-3);
    font-size: var(--fs-2);
    line-height: var(--lh-2);
    overflow-wrap: anywhere;
  }

  /* On small screens the bar sticks to the bottom of the viewport so the one
     primary action is always within thumb reach; it becomes an inline row at
     the tablet breakpoint. */
  .action-bar {
    margin-top: var(--space-5);
    margin-bottom: calc(var(--space-4) * -1);
    border-bottom-left-radius: var(--radius-md);
    border-bottom-right-radius: var(--radius-md);
  }

  @media (min-width: 768px) {
    .action-bar {
      margin-bottom: 0;
    }
  }
</style>
