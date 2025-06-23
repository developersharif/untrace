<div class="grid grid-2 gap-6">
  <div>
    <h3 class="font-semibold mb-3 flex items-center gap-2">
      <span class="text-success">✓</span>
      Client-Side Processing
    </h3>
    <p class="text-sm text-secondary mb-4">
      Images never leave your browser. Processing happens locally.
    </p>

    <h3 class="font-semibold mb-3 flex items-center gap-2">
      <span class="text-success">✓</span>
      No Data Collection
    </h3>
    <p class="text-sm text-secondary mb-4">
      No analytics, tracking, or data collection.
    </p>

    <h3 class="font-semibold mb-3 flex items-center gap-2">
      <span class="text-success">✓</span>
      Open Source
    </h3>
    <p class="text-sm text-secondary">
      Fully auditable codebase. Verify what happens to your data.
    </p>
  </div>

  <div>
    <h3 class="font-semibold mb-3">Why Remove Metadata?</h3>
    <div class="space-y-3 text-sm text-secondary">
      <div class="privacy-risk">
        <strong>📍 Location:</strong> GPS coordinates reveal photo locations
      </div>
      <div class="privacy-risk">
        <strong>📷 Device Info:</strong> Camera models can link photos to devices
      </div>
      <div class="privacy-risk">
        <strong>🕒 Timestamps:</strong> Enable detailed activity timelines
      </div>
      <div class="privacy-risk">
        <strong>🤖 AI Detection:</strong> Software tags reveal AI generation tools
      </div>
      <div class="privacy-risk">
        <strong>🔗 C2PA Credentials:</strong> Content provenance tracks creation
        history
      </div>
      <div class="privacy-risk">
        <strong>🏷️ Software Tags:</strong> DALL-E, Midjourney, ChatGPT watermarks
      </div>
    </div>

    <div class="mt-4 p-3 bg-warning rounded">
      <p class="text-sm">
        <strong>⚠️</strong> Social media may strip some metadata, but it's safer
        to clean images yourself.
      </p>
    </div>
  </div>
</div>

<div class="mt-6 p-4 bg-info rounded">
  <h4 class="font-semibold mb-2">Perfect for:</h4>
  <div class="grid grid-2 gap-2 text-sm">
    <div>• Journalists protecting sources</div>
    <div>• Activists maintaining anonymity</div>
    <div>• AI artists removing generation tags</div>
    <div>• Content creators stripping watermarks</div>
    <div>• Social media users protecting privacy</div>
    <div>• Anyone valuing digital anonymity</div>
    <div>• Photographers selling stock images</div>
    <div>• Removing C2PA content credentials</div>
  </div>
</div>

<div class="mt-4 p-4 bg-secondary rounded">
  <h4 class="font-semibold mb-2">🤖 AI Content Credential Support:</h4>
  <div class="grid grid-3 gap-2 text-sm">
    <div>• OpenAI DALL-E</div>
    <div>• Midjourney</div>
    <div>• Stable Diffusion</div>
    <div>• Adobe Firefly</div>
    <div>• ChatGPT Images</div>
    <div>• Google Imagen</div>
    <div>• C2PA Signatures</div>
    <div>• Content Authenticity</div>
    <div>• JUMBF Containers</div>
  </div>
</div>

<style>
  .text-success {
    color: var(--success-color);
  }

  .space-y-3 > * + * {
    margin-top: 0.75rem;
  }

  .privacy-risk {
    padding: 0.75rem;
    background-color: var(--bg-tertiary);
    border-radius: 0.375rem;
    border-left: 3px solid var(--warning-color);
  }

  .bg-warning {
    background-color: rgba(245, 158, 11, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.2);
  }

  .bg-info {
    background-color: rgba(37, 99, 235, 0.05);
    border: 1px solid rgba(37, 99, 235, 0.1);
  }

  .bg-secondary {
    background-color: rgba(16, 185, 129, 0.05);
    border: 1px solid rgba(16, 185, 129, 0.1);
  }

  .rounded {
    border-radius: 0.5rem;
  }

  .grid {
    display: grid;
    gap: 1.5rem;
  }

  .grid-2 {
    grid-template-columns: 1fr 1fr;
  }

  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    .grid-2 {
      grid-template-columns: 1fr;
    }
    .grid-3 {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 480px) {
    .grid-3 {
      grid-template-columns: 1fr;
    }
  }
</style>
