<script>
  import { onMount } from "svelte";
  import ImageUploader from "./lib/ImageUploader.svelte";
  import MetadataViewer from "./lib/MetadataViewer.svelte";
  import ImageProcessor from "./lib/ImageProcessor.svelte";
  import ThemeToggle from "./lib/ThemeToggle.svelte";
  import Header from "./lib/Header.svelte";
  import Footer from "./lib/Footer.svelte";
  import PrivacyInfo from "./lib/PrivacyInfo.svelte";

  let selectedFile = null;
  let metadata = null;
  let processedImage = null;
  let isProcessing = false;
  let showMetadata = false;
  let showFileInfo = false;
  let showPrivacyInfo = false;
  let darkMode = false;

  onMount(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      darkMode = savedTheme === "dark";
    } else {
      darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    updateTheme();
  });

  function updateTheme() {
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }

  function handleThemeToggle() {
    darkMode = !darkMode;
    updateTheme();
  }

  function handleFileSelected(event) {
    selectedFile = event.detail.file;
    metadata = event.detail.metadata;
    processedImage = null;
    showMetadata = false;
  }

  function handleProcessingStart() {
    isProcessing = true;
  }

  function handleProcessingComplete(event) {
    isProcessing = false;
    processedImage = event.detail.processedImage;
  }

  function handleReset() {
    selectedFile = null;
    metadata = null;
    processedImage = null;
    isProcessing = false;
    showMetadata = false;
  }

  function toggleMetadata() {
    showMetadata = !showMetadata;
  }

  function toggleFileInfo() {
    showFileInfo = !showFileInfo;
  }

  function togglePrivacyInfo() {
    showPrivacyInfo = !showPrivacyInfo;
  }
</script>

<ThemeToggle {darkMode} on:toggle={handleThemeToggle} />

<main class="container py-8">
  <Header />

  <div class="grid gap-6">
    <section class="card">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Upload Your Image</h2>
      </div>

      <ImageUploader
        on:fileSelected={handleFileSelected}
        on:reset={handleReset}
        disabled={isProcessing}
      />
    </section>

    <!-- Processing Section -->
    {#if selectedFile}
      <section class="grid grid-2 gap-6">
        <div class="card">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-lg font-semibold">Original</h3>
            {#if metadata}
              <button class="btn btn-ghost text-sm" on:click={toggleMetadata}>
                {showMetadata ? "Hide" : "Show"} Metadata
              </button>
            {/if}
          </div>

          <div class="text-center mb-3">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Original"
              class="image-preview"
            />
          </div>

          <div class="text-xs text-secondary">
            <p>
              {selectedFile.name} • {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
            {#if metadata && metadata.message && !metadata.hasMetadata}
              <p class="text-success">✓ No metadata detected</p>
            {:else if metadata}
              <p class="text-warning">
                ⚠️ {Object.keys(metadata).filter(
                  (key) => !["fileType", "hasMetadata", "message"].includes(key)
                ).length} metadata entries found
              </p>
            {/if}
          </div>

          {#if showMetadata && metadata}
            <div class="mt-4">
              <MetadataViewer {metadata} />
            </div>
          {/if}
        </div>

        <div class="card">
          <h3 class="text-lg font-semibold mb-3">Clean Metadata</h3>
          <ImageProcessor
            file={selectedFile}
            on:processingStart={handleProcessingStart}
            on:processingComplete={handleProcessingComplete}
            disabled={isProcessing}
          />

          {#if isProcessing}
            <div class="mt-3">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 100%;"></div>
              </div>
              <p class="text-xs text-secondary mt-1">Processing...</p>
            </div>
          {/if}

          {#if processedImage}
            <div class="mt-4 slide-up">
              <h4 class="font-medium mb-2">✅ Clean Image</h4>
              <div class="text-center mb-3">
                <img
                  src={processedImage.url}
                  alt="Cleaned"
                  class="image-preview"
                />
              </div>

              <div class="text-xs text-secondary mb-3">
                <p>
                  {(processedImage.size / 1024).toFixed(1)} KB •
                  {processedImage.compressionRatio
                    ? `${processedImage.compressionRatio > 0 ? "-" : "+"}${Math.abs(processedImage.compressionRatio)}% size`
                    : "Processed"}
                </p>
                {#if processedImage.wasSecondPass}
                  <p class="status-warning">
                    ⚠️ Used enhanced cleaning (second pass)
                  </p>
                {/if}
                <p class="status-success">✓ All EXIF metadata removed</p>
                <p class="status-success">✓ GPS location data cleared</p>
                <p class="status-success">✓ AI content credentials stripped</p>
                <p class="status-success">✓ C2PA provenance data removed</p>
                <p class="status-success">✓ Camera & device info cleared</p>
              </div>

              <a
                href={processedImage.url}
                download={processedImage.filename}
                class="btn btn-success btn-lg w-full"
              >
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
                Download Cleaned Image
              </a>
            </div>
          {/if}
        </div>
      </section>
    {/if}

    <section class="card">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">🔐 Privacy & Security</h2>
        <button
          class="btn btn-ghost text-sm"
          on:click={togglePrivacyInfo}
          type="button"
        >
          {showPrivacyInfo ? "Hide" : "Show"} Details
        </button>
      </div>

      <div class="mb-3">
        <p class="text-sm text-secondary">
          <span class="text-success font-semibold">✓</span> 100% client-side
          processing
          <span class="mx-2">•</span>
          <span class="text-success font-semibold">✓</span> No data collection
          <span class="mx-2">•</span>
          <span class="text-success font-semibold">✓</span> Open source
        </p>
      </div>

      {#if showPrivacyInfo}
        <PrivacyInfo />
      {/if}
    </section>
  </div>
</main>

<Footer />

<style>
  .w-full {
    width: 100%;
  }

  .status-warning {
    color: var(--warning-color, #f59e0b);
  }

  .image-preview {
    max-width: 100%;
    max-height: 200px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .progress-bar {
    width: 100%;
    height: 4px;
    background-color: var(--border-color);
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background-color: var(--primary-color);
    animation: pulse 1s ease-in-out infinite;
  }

  .slide-up {
    animation: slideUp 0.3s ease-out;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .btn-ghost {
    background: transparent;
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
  }

  .btn-ghost:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }

  .grid {
    display: grid;
    gap: 1.5rem;
  }

  .grid-2 {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 768px) {
    .grid-2 {
      grid-template-columns: 1fr;
    }

    .image-preview {
      max-height: 150px;
    }
  }

  .text-secondary {
    color: var(--text-secondary);
  }
</style>
