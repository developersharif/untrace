<script>
  import Icon from "./Icon.svelte";

  const year = new Date().getFullYear();
</script>

<footer class="site-footer">
  <div class="wrap">
    <div class="cols">
      <div>
        <p class="wordmark">
          <span class="r-mark" aria-hidden="true">U</span>
          <span>Untrace</span>
        </p>
        <p class="blurb">
          A privacy tool that removes content credentials, AI generation tags
          and EXIF metadata from images. Built and run entirely in the browser.
        </p>
      </div>

      <nav aria-label="Sections">
        <h2>On this page</h2>
        <ul>
          <li><a href="#tool">Clean an image</a></li>
          <li><a href="#what-is-removed">What is removed</a></li>
          <li><a href="#how-it-works">How it works</a></li>
          <li><a href="#faq">Questions</a></li>
        </ul>
      </nav>

      <nav aria-label="Project">
        <h2>Project</h2>
        <ul>
          <li>
            <a
              href="https://github.com/developersharif/untrace"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="github" size="sm" />
              Source on GitHub
            </a>
          </li>
          <li>
            <a
              href="https://www.buymeacoffee.com/developersharif"
              target="_blank"
              rel="noopener noreferrer"
            >
              Buy me a coffee
            </a>
          </li>
        </ul>
      </nav>

      <nav aria-label="More from RealBrain">
        <h2>More from RealBrain</h2>
        <ul>
          <li>
            <a href="https://artimic.com/" target="_blank" rel="noopener noreferrer">
              Artimic
            </a>
            <span class="note">AI design editor</span>
          </li>
          <li>
            <a href="https://realbrain.cc/" target="_blank" rel="noopener noreferrer">
              RealBrain
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <hr class="divider" />

    <div class="base">
      <p>© {year} Untrace. MIT licensed.</p>
      <p class="claims">
        <span class="status ok">No uploads</span>
        <span class="status ok">No accounts</span>
        <span class="status ok">No analytics</span>
      </p>
    </div>
  </div>
</footer>

<style>
  .cols {
    display: grid;
    gap: var(--space-6);
    margin-bottom: var(--space-6);
  }

  @media (min-width: 560px) {
    .cols {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 900px) {
    .cols {
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: var(--space-6);
    }
  }

  .blurb {
    margin-top: var(--space-3);
    max-width: calc(var(--space-9) * 4);
    color: var(--text-3);
  }

  h2 {
    font-size: var(--fs-1);
    line-height: var(--lh-1);
    font-weight: 600;
    color: var(--text-2);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: var(--space-3);
  }

  ul {
    display: grid;
    gap: var(--space-2);
    list-style: none;
  }

  ul a {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--text-2);
  }

  ul a:hover {
    color: var(--accent);
    text-decoration: none;
  }

  /* Sits under a product link that needs a word of context. */
  .note {
    display: block;
    margin-top: var(--space-1);
    color: var(--text-3);
    font-size: var(--fs-1);
    line-height: var(--lh-1);
  }

  .base {
    display: grid;
    gap: var(--space-3);
    margin-top: var(--space-5);
  }

  @media (min-width: 560px) {
    .base {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .claims {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-4);
  }
</style>
