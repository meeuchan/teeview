<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { getImageFromFile, getRasterizedSvgImage } from '@/utils'
import UploadIcon from '../icons/UploadIcon.vue'

const input = useTemplateRef('fileInput')
const inputError = ref<string | null>()
const dragging = ref(false)

const emit = defineEmits<{
  input: [value: HTMLImageElement]
}>()

async function setSkin(file?: File) {
  clearError()

  if (!file) {
    setError('Please select a file.')
    return
  }
  if (!file.name.endsWith('.png') && !file.name.endsWith('.svg')) {
    setError('Must be a .png or .svg file.')
    return
  }

  const img = file.name.endsWith('.svg')
    ? await getRasterizedSvgImage(file)
    : await getImageFromFile(file)
  img.setAttribute('name', file.name)
  img.setAttribute('lastModified', file.lastModified.toString())

  if (img.width / img.height !== 2 || img.width < 256 || img.height < 128) {
    setError('The image must have a 2:1 size ratio and a minimum size of 256x128px.')
    return
  }
  emit('input', img)
}

function onDrop(event: DragEvent) {
  dragging.value = false
  setSkin(event.dataTransfer?.files[0])
}

function setError(error: string) {
  inputError.value = error
}

function clearError() {
  inputError.value = null
}
</script>

<template>
  <div class="field">
    <label
      class="dropzone"
      :class="{ 'is-dragging': dragging, 'is-invalid': !!inputError }"
      @dragenter.prevent="dragging = true"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <input
        ref="fileInput"
        type="file"
        accept=".png,.svg,image/png,image/svg+xml"
        class="screen-reader-only"
        :aria-invalid="!!inputError || undefined"
        @change="setSkin(input?.files?.[0])"
      />
      <span class="dropzone-icon"><UploadIcon /></span>
      <span class="dropzone-title"> <strong>Click to upload</strong> or drag a file here </span>
      <span class="dropzone-hint">PNG or SVG · 2:1 ratio · at least 256×128</span>
    </label>
    <p v-if="inputError" class="field-error" role="alert">{{ inputError }}</p>
  </div>
</template>

<style scoped lang="scss">
.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px;
  border: 2px dashed var(--color-border);
  border-radius: 16px;
  background: var(--color-pill);
  text-align: center;
  cursor: pointer;
  transition:
    border-color 0.15s,
    background-color 0.15s,
    transform 0.15s;

  &:hover {
    border-color: var(--color-primary);
  }

  &:focus-within {
    border-color: var(--color-primary);
  }

  &.is-dragging {
    border-color: var(--color-primary);
  }

  &.is-invalid {
    border-color: var(--color-danger);
  }
}

.dropzone-icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  margin-bottom: 0.25rem;
  border-radius: 50%;
  background: var(--color-pill);
  color: var(--color-primary);

  svg {
    width: 24px;
    height: 24px;
  }
}

.dropzone-title {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.9rem;

  strong {
    color: var(--color-primary);
  }
}

.dropzone-hint {
  font-size: 0.75rem;
  color: var(--color-subtle);
}
</style>
