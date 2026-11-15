<script setup lang="ts">
import Canvas from '@/lib/Canvas'
import { computed } from 'vue';
import { EMOJI_SIZE, type ExportMode } from '@/lib/Export.ts';
import ExportButton from './ExportButton.vue';

const props = defineProps<{
  result?: HTMLCanvasElement
}>()

const cropSize = computed(() => {
  if (!props.result) return undefined
  const cropped = Canvas.cropToContent(props.result)
  return `${cropped.width}×${cropped.height}`
})

const exports = computed<{ mode: ExportMode; title: string; size?: string; description: string }[]>(
  () => [
    {
      mode: 'full',
      title: 'Full size',
      size: props.result ? `${props.result.width}×${props.result.height}` : undefined,
      description: 'The raw render at the skin resolution.',
    },
    {
      mode: 'emoji',
      title: 'Emoji',
      size: `${EMOJI_SIZE}×${EMOJI_SIZE}`,
      description: 'Scaled down for Discord & chat emotes.',
    },
    {
      mode: 'crop',
      title: 'Smart crop',
      size: cropSize.value,
      description: 'Trims away the empty space around the tee.',
    },
    {
      mode: 'cropEmoji',
      title: 'Smart crop emoji',
      size: `${EMOJI_SIZE}×${EMOJI_SIZE}`,
      description: 'Cropped, then fit into an emoji square.',
    },
  ],
)
</script>

<template>
  <ul class="exports">
    <li v-for="item in exports" :key="item.mode" class="export">
      <div class="export-text">
        <div class="export-title">
          {{ item.title }}
          <span v-if="item.size" class="export-size">{{ item.size }}</span>
        </div>
        <p class="export-description">{{ item.description }}</p>
      </div>
      <div class="export-actions">
        <ExportButton :source="props.result" :mode="item.mode" action="copy" />
        <ExportButton :source="props.result" :mode="item.mode" action="download" primary />
      </div>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.exports {
  list-style: none;
  margin: 0;
  padding: 0;

  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.export {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  padding: var(--space-4);
  border-radius: var(--radius-xl);
  background: var(--color-surface);
}

.export-text {
  flex: 1 1 10rem;
  min-width: 0;
}

.export-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: var(--font-weight-extrabold);
}

.export-size {
  padding: 2px var(--space-1);
  border-radius: var(--radius-sm);
  background: var(--color-pill);
  color: var(--color-subtle);
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-bold);
  font-variant-numeric: tabular-nums;
}

.export-description {
  font-size: var(--font-size-xs);
  color: var(--color-subtle);
}

.export-actions {
  display: flex;
  gap: var(--space-2);
}
</style>
