<header class="text-center mb-6 header-container">
  <div class="flex items-center justify-center gap-4 mb-4 header-title">
    <div class="logo-container">
      <svg
        width="56"
        height="56"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="logo-svg"
      >
        <!-- Background circle with gradient -->
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1E40AF;stop-opacity:1" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="3"
              flood-color="rgba(0,0,0,0.1)"
            />
          </filter>
        </defs>

        <!-- Main circle background -->
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="url(#logoGradient)"
          filter="url(#shadow)"
        />

        <!-- Image/photo icon base -->
        <rect
          x="10"
          y="14"
          width="28"
          height="20"
          rx="3"
          fill="white"
          opacity="0.9"
        />
        <rect
          x="12"
          y="16"
          width="24"
          height="16"
          rx="2"
          fill="none"
          stroke="#1E40AF"
          stroke-width="1.5"
        />

        <!-- Mountain/landscape in photo -->
        <path
          d="M12 28 L18 22 L22 25 L28 20 L36 26 V30 H12 Z"
          fill="#E5E7EB"
          opacity="0.6"
        />

        <!-- Sun/circle in photo -->
        <circle cx="30" cy="20" r="2.5" fill="#FCD34D" opacity="0.7" />

        <!-- Strike-through line (indicating removal) -->
        <line
          x1="8"
          y1="8"
          x2="40"
          y2="40"
          stroke="#EF4444"
          stroke-width="3"
          stroke-linecap="round"
          opacity="0.8"
        />
        <line
          x1="8"
          y1="8"
          x2="40"
          y2="40"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
        />

        <!-- Shield icon overlay (protection) -->
        <path
          d="M38 10 L42 10 C43.1 10 44 10.9 44 12 L44 16 C44 19.3 42.3 22.4 39.5 24.2 L38 25 L36.5 24.2 C33.7 22.4 32 19.3 32 16 L32 12 C32 10.9 32.9 10 34 10 L38 10 Z"
          fill="#10B981"
          stroke="white"
          stroke-width="1"
        />

        <!-- Checkmark in shield -->
        <path
          d="M36 15 L37.5 16.5 L40 14"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <div class="brand-text">
      <h1 class="brand-name">
        <span class="brand-primary">Untrace</span><span class="brand-secondary"
          >trace</span
        >
      </h1>
      <p class="brand-tagline">
        Remove EXIF metadata & AI credentials. Protect privacy.
      </p>
      <div class="brand-badge">
        <span class="badge-text">Professional Privacy Tool</span>
      </div>
    </div>
  </div>

  <p class="text-sm text-secondary max-w-2xl mx-auto header-description">
    <strong>Free online EXIF metadata remover</strong> that strips GPS location
    data, camera information, AI content credentials, and C2PA provenance from
    images. <strong>100% browser-based processing</strong>
    - no uploads, no tracking, no data collection.
  </p>

  <div class="mt-4 text-xs text-muted feature-tags">
    <span class="feature-tag">
      <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
          clip-rule="evenodd"
        />
      </svg>
      EXIF Removal
    </span>
    <span class="feature-tag">
      <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
        <path
          d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"
        />
      </svg>
      AI Tag Stripper
    </span>
    <span class="feature-tag">
      <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
          clip-rule="evenodd"
        />
      </svg>
      GPS Cleaner
    </span>
    <span class="feature-tag">
      <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
          clip-rule="evenodd"
        />
      </svg>
      C2PA Remover
    </span>
    <span class="feature-tag">
      <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
          clip-rule="evenodd"
        />
      </svg>
      Instant Processing
    </span>
  </div>
</header>

<style>
  .header-container {
    padding-top: 1rem;
  }

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Professional Logo and Branding Styles */
  .logo-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo-svg {
    transition: transform 0.2s ease-in-out;
  }

  .logo-svg:hover {
    transform: scale(1.05);
  }

  .brand-text {
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .brand-name {
    font-size: 2.5rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1;
    margin: 0;
    background: linear-gradient(135deg, #3b82f6 0%, #1e40af 50%, #1e3a8a 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  .brand-primary {
    font-weight: 900;
  }

  .brand-secondary {
    font-weight: 700;
    opacity: 0.9;
  }

  .brand-tagline {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin: 0;
    font-weight: 500;
    line-height: 1.3;
  }

  .brand-badge {
    margin-top: 0.25rem;
  }

  .badge-text {
    display: inline-block;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    padding: 0.125rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.625rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    box-shadow: 0 1px 3px rgba(16, 185, 129, 0.3);
  }

  .max-w-2xl {
    max-width: 42rem;
  }

  .mx-auto {
    margin-left: auto;
    margin-right: auto;
  }

  .feature-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    background-color: var(--bg-secondary);
    color: var(--text-secondary);
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    margin: 0.125rem;
    font-size: 0.75rem;
    border: 1px solid var(--border-color);
  }

  .feature-tag svg {
    flex-shrink: 0;
  }

  .text-muted {
    color: var(--text-muted, #6b7280);
  }

  /* Mobile optimizations */
  @media (max-width: 768px) {
    .header-container {
      padding-top: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .header-title {
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 1rem;
    }

    .brand-text {
      text-align: center;
      gap: 0.5rem;
    }

    .brand-name {
      font-size: 2rem;
    }

    .brand-tagline {
      font-size: 0.75rem;
    }

    .badge-text {
      font-size: 0.5rem;
      padding: 0.1rem 0.4rem;
    }

    .header-description {
      font-size: 0.75rem;
      padding: 0 1rem;
      line-height: 1.4;
    }

    .feature-tags {
      margin-top: 1rem;
      padding: 0 0.5rem;
    }

    .feature-tag {
      font-size: 0.625rem;
      padding: 0.125rem 0.375rem;
      margin: 0.0625rem;
    }
  }

  @media (max-width: 480px) {
    .header-container {
      padding-top: 2rem;
    }

    .header-title {
      gap: 1rem;
    }

    .brand-name {
      font-size: 1.75rem;
    }

    .brand-tagline {
      font-size: 0.6875rem;
    }

    .logo-svg {
      width: 48px;
      height: 48px;
    }

    .header-description {
      font-size: 0.6875rem;
      padding: 0 0.75rem;
    }

    .feature-tags {
      padding: 0 0.25rem;
    }
  }
</style>
