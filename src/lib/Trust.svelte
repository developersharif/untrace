<script>
  import Icon from "./Icon.svelte";

  const checks = [
    {
      icon: "eye",
      title: "Watch the network tab",
      detail:
        "Open your browser's developer tools, choose Network, then clean an image. No request carries your file anywhere, because there is no server to send it to.",
    },
    {
      icon: "code",
      title: "Read the source",
      detail:
        "Untrace is MIT licensed. The whole cleaner is one short file you can read in a few minutes.",
    },
    {
      icon: "scan",
      title: "Scan the result again",
      detail:
        "Drop the cleaned copy back in. It reports nothing found, and the tool re-reads every output before it offers the download.",
    },
  ];

  const limits = [
    "Pixels are not changed, so visual AI detectors and invisible watermarks such as SynthID can still recognise an image.",
    "Platforms that already stored a copy of your credentials keep it. Clean the file before you upload.",
    "Non-JPEG images are re-encoded to JPEG, so the file size and format can change.",
    "Use it to protect your privacy. Do not use it to pass AI-generated work off as a photograph where disclosure is expected or required.",
  ];
</script>

<section class="section" id="trust" aria-labelledby="trust-heading">
  <div class="section-head">
    <p class="eyebrow">Trust</p>
    <h2 id="trust-heading">Verify it yourself, and know the limits</h2>
    <p>
      A privacy tool should not ask for faith. Here is how to check each claim,
      and what Untrace cannot do.
    </p>
  </div>

  <div class="tiles">
    {#each checks as item}
      <article class="tile">
        <span class="ico"><Icon name={item.icon} /></span>
        <h3>{item.title}</h3>
        <p>{item.detail}</p>
      </article>
    {/each}
  </div>

  <div class="card limits">
    <h3>What Untrace does not do</h3>
    <ul>
      {#each limits as line}
        <li>{line}</li>
      {/each}
    </ul>
  </div>
</section>

<style>
  .section {
    scroll-margin-top: calc(var(--topbar-h) + var(--space-4));
  }

  .ico {
    display: inline-flex;
    color: var(--accent);
    margin-bottom: var(--space-2);
  }

  .limits {
    margin-top: var(--space-4);
    padding: var(--space-5);
    display: grid;
    gap: var(--space-3);
  }

  .limits h3 {
    font-size: var(--fs-4);
    line-height: var(--lh-4);
    font-weight: 600;
  }

  .limits ul {
    display: grid;
    gap: var(--space-2);
    padding-left: var(--space-4);
    color: var(--text-2);
  }
</style>
