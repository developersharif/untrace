<script>
  /**
   * The Untrace mark: a photo frame that is open on one side, with the edge
   * dissolving into dashes — the image stays, the trace leaves. Colours come
   * from the `.r-mark` tile it sits in, so it follows the theme.
   */
  export let label = false;
</script>

<span class="r-mark" role={label ? "img" : undefined} aria-label={label ? "Untrace" : undefined} aria-hidden={label ? undefined : "true"}>
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
    <path d="M15 4.5H8A3.5 3.5 0 0 0 4.5 8v8A3.5 3.5 0 0 0 8 19.5h7" />
    <path d="M18.5 4.5v.01M18.5 9v.01M18.5 14v.01M18.5 19v.01" stroke-width="2.4" opacity="0.55" />
    <path d="M21 4.5v.01M21 9v.01" stroke-width="2" opacity="0.28" />
    <path d="M8 15.5 11 12l2 2.2 1.5-1.7" />
  </svg>
</span>
