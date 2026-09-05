<script>
  import { formatBytes } from "./clean.js";

  export let result;
  export let previewUrl;

  const removed = [
    "EXIF and TIFF tags",
    "GPS coordinates",
    "Camera make, model and settings",
    "Capture timestamps",
    "XMP, IPTC and Photoshop blocks",
    "C2PA content credentials",
    "JUMBF containers",
    "AI generation tags",
  ];

  $: delta = Math.round(result.sizeDelta);
</script>

<div class="result">
  <div class="side">
    <p class="cap">Before</p>
    <figure class="preview">
      <img src={previewUrl} alt="Original, before cleaning" />
    </figure>
  </div>

  <div class="side">
    <p class="cap">
      After <span class="status ok">clean</span>
    </p>
    <figure class="preview">
      <img src={result.url} alt="Result, after cleaning" />
    </figure>
  </div>

  <div class="detail">
    <div class="rows">
      <div class="row">
        <span class="k">File name</span>
        <span class="v" title={result.filename}>{result.filename}</span>
      </div>
      <div class="row">
        <span class="k">Size</span>
        <span class="v">
          {formatBytes(result.size)}
          <span class="delta">
            {delta === 0 ? "no change" : `${delta > 0 ? "+" : ""}${delta}%`}
          </span>
        </span>
      </div>
    </div>

    {#if result.wasSecondPass}
      <p class="note">
        <span class="status warn">Second pass used</span>
        Metadata survived the first rewrite, so the image was re-encoded as JPEG
        on a white background. Transparency is not preserved.
      </p>
    {/if}

    <ul class="removed">
      {#each removed as item}
        <li><span class="status ok">{item}</span></li>
      {/each}
    </ul>
  </div>
</div>

<style>
  .result {
    display: grid;
    gap: var(--space-4);
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .detail {
    grid-column: 1 / -1;
    display: grid;
    gap: var(--space-4);
  }

  @media (min-width: 900px) {
    .result {
      grid-template-columns: repeat(2, minmax(0, 1fr)) minmax(0, 1fr);
      gap: var(--space-5);
      align-items: start;
    }

    .detail {
      grid-column: auto;
    }
  }

  .side {
    display: grid;
    gap: var(--space-2);
    min-width: 0;
  }

  .cap {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--text-3);
    font-size: var(--fs-1);
    line-height: var(--lh-1);
    font-weight: 500;
  }

  .delta {
    font-family: var(--font-ui);
    color: var(--text-3);
    margin-left: var(--space-2);
  }

  .row .v {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 60%;
  }

  .note {
    color: var(--text-2);
    font-size: var(--fs-1);
    line-height: var(--lh-2);
    display: grid;
    gap: var(--space-1);
  }

  .removed {
    display: grid;
    gap: var(--space-2);
    list-style: none;
  }
</style>
