<script>
  import { createEventDispatcher, onDestroy } from "svelte";
  import { extractMetadata, findings, isClean } from "./metadata.js";
  import { cleanImage, formatBytes } from "./clean.js";
  import { createZip } from "./zip.js";
  import Icon from "./Icon.svelte";

  export let files;

  const dispatch = createEventDispatcher();

  /** @type {'scanning'|'review'|'cleaning'|'done'} */
  let stage = "scanning";
  let items = files.map((file, id) => ({
    id,
    file,
    state: "pending", // pending | scanned | cleaning | done | failed
    labels: [],
    clean: false,
    result: null,
  }));
  let zipping = false;
  let cancelled = false;

  $: scanned = items.filter((item) => item.state !== "pending").length;
  $: done = items.filter((item) => item.state === "done" || item.state === "failed").length;
  $: succeeded = items.filter((item) => item.state === "done");
  $: dirty = items.filter((item) => !item.clean).length;

  function patch(id, values) {
    items = items.map((item) => (item.id === id ? { ...item, ...values } : item));
  }

  async function scanAll() {
    for (const item of items) {
      if (cancelled) return;
      try {
        const metadata = await extractMetadata(item.file);
        patch(item.id, {
          state: "scanned",
          clean: isClean(metadata),
          labels: findings(metadata).filter((f) => f.severity !== "info"),
        });
      } catch {
        patch(item.id, { state: "scanned", clean: false, labels: [] });
      }
    }
    stage = "review";
  }

  async function cleanAll() {
    stage = "cleaning";
    for (const item of items) {
      if (cancelled) return;
      patch(item.id, { state: "cleaning" });
      const result = await cleanImage(item.file);
      patch(item.id, { state: result.fallback ? "failed" : "done", result });
    }
    stage = "done";
    dispatch("notify", {
      tone: items.some((i) => i.state === "failed") ? "err" : "ok",
      message: items.some((i) => i.state === "failed")
        ? "Some images could not be re-encoded and were skipped."
        : `Metadata removed from ${items.length} images.`,
    });
  }

  async function downloadZip() {
    zipping = true;
    try {
      const used = new Set();
      const entries = [];
      for (const item of succeeded) {
        let name = item.result.filename;
        for (let n = 2; used.has(name); n++) {
          name = item.result.filename.replace(/(\.[^.]+)$/, `-${n}$1`);
        }
        used.add(name);
        const data = new Uint8Array(await (await fetch(item.result.url)).arrayBuffer());
        entries.push({ name, data });
      }
      const url = URL.createObjectURL(createZip(entries));
      const link = document.createElement("a");
      link.href = url;
      link.download = "untrace-cleaned.zip";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (error) {
      console.error("ZIP failed:", error);
      dispatch("notify", { tone: "err", message: "Could not build the ZIP. Download the images one by one instead." });
    } finally {
      zipping = false;
    }
  }

  function reset() {
    cancelled = true;
    dispatch("reset");
  }

  scanAll();

  onDestroy(() => {
    cancelled = true;
    for (const item of items) if (item.result?.url) URL.revokeObjectURL(item.result.url);
  });
</script>

<div class="batch" aria-live="polite">
  <div class="head">
    <h3>
      {#if stage === "scanning"}
        Scanning {scanned} of {items.length}…
      {:else if stage === "review"}
        {items.length} images ready, {dirty} with hidden data
      {:else if stage === "cleaning"}
        Cleaning {done} of {items.length}…
      {:else}
        {succeeded.length} of {items.length} cleaned
      {/if}
    </h3>
    <progress
      max={items.length}
      value={stage === "scanning" ? scanned : stage === "review" ? items.length : done}
      aria-label="Progress"
    ></progress>
  </div>

  <ul class="list">
    {#each items as item (item.id)}
      <li class="item">
        <div class="name">
          <span class="file" title={item.file.name}>{item.file.name}</span>
          <span class="size">{formatBytes(item.file.size)}</span>
        </div>

        <div class="state">
          {#if item.state === "pending"}
            <span class="status info">Waiting</span>
          {:else if item.state === "cleaning"}
            <span class="status info">Cleaning</span>
          {:else if item.state === "done"}
            <span class="status ok">Clean</span>
            <a class="btn btn-ghost dl" href={item.result.url} download={item.result.filename}>
              <Icon name="download" size="sm" /> Download
            </a>
          {:else if item.state === "failed"}
            <span class="status err">Could not re-encode</span>
          {:else if item.clean}
            <span class="status ok">Already clean</span>
          {:else}
            {#each item.labels.slice(0, 3) as label}
              <span class="status {label.severity}">{label.label}</span>
            {/each}
            {#if item.labels.length > 3}
              <span class="more">+{item.labels.length - 3} more</span>
            {/if}
          {/if}
        </div>
      </li>
    {/each}
  </ul>

  <div class="action-bar">
    {#if stage === "done"}
      <button
        type="button"
        class="btn btn-primary btn-block"
        aria-disabled={zipping || succeeded.length === 0}
        on:click={() => !zipping && succeeded.length > 0 && downloadZip()}
      >
        <Icon name="download" size="sm" />
        {zipping ? "Building ZIP…" : `Download ${succeeded.length} as ZIP`}
      </button>
      <button type="button" class="btn btn-secondary btn-block" on:click={reset}>
        <Icon name="refresh" size="sm" />
        Clean more images
      </button>
    {:else}
      <button
        type="button"
        class="btn btn-primary btn-block"
        aria-disabled={stage !== "review"}
        on:click={() => stage === "review" && cleanAll()}
      >
        {#if stage === "cleaning"}
          <span class="spinner" aria-hidden="true"></span>
          Cleaning…
        {:else}
          <Icon name="shield" size="sm" />
          Clean {items.length} images
        {/if}
      </button>
      <button type="button" class="btn btn-ghost btn-block" disabled={stage === "cleaning"} on:click={reset}>
        Choose different images
      </button>
    {/if}
  </div>
</div>

<style>
  .batch {
    display: grid;
    gap: var(--space-4);
  }

  .head {
    display: grid;
    gap: var(--space-2);
  }

  .head h3 {
    font-size: var(--fs-4);
    line-height: var(--lh-4);
    font-weight: 600;
  }

  progress {
    width: 100%;
    height: var(--space-2);
    accent-color: var(--accent);
  }

  .list {
    display: grid;
    gap: var(--space-2);
    list-style: none;
    max-height: calc(var(--space-9) * 5);
    overflow-y: auto;
  }

  .item {
    display: grid;
    gap: var(--space-2);
    padding: var(--space-3);
    border: var(--border-w) solid var(--border);
    border-radius: var(--radius-md);
    background: var(--surface);
  }

  @media (min-width: 768px) {
    .item {
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
    }
  }

  .name {
    display: flex;
    align-items: baseline;
    gap: var(--space-3);
    min-width: 0;
  }

  .file {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
  }

  .size,
  .more {
    color: var(--text-3);
    font-size: var(--fs-1);
    line-height: var(--lh-1);
    white-space: nowrap;
  }

  .state {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-3);
  }

  .dl {
    height: var(--space-7);
    padding-inline: var(--space-2);
  }
</style>
