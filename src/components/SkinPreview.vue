<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  image?: HTMLImageElement
  label: string
}>()

const name = computed(() => {
  const raw = props.image?.getAttribute('name')
  if (!raw) return 'default'
  return (
    raw
      .split('/')
      .pop()
      ?.replace(/\.(png|svg)$/i, '') || raw
  )
})
</script>

<template>
  <figure class="preview">
    <div class="preview-image checker">
      <img v-if="props.image?.src" :src="props.image.src" :alt="props.label" />
    </div>
    <figcaption>
      <span class="caption-name">{{ name }}</span>
      <span v-if="props.image" class="caption-size"
        >{{ props.image.naturalWidth }}×{{ props.image.naturalHeight }}</span
      >
    </figcaption>
  </figure>
</template>

<style scoped lang="scss">
.preview {
  margin: 0;
  border: var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.preview-image {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 2;
  padding: var(--space-2);

  img {
    max-width: 100%;
    max-height: 100%;
  }
}

figcaption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-top: var(--border);
  background: var(--color-surface);
  font-size: var(--font-size-sm);
}

.caption-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text);
  font-weight: var(--font-weight-bold);
}

.caption-size {
  padding: 2px var(--space-1);
  border-radius: var(--radius-sm);
  background: var(--color-pill);
  color: var(--color-subtle);
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-bold);
  font-variant-numeric: tabular-nums;
}
</style>
