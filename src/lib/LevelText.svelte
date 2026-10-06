<script lang="ts">
  // A skill level definition: "You can:" followed by bullets.
  import { splitBullets } from '#lib/types.js';

  let { text }: { text: string } = $props();
  const parts = $derived(splitBullets(text));
</script>

{#if parts.lead}<p class="level-text-lead">{parts.lead}</p>{/if}
{#if parts.items.length}
  <ul class="level-text-items">
    {#each parts.items as item, i (i)}<li>{item}</li>{/each}
  </ul>
{/if}
