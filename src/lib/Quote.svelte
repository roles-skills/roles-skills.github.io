<script lang="ts">
  // A word-for-word quotation from a framework, with its credit line.
  // Framework text uses "- " lines for bullets; render them as lists, and
  // every other line as its own paragraph.
  import { textBlocks } from '#lib/types.js';

  let { text, credit }: { text: string; credit: string } = $props();

  const blocks = $derived(textBlocks(text));
</script>

<figure class="framework-quote">
  <blockquote>
    {#each blocks as block, i (i)}
      {#if block.kind === 'p'}
        <p>{block.text}</p>
      {:else}
        <ul>
          {#each block.items as item, j (j)}<li>{item}</li>{/each}
        </ul>
      {/if}
    {/each}
  </blockquote>
  <figcaption>{credit}</figcaption>
</figure>
