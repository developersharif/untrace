<script>
  /**
   * Single stroke-icon set. Icons inherit currentColor and are decorative by
   * default — every one of them sits next to a text label.
   */
  export let name;
  export let size = "md";

  const paths = {
    upload:
      "M12 16V4m0 0L8 8m4-4 4 4M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2",
    shield: "M12 3l7 3v6c0 4-3 7-7 8-4-1-7-4-7-8V6l7-3Zm-2.5 8.5 2 2 3.5-3.5",
    download: "M12 4v11m0 0-4-4m4 4 4-4M5 19h14",
    sparkle:
      "M12 3v4m0 10v4M3 12h4m10 0h4M6.2 6.2l2.6 2.6m6.4 6.4 2.6 2.6m0-11.6-2.6 2.6m-6.4 6.4-2.6 2.6",
    pin: "M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
    camera:
      "M4 8h3l1.5-2h7L17 8h3v11H4V8Zm8 3.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z",
    clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3.5 2",
    file: "M6 3h8l4 4v14H6V3Zm8 0v4h4M9 12h6M9 16h6",
    chevron: "m6 9 6 6 6-6",
    sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-14v2m0 14v2M3 12h2m14 0h2M5.6 5.6l1.4 1.4m10 10 1.4 1.4m0-12.8-1.4 1.4m-10 10-1.4 1.4",
    moon: "M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z",
    github:
      "M9 19c-4 1.4-4-2.1-6-2.6m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.7 4.7 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.3s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 3.1 5.4 3.4 5.4 3.4a4.3 4.3 0 0 0-.1 3.3A4.7 4.7 0 0 0 4 9.9c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21",
    refresh: "M20 11a8 8 0 1 0-.9 4.5M20 5v6h-6",
    close: "m6 6 12 12M18 6 6 18",
    check: "m5 13 4 4L19 7",
    scan: "M4 8V6a2 2 0 0 1 2-2h2m8 0h2a2 2 0 0 1 2 2v2m0 8v2a2 2 0 0 1-2 2h-2m-8 0H6a2 2 0 0 1-2-2v-2m0-4h16",
    lock: "M7 11V8a5 5 0 0 1 10 0v3m-11 0h12v9H6v-9Z",
    image:
      "M4 5h16v14H4V5Zm0 10 4.5-4.5 4 4L15 12l5 5",
  };

  const boxes = { sm: "16", md: "20", lg: "24" };
  $: box = boxes[size] || boxes.md;
</script>

<svg
  width={box}
  height={box}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.6"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
  focusable="false"
>
  <path d={paths[name]} />
</svg>
