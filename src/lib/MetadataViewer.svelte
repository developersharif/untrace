<script>
  export let metadata = {};

  function formatMetadata(data) {
    if (!data || Object.keys(data).length === 0) {
      return "No metadata found";
    }

    if (data.message && !data.hasMetadata) {
      return data.message;
    }

    let formatted = "";

    Object.entries(data).forEach(([section, values]) => {
      if (
        section === "fileType" ||
        section === "hasMetadata" ||
        section === "message"
      ) {
        return;
      }

      formatted += `[${section}]\n`;

      if (typeof values === "object" && values !== null) {
        Object.entries(values).forEach(([key, value]) => {
          let displayValue;
          if (Array.isArray(value)) {
            displayValue = `[${value.join(", ")}]`;
          } else if (typeof value === "string" && value.length > 100) {
            displayValue = value.substring(0, 100) + "...";
          } else {
            displayValue = value;
          }
          formatted += `  ${key}: ${displayValue}\n`;
        });
      }
      formatted += "\n";
    });

    return formatted.trim();
  }

  function getMetadataStats(metadata) {
    let totalEntries = 0;
    let sections = [];

    if (metadata.message && !metadata.hasMetadata) {
      return { totalEntries: 0, sections: [] };
    }

    Object.entries(metadata).forEach(([section, values]) => {
      if (
        section === "fileType" ||
        section === "hasMetadata" ||
        section === "message"
      ) {
        return;
      }

      if (typeof values === "object" && values !== null) {
        const count = Object.keys(values).length;
        totalEntries += count;
        sections.push(`${section}: ${count} entries`);
      }
    });

    return { totalEntries, sections };
  }

  function hasAIMetadata(metadata) {
    if (metadata["C2PA/AI Provenance"]) {
      const c2paData = metadata["C2PA/AI Provenance"];

      if (
        c2paData.AI_SIGNATURES &&
        Array.isArray(c2paData.AI_SIGNATURES) &&
        c2paData.AI_SIGNATURES.length > 0
      ) {
        return true;
      }

      if (
        c2paData.C2PA_FOUND &&
        Array.isArray(c2paData.C2PA_FOUND) &&
        c2paData.C2PA_FOUND.length > 0
      ) {
        return true;
      }

      if (c2paData.JUMBF_BOXES && Array.isArray(c2paData.JUMBF_BOXES)) {
        const realJumbf = c2paData.JUMBF_BOXES.filter(
          (box) =>
            !box.includes("APP2_segment") ||
            box.includes("jumb") ||
            box.includes("JUMB") ||
            box.includes("jumd") ||
            box.includes("JUMD")
        );
        if (realJumbf.length > 0) {
          return true;
        }
      }

      if (c2paData.TOTAL_SIGNATURES && c2paData.TOTAL_SIGNATURES > 1) {
        return true;
      }
    }

    const aiKeywords = [
      "chatgpt",
      "openai",
      "dall-e",
      "dalle",
      "midjourney",
      "stable diffusion",
      "artificial intelligence",
      "ai-generated",
      "machine learning",
      "neural network",
      "synthesized",
      "gpt-4",
      "trainedAlgorithmicMedia",
      "adobe firefly",
      "google imagen",
      "anthropic claude",
      "runway ml",
      "artbreeder",
      "deepdream",
      "nightcafe",
      "starryai",
      "jasper art",
      "canva ai",
      "remove.bg",
      "upscayl",
      "real-esrgan",
      "waifu2x",
      "topaz gigapixel",
      "c2pa",
      "content credentials",
      "provenance",
      "content authenticity",
      "jumbf",
      "cai",
      "project origin",
    ];

    let hasAI = false;

    Object.entries(metadata).forEach(([section, values]) => {
      if (
        section === "fileType" ||
        section === "hasMetadata" ||
        section === "message" ||
        section === "Raw Analysis" ||
        section === "C2PA/AI Provenance"
      ) {
        return;
      }

      if (typeof values === "object" && values !== null) {
        Object.entries(values).forEach(([key, value]) => {
          const valueString = String(value).toLowerCase();
          if (
            aiKeywords.some((keyword) =>
              valueString.includes(keyword.toLowerCase())
            )
          ) {
            hasAI = true;
          }
        });
      }
    });

    return hasAI;
  }

  $: formattedMetadata = formatMetadata(metadata);
  $: containsAITags = hasAIMetadata(metadata);
  $: metadataStats = getMetadataStats(metadata);
</script>

