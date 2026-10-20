<script>
  import { createEventDispatcher } from "svelte";
  import { ACCEPTED_EXTENSIONS, isAccepted } from "./metadata.js";
  import Icon from "./Icon.svelte";

  const dispatch = createEventDispatcher();

  export let busy = false;

  let dragging = false;
  let fileInput;
  let depth = 0;

  const MAX_FILES = 50;

  function offer(list) {
    const incoming = [...(list || [])].filter(Boolean);
    if (incoming.length === 0) return;

    const accepted = incoming.filter(isAccepted);
    if (accepted.length === 0) {
      const type = incoming[0].type;
      dispatch("reject", {
        message: `Untrace cannot read ${type || "that file type"}. Choose JPEG, PNG, TIFF, HEIC or AVIF images.`,
      });
      return;
    }

    const skipped = incoming.length - accepted.length;
    const capped = accepted.slice(0, MAX_FILES);
    const over = accepted.length - capped.length;
    if (skipped > 0 || over > 0) {
      dispatch("reject", {
        message:
          over > 0
            ? `Only the first ${MAX_FILES} images were added.`
            : `Skipped ${skipped} file${skipped === 1 ? "" : "s"} Untrace cannot read.`,
      });
    }
    dispatch("select", { files: capped });
  }

  function onDrop(event) {
    event.preventDefault();
    depth = 0;
    dragging = false;
    if (busy) return;
    offer(event.dataTransfer?.files);
  }

  function onDragEnter(event) {
    event.preventDefault();
    if (busy) return;
    depth += 1;
    dragging = true;
  }

  function onDragLeave(event) {
    event.preventDefault();
    depth = Math.max(0, depth - 1);
    if (depth === 0) dragging = false;
  }

  function onChange(event) {
    offer(event.target.files);
    // Reset so choosing the same file twice still fires a change event.
    event.target.value = "";
  }

  function onPaste(event) {
    if (busy) return;
    const item = [...(event.clipboardData?.items || [])].find((entry) =>
      entry.type.startsWith("image/")
    );
    if (item) offer([item.getAsFile()]);
  }
</script>

<svelte:window
  on:paste={onPaste}
  on:dragover|preventDefault
  on:drop|preventDefault
/>

<button
  type="button"
  class="dropzone"
  data-drag={dragging}
  disabled={busy}
  on:click={() => fileInput.click()}
  on:dragenter={onDragEnter}
  on:dragover|preventDefault
  on:dragleave={onDragLeave}
  on:drop={onDrop}
>
  <span class="glyph"><Icon name="upload" size="lg" /></span>
  <span class="title">
    {dragging ? "Drop to scan" : "Drop images, or choose files"}
  </span>
  <span class="hint">
    Nothing is uploaded. Add one image or up to 50 at once.
  </span>
  <span class="chip-row formats">
    <span class="chip">JPEG</span>
    <span class="chip">PNG</span>
    <span class="chip">TIFF</span>
    <span class="chip">HEIC</span>
    <span class="chip">AVIF</span>
  </span>
</button>

<p class="paste-hint">
  You can also paste an image with <kbd>Ctrl</kbd>+<kbd>V</kbd>.
</p>

<input
  class="visually-hidden"
  type="file"
  multiple
  accept={ACCEPTED_EXTENSIONS}
  bind:this={fileInput}
  on:change={onChange}
  tabindex="-1"
  aria-hidden="true"
/>

<style>
  .formats {
    justify-content: center;
    margin-top: var(--space-2);
  }

  .paste-hint {
    margin-top: var(--space-3);
    text-align: center;
    color: var(--text-3);
    font-size: var(--fs-1);
    line-height: var(--lh-1);
  }

  kbd {
    font-family: var(--font-mono);
    font-size: var(--fs-1);
    color: var(--text-2);
    padding: 0 var(--space-1);
    border: var(--border-w) solid var(--border-strong);
    border-radius: var(--radius-sm);
  }
</style>
