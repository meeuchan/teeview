<script setup lang="ts">
import { RgbColor, TeeColor } from '@/lib/Color'
import { onMounted, ref, useTemplateRef, watch } from 'vue'

const defaultCode = 0x7F7F7F;
const maxCode = 0xFFFFFF
const defaultColor = 127
const maxColor = 255

const props = defineProps<{
  code?: number
}>()

const code = ref(props.code ?? defaultCode)
const h = ref(defaultColor)
const s = ref(defaultColor)
const l = ref(defaultColor)
const colorPreview = useTemplateRef('colorPreview')

const emit = defineEmits<{
  input: [value: TeeColor]
}>()

watch(
  () => props.code,
  (value) => {
    if (value === undefined || value === code.value) return
    code.value = value
  },
)

watch(code, (value) => {
  code.value = clampCodeValue(value)
  updateColorFromCode()
})

watch(h, (value) => {
  h.value = clampColorValue(value)
  updateColorFromValues()
})

watch(s, (value) => {
  s.value = clampColorValue(value)
  updateColorFromValues()
})

watch(l, (value) => {
  l.value = clampColorValue(value)
  updateColorFromValues()
})

function updateColorFromCode() {
  const teeColor = TeeColor.fromCode(code.value)
  h.value = teeColor.h
  s.value = teeColor.s
  l.value = teeColor.l
  const rgbColor = RgbColor.fromTeeColor(teeColor)

  if (colorPreview.value) {
    colorPreview.value.style.backgroundColor = rgbColor.toString()
  }

  emit('input', teeColor)
}

function updateColorFromValues() {
  const teeColor = TeeColor.fromValues(h.value, s.value, l.value)
  code.value = teeColor.code
  const rgbColor = RgbColor.fromTeeColor(teeColor)

  if (colorPreview.value) {
    colorPreview.value.style.backgroundColor = rgbColor.toString()
  }

  emit('input', teeColor)
}

function clampCodeValue(value: number) {
  if (value < 0) value = 0
  if (value > maxCode) value = maxCode
  return value
}

function clampColorValue(value: number) {
  if (value < 0) value = 0
  if (value > maxColor) value = maxColor
  return value
}

onMounted(updateColorFromValues)
</script>

<template>
  <div class="row">
    <div class="col">
      <div id="colorPreview" ref="colorPreview"></div>
    </div>

    <div class="col-8">
    <div class="row mb-2">
        <div class="input-group">
          <span class="input-group-text">Code:</span>
          <input type="number" min="0" :max="maxCode" v-model="code" class="form-control" />
        </div>
      </div>

      <div class="row mb-2">
        <div class="input-group">
          <span class="input-group-text">Hue:</span>
          <input type="number" min="0" :max="maxColor" v-model="h" class="form-control" />
        </div>
      </div>

      <div class="row mb-2">
        <div class="input-group">
          <span class="input-group-text">Sat:</span>
          <input type="number" min="0" :max="maxColor" v-model="s" class="form-control" />
        </div>
      </div>

      <div class="row mb-2">
        <div class="input-group">
          <span class="input-group-text">Lht:</span>
          <input type="number" min="0" :max="maxColor" v-model="l" class="form-control" />
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