<div class="metadata-section">
  <div class="flex justify-between items-center mb-4">
    <h4 class="font-semibold">EXIF Metadata</h4>
    {#if containsAITags}
      <span class="status-warning py-1 px-2 text-xs">
        ⚠️ Contains AI-related tags
      </span>
    {/if}
  </div>

  {#if Object.keys(metadata).length === 0 || (metadata.message && !metadata.hasMetadata)}
    <div class="status-success">
      {#if metadata.message}
        ✅ {metadata.message}
      {:else}
        ✅ No metadata found - image is already clean!
      {/if}
    </div>

    {#if metadata.fileType === "png"}
      <div class="mt-3 p-3 bg-info rounded text-sm">
        <p><strong>ℹ️ About PNG files:</strong></p>
        <p>
          PNG files typically don't contain EXIF metadata. However, you can
          still process this image to ensure it's completely clean and remove
          any potential hidden data.
        </p>
      </div>
    {/if}
  {:else}
    <div class="mb-4">
      <div class="metadata-summary">
        <p class="text-sm text-secondary">
          <strong>Total entries:</strong>
          {metadataStats.totalEntries}
        </p>
        <div class="text-xs text-muted mt-1">
          {#each metadataStats.sections as section}
            <span class="section-tag">{section}</span>
          {/each}
        </div>
      </div>
    </div>

    <div class="metadata-viewer">
      {formattedMetadata}
    </div>

    <div class="mt-4">
      <h5 class="font-medium mb-2">Privacy Concerns Found:</h5>
      <ul class="text-sm text-secondary space-y-1">
        {#if metadata.GPS}
          <li class="status-warning">📍 GPS location data</li>
        {/if}
        {#if metadata.Camera}
          <li class="status-warning">📷 Camera information</li>
        {/if}
        {#if metadata.Technical}
          <li class="status-warning">🖼️ Image creation details</li>
        {/if}
        {#if containsAITags}
          <li class="status-warning">🤖 AI generation indicators</li>
          {#if metadata["C2PA/AI Provenance"]}
            <ul class="ml-4 mt-1 text-xs">
              {#if metadata["C2PA/AI Provenance"].AI_SIGNATURES && metadata["C2PA/AI Provenance"].AI_SIGNATURES.length > 0}
                <li>
                  • AI Tools: {metadata[
                    "C2PA/AI Provenance"
                  ].AI_SIGNATURES.join(", ")}
                </li>
              {/if}
              {#if metadata["C2PA/AI Provenance"].C2PA_FOUND && metadata["C2PA/AI Provenance"].C2PA_FOUND.length > 0}
                <li>
                  • C2PA Provenance: {metadata["C2PA/AI Provenance"].C2PA_FOUND
                    .length} signature(s)
                </li>
              {/if}
              {#if metadata["C2PA/AI Provenance"].TOTAL_SIGNATURES && metadata["C2PA/AI Provenance"].TOTAL_SIGNATURES > 0}
                <li>
                  • Total AI/C2PA markers: {metadata["C2PA/AI Provenance"]
                    .TOTAL_SIGNATURES}
                </li>
              {/if}
              {#if metadata["C2PA/AI Provenance"].JUMBF_BOXES && metadata["C2PA/AI Provenance"].JUMBF_BOXES.length > 0}
                <li>
                  • JUMBF metadata containers: {metadata["C2PA/AI Provenance"]
                    .JUMBF_BOXES.length}
                </li>
              {/if}
            </ul>
          {/if}
        {/if}
        {#if metadata.XMP}
          <li class="status-warning">📝 XMP metadata</li>
        {/if}
        {#if metadata.IPTC}
          <li class="status-warning">📋 IPTC metadata</li>
        {/if}
        {#if metadata.Other && Object.keys(metadata.Other).length > 0}
          <li class="status-warning">📄 Other metadata</li>
        {/if}
      </ul>

      {#if metadata["Color Profile"]}
        <div class="mt-3 p-2 bg-info rounded text-xs">
          <p>
            <strong>ℹ️ Color Profile:</strong> Contains ICC color management data
            (not privacy-concerning)
          </p>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .space-y-1 > * + * {
    margin-top: 0.25rem;
  }

  .metadata-summary {
    background-color: var(--bg-tertiary);
    padding: 0.75rem;
    border-radius: 0.375rem;
    border: 1px solid var(--border-color);
  }

  .section-tag {
    display: inline-block;
    background-color: var(--primary-color);
    color: white;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    margin-right: 0.5rem;
    margin-bottom: 0.25rem;
    font-size: 0.75rem;
  }
</style>
