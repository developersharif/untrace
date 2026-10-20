<script>
  import Icon from "./Icon.svelte";

  let paused = false;

  const tags = [
    { label: "GPS 40.7128 N", icon: "pin", cls: "t1", dx: -1, dy: -1 },
    { label: "iPhone 15 Pro", icon: "camera", cls: "t2", dx: 1, dy: -1 },
    { label: "C2PA credentials", icon: "shield", cls: "t3", dx: 1, dy: 0.5 },
    { label: "Taken 14:32", icon: "clock", cls: "t4", dx: -1, dy: 1 },
    { label: "AI tool tag", icon: "sparkle", cls: "t5", dx: 1, dy: 1 },
  ];
</script>

<figure class="demo" class:paused>
  <div
    class="stage"
    role="img"
    aria-label="Animation: a photo with hidden tags for location, camera, time and content credentials is scanned, the tags lift away, and the photo ends up clean."
  >
    <div class="photo" aria-hidden="true">
      <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">
        <rect class="sky" width="320" height="200" />
        <circle class="sun" cx="236" cy="62" r="26" />
        <path class="hill far" d="M0 150 90 96l70 54 60-38 100 70v18H0Z" />
        <path class="hill near" d="M0 176 110 128l90 48 120-34v58H0Z" />
      </svg>
      <span class="scan"></span>
      <span class="clean-badge"><Icon name="check" size="sm" /> Clean</span>
    </div>

    {#each tags as tag}
      <span class="tag {tag.cls}" style="--dx:{tag.dx}; --dy:{tag.dy}" aria-hidden="true">
        <Icon name={tag.icon} size="sm" />
        {tag.label}
      </span>
    {/each}
  </div>

  <figcaption>
    <ol class="beats" aria-hidden="true">
      <li class="b1"><span>1</span> Scan the file</li>
      <li class="b2"><span>2</span> Tags lift off</li>
      <li class="b3"><span>3</span> Clean copy</li>
    </ol>
    <button
      type="button"
      class="btn btn-ghost pause"
      aria-pressed={paused}
      on:click={() => (paused = !paused)}
    >
      <Icon name={paused ? "play" : "pause"} size="sm" />
      {paused ? "Play animation" : "Pause animation"}
    </button>
  </figcaption>
</figure>

<style>
  .demo {
    display: grid;
    gap: var(--space-3);
    width: 100%;
    max-width: calc(var(--space-9) * 6);
  }

  .stage {
    position: relative;
    padding: var(--space-6) var(--space-4);
    overflow: hidden;
    border: var(--border-w) solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--surface);
  }

  .photo {
    position: relative;
    overflow: hidden;
    aspect-ratio: 8 / 5;
    border: var(--border-w) solid var(--border-strong);
    border-radius: var(--radius-md);
    background: var(--elevated);
  }

  .photo svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  .sky { fill: var(--elevated); }
  .sun { fill: var(--accent); }
  .hill.far { fill: var(--border-strong); }
  .hill.near { fill: var(--border); }

  /* ---- Scan line ---- */
  .scan {
    position: absolute;
    inset-inline: 0;
    top: 0;
    height: var(--space-1);
    background: var(--accent);
    opacity: 0;
    animation: scan 8s var(--ease) infinite;
  }

  /* ---- Clean badge ---- */
  .clean-badge {
    position: absolute;
    right: var(--space-3);
    bottom: var(--space-3);
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-full);
    background: var(--success);
    color: var(--bg);
    font-size: var(--fs-1);
    line-height: var(--lh-1);
    font-weight: 600;
    opacity: 0;
    animation: badge 8s var(--ease) infinite;
  }

  /* ---- Metadata tags ---- */
  .tag {
    position: absolute;
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-1) var(--space-2);
    border: var(--border-w) solid var(--border-strong);
    border-radius: var(--radius-full);
    background: var(--bg);
    color: var(--text-1);
    font-family: var(--font-mono);
    font-size: var(--fs-1);
    line-height: var(--lh-1);
    white-space: nowrap;
    animation: lift 8s var(--ease) infinite;
  }

  .t1 { top: var(--space-3); left: var(--space-2); }
  .t2 { top: var(--space-3); right: var(--space-2); }
  .t3 { top: 46%; right: var(--space-2); }
  .t4 { bottom: var(--space-3); left: var(--space-2); }
  .t5 { bottom: var(--space-3); right: var(--space-2); }

  @keyframes lift {
    0%, 20% { opacity: 1; transform: none; border-color: var(--border-strong); }
    28%, 36% { opacity: 1; transform: none; border-color: var(--accent); }
    56% {
      opacity: 0;
      transform: translate(calc(var(--dx) * var(--space-8)), calc(var(--dy) * var(--space-7)));
      border-color: var(--accent);
    }
    92% { opacity: 0; transform: translate(calc(var(--dx) * var(--space-8)), calc(var(--dy) * var(--space-7))); }
    100% { opacity: 1; transform: none; border-color: var(--border-strong); }
  }

  @keyframes scan {
    0%, 18% { top: 0; opacity: 0; }
    22% { top: 0; opacity: 1; }
    38% { top: calc(100% - var(--space-1)); opacity: 1; }
    42%, 100% { top: calc(100% - var(--space-1)); opacity: 0; }
  }

  @keyframes badge {
    0%, 54% { opacity: 0; transform: translateY(var(--space-2)); }
    62%, 90% { opacity: 1; transform: none; }
    97%, 100% { opacity: 0; transform: none; }
  }

  /* ---- Captions ---- */
  figcaption {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
  }

  .beats {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-4);
    list-style: none;
    font-size: var(--fs-2);
    line-height: var(--lh-2);
    color: var(--text-3);
  }

  .beats li {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    animation: beat 8s var(--ease) infinite;
  }

  .beats span {
    display: inline-grid;
    place-items: center;
    width: var(--space-5);
    height: var(--space-5);
    border: var(--border-w) solid currentColor;
    border-radius: var(--radius-full);
    font-family: var(--font-mono);
    font-size: var(--fs-1);
  }

  .b2 { animation-name: beat-2; }
  .b3 { animation-name: beat-3; }

  @keyframes beat {
    0%, 36% { color: var(--text-1); }
    40%, 100% { color: var(--text-3); }
  }
  @keyframes beat-2 {
    0%, 36% { color: var(--text-3); }
    40%, 56% { color: var(--text-1); }
    60%, 100% { color: var(--text-3); }
  }
  @keyframes beat-3 {
    0%, 56% { color: var(--text-3); }
    60%, 92% { color: var(--text-1); }
    96%, 100% { color: var(--text-3); }
  }

  .pause {
    height: var(--space-7);
    padding-inline: var(--space-3);
  }

  /* ---- Pause ---- */
  .paused .tag,
  .paused .scan,
  .paused .clean-badge,
  .paused .beats li {
    animation-play-state: paused;
  }

  /* ---- Reduced motion: show the finished state, still ---- */
  @media (prefers-reduced-motion: reduce) {
    .tag,
    .scan,
    .clean-badge,
    .beats li {
      animation: none;
    }

    .tag { opacity: 0.45; text-decoration: line-through; }
    .scan { display: none; }
    .clean-badge { opacity: 1; }
    .beats li { color: var(--text-2); }
    .pause { display: none; }
  }
</style>
