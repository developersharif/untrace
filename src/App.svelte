<script>
  import { onMount } from "svelte";
  import { theme } from "./lib/theme.js";
  import TopBar from "./lib/TopBar.svelte";
  import Tool from "./lib/Tool.svelte";
  import Removals from "./lib/Removals.svelte";
  import HowItWorks from "./lib/HowItWorks.svelte";
  import Faq from "./lib/Faq.svelte";
  import Footer from "./lib/Footer.svelte";
  import Toast from "./lib/Toast.svelte";
  import HeroDemo from "./lib/HeroDemo.svelte";
  import Trust from "./lib/Trust.svelte";

  let toasts = [];
  let nextId = 0;

  const assurances = [
    {
      title: "Runs in your browser",
      detail: "No upload, no queue, no server that could keep a copy.",
    },
    {
      title: "Reads the whole file",
      detail: "EXIF, XMP, IPTC and the JUMBF boxes that hold C2PA data.",
    },
    {
      title: "Shows its work",
      detail: "Every finding is listed before anything is changed.",
    },
  ];

  function notify(event) {
    const id = nextId++;
    toasts = [...toasts, { id, ...event.detail }];
    setTimeout(() => dismiss(id), 5000);
  }

  function dismiss(id) {
    toasts = toasts.filter((toast) => toast.id !== id);
  }

  onMount(() => theme.init());
</script>

<TopBar />

<main>
  <div class="wrap">
    <div class="intro">
      <section class="lede">
        <p class="eyebrow">EXIF · GPS · C2PA</p>
        <h1>Remove hidden metadata and content credentials from a photo</h1>
        <p>
          Every photo can carry your location, your device and a signed record
          of how it was made. Untrace shows you what is hidden and removes it —
          free, and without the file ever leaving your device.
        </p>
        <div class="chip-row">
          <span class="chip">Free</span>
          <span class="chip">No upload</span>
          <span class="chip">No sign-in</span>
          <span class="chip">Open source</span>
        </div>
        <a class="btn btn-secondary" href="#tool">Clean a photo</a>
      </section>
      <HeroDemo />
    </div>

    <Tool on:notify={notify} />

    <ul class="assurances">
      {#each assurances as item}
        <li>
          <h2>{item.title}</h2>
          <p>{item.detail}</p>
        </li>
      {/each}
    </ul>

    <div class="stack sections">
      <Removals />
      <HowItWorks />
      <Trust />
      <Faq />
    </div>
  </div>
</main>

<Footer />

<Toast {toasts} {dismiss} />

<style>
  main {
    padding-bottom: var(--space-8);
  }

  .intro {
    display: grid;
    gap: var(--space-4);
    align-items: center;
  }

  @media (min-width: 900px) {
    .intro {
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
      gap: var(--space-7);
    }
  }

  .assurances {
    display: grid;
    gap: var(--space-3);
    margin-top: var(--space-5);
    list-style: none;
  }

  @media (min-width: 768px) {
    .assurances {
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-4);
    }
  }

  .assurances li {
    display: grid;
    gap: var(--space-1);
    padding-left: var(--space-4);
    border-left: var(--border-w) solid var(--border-strong);
  }

  .assurances h2 {
    font-size: var(--fs-2);
    line-height: var(--lh-2);
    font-weight: 600;
  }

  .assurances p {
    color: var(--text-3);
    font-size: var(--fs-1);
    line-height: var(--lh-2);
  }

  .sections {
    margin-top: var(--space-9);
  }
</style>
