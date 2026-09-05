<script>
  import { faqs } from "./faq-data.js";
  import Icon from "./Icon.svelte";
</script>

<section class="section" id="faq" aria-labelledby="faq-heading">
  <div class="section-head">
    <p class="eyebrow">Questions</p>
    <h2 id="faq-heading">Content credentials, answered</h2>
  </div>

  <div class="list">
    {#each faqs as item, index}
      <details class="disclosure" open={index === 0}>
        <summary>
          <span>{item.q}</span>
          <span class="caret"><Icon name="chevron" size="sm" /></span>
        </summary>
        <div class="body"><p>{item.a}</p></div>
      </details>
    {/each}
  </div>
</section>

<style>
  .section {
    scroll-margin-top: calc(var(--topbar-h) + var(--space-4));
  }

  .list {
    max-width: calc(var(--space-9) * 8);
  }
</style>
