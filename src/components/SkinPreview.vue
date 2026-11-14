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
  border-radius: 8px;
  overflow: hidden;
}

.preview-image {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 2;
  padding: 8px;

  img {
    max-width: 100%;
    max-height: 100%;
  }
}

figcaption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  border-top: var(--border);
  background: var(--color-surface);
  font-size: 0.8rem;
}

.caption-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text);
  font-weight: 700;
}

.caption-size {
  padding: 2px 4px;
  border-radius: 4px;
  background: var(--color-pill);
  color: var(--color-subtle);
  font-size: 0.625rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
</style>
