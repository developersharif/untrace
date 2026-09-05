<script>
  const groups = [
    {
      title: "C2PA content credentials",
      detail:
        "Manifests, claims, assertions and signatures written by the Content Authenticity Initiative.",
    },
    {
      title: "AI generation tags",
      detail:
        "ChatGPT, DALL·E, Midjourney, Stable Diffusion, Adobe Firefly and Google Imagen markers.",
    },
    {
      title: "JUMBF containers",
      detail:
        "The APP11 and APP2 boxes that carry provenance data inside a JPEG.",
    },
    {
      title: "GPS location",
      detail:
        "Latitude, longitude, altitude, bearing and the timestamp attached to them.",
    },
    {
      title: "Camera and device",
      detail: "Make, model, lens, serial numbers, exposure and shooting settings.",
    },
    {
      title: "Timestamps",
      detail: "When the photo was taken, digitised and last modified.",
    },
    {
      title: "XMP and IPTC",
      detail: "Creator names, captions, keywords, copyright and editing history.",
    },
    {
      title: "Comments and thumbnails",
      detail:
        "User comments, maker notes and the embedded preview that can differ from the visible image.",
    },
    {
      title: "PNG text chunks",
      detail: "tEXt, iTXt and zTXt blocks, including generation prompts.",
    },
  ];
</script>

<section class="section" id="what-is-removed" aria-labelledby="removed-heading">
  <div class="section-head">
    <p class="eyebrow">Coverage</p>
    <h2 id="removed-heading">What Untrace removes</h2>
    <p>
      Re-encoding drops every container at once, rather than deleting known tags
      one by one and leaving the rest behind.
    </p>
  </div>

  <div class="tiles">
    {#each groups as group}
      <article class="tile">
        <h3>{group.title}</h3>
        <p>{group.detail}</p>
      </article>
    {/each}
  </div>
</section>

<style>
  .section {
    scroll-margin-top: calc(var(--topbar-h) + var(--space-4));
  }
</style>
