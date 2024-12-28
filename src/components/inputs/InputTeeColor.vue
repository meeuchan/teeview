<script setup lang="ts">
import { RgbColor, TeeColor } from '@/lib/Color'
import { onMounted, ref, useTemplateRef, watch } from 'vue'

const h = ref(127)
const s = ref(127)
const l = ref(127)
const colorPreview = useTemplateRef('colorPreview')

const emit = defineEmits<{
  input: [value: TeeColor]
}>()

watch(h, (value) => {
  h.value = clampColorValue(value)
  updateColor()
})

watch(s, (value) => {
  s.value = clampColorValue(value)
  updateColor()
})

watch(l, (value) => {
  l.value = clampColorValue(value)
  updateColor()
})

function updateColor() {
  const teeColor = new TeeColor(h.value, s.value, l.value)
  const rgbColor = RgbColor.fromTeeColor(teeColor)

  if (colorPreview.value) {
    colorPreview.value.style.backgroundColor = rgbColor.toString()
  }

  emit('input', teeColor)
}

function clampColorValue(value: number) {
  if (value < 0) value = 0
  if (value > 255) value = 255
  return value
}

onMounted(updateColor)
</script>

<template>
  <div class="row">
    <div class="col">
      <div id="colorPreview" ref="colorPreview"></div>
    </div>

    <div class="col-8">
      <div class="row mb-2">
        <div class="input-group">
          <span class="input-group-text">Hue:</span>
          <input type="number" min="0" max="255" v-model="h" class="form-control" />
        </div>
      </div>

      <div class="row mb-2">
        <div class="input-group">
          <span class="input-group-text">Sat:</span>
          <input type="number" min="0" max="255" v-model="s" class="form-control" />
        </div>
      </div>

      <div class="row mb-2">
        <div class="input-group">
          <span class="input-group-text">Lht:</span>
          <input type="number" min="0" max="255" v-model="l" class="form-control" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#colorPreview {
  width: 100%;
  aspect-ratio: 1;
  border: 1px solid var(--bs-border-color-translucent);
  border-radius: var(--bs-border-radius);
}

.input-group-text {
  width: 3.75rem;
}
</style>
