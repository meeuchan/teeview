<script setup lang="ts">
import { RgbColor, TeeColor } from '@/lib/Color'
import { computed, onMounted, ref, watch } from 'vue'

const defaultCode = 0x7f7f7f
const maxCode = 0xffffff
const defaultColor = 127
const maxColor = 255
const gradientSteps = 12

const props = defineProps<{
  code?: number
  disabled?: boolean
  label: string
}>()

const code = ref(props.code ?? defaultCode)
const h = ref(defaultColor)
const s = ref(defaultColor)
const l = ref(defaultColor)

const emit = defineEmits<{
  input: [value: TeeColor]
}>()

const previewColor = computed(() =>
  RgbColor.fromTeeColor(TeeColor.fromValues(h.value, s.value, l.value)).toString(),
)

const channels = computed(() => [
  { key: 'h', label: 'Hue', model: h, gradient: gradient((v) => [v, s.value, l.value]) },
  { key: 's', label: 'Sat', model: s, gradient: gradient((v) => [h.value, v, l.value]) },
  { key: 'l', label: 'Light', model: l, gradient: gradient((v) => [h.value, s.value, v]) },
])

function gradient(toValues: (v: number) => [number, number, number]) {
  const stops = Array.from({ length: gradientSteps + 1 }, (_, i) => {
    const [hv, sv, lv] = toValues(Math.round((i / gradientSteps) * maxColor))
    return RgbColor.fromTeeColor(TeeColor.fromValues(hv, sv, lv)).toString()
  })
  return `linear-gradient(to right, ${stops.join(', ')})`
}

watch(
  () => props.code,
  (value) => {
    if (value === undefined || value === code.value) return
    code.value = value
  },
)

watch(code, (value) => {
  code.value = clampValue(value, maxCode)
  updateColorFromCode()
})

watch([h, s, l], () => {
  h.value = clampValue(h.value, maxColor)
  s.value = clampValue(s.value, maxColor)
  l.value = clampValue(l.value, maxColor)
  updateColorFromValues()
})

function updateColorFromCode() {
  const teeColor = TeeColor.fromCode(code.value)
  h.value = teeColor.h
  s.value = teeColor.s
  l.value = teeColor.l
  emit('input', teeColor)
}

function updateColorFromValues() {
  const teeColor = TeeColor.fromValues(h.value, s.value, l.value)
  code.value = teeColor.code
  emit('input', teeColor)
}

function clampValue(value: number, max: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0
  return Math.min(Math.max(Math.round(value), 0), max)
}

onMounted(updateColorFromCode)
</script>

<template>
  <fieldset class="color" :disabled="props.disabled" :aria-label="`${props.label} color`">
    <div class="color-header">
      <span class="swatch" :style="{ backgroundColor: previewColor }"></span>
      <span class="color-label">{{ props.label }}</span>
      <label class="code">
        <span class="code-label">Code</span>
        <input
          v-model.number="code"
          type="number"
          min="0"
          :max="maxCode"
          class="input code-input"
          :aria-label="`${props.label} color code`"
        />
      </label>
    </div>

    <div v-for="channel in channels" :key="channel.key" class="channel">
      <span class="channel-label">{{ channel.label }}</span>
      <input
        v-model.number="channel.model.value"
        type="range"
        min="0"
        :max="maxColor"
        class="slider"
        :style="{ '--track': channel.gradient }"
        :aria-label="`${props.label} ${channel.label}`"
      />
      <input
        v-model.number="channel.model.value"
        type="number"
        min="0"
        :max="maxColor"
        class="input channel-input"
        :aria-label="`${props.label} ${channel.label} value`"
      />
    </div>
  </fieldset>
</template>

<style scoped lang="scss">
.color {
  margin: 0;
  padding: 16px;
  border: none;
  border-radius: 16px;
  background: var(--color-surface);
  transition: opacity 0.2s;

  &:disabled {
    opacity: 0.5;
  }
}

.color-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.swatch {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 10px;
  transition: background-color 0.1s;
}

.color-label {
  font-weight: 800;
  font-size: 1rem;
}

.code {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.code-label,
.channel-label {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-subtle);
}

.code-input {
  width: 96px;
  min-height: 32px;
  padding: 4px 8px;
  font-variant-numeric: tabular-nums;
}

.channel {
  display: grid;
  grid-template-columns: 48px 1fr 48px;
  align-items: center;
  gap: 8px;

  & + & {
    margin-top: 8px;
  }
}

.channel-input {
  min-height: 32px;
  padding: 4px 8px;
  font-variant-numeric: tabular-nums;
}

.slider {
  width: 100%;
  height: 16px;
  margin: 0;
  border-radius: 999px;
  background: var(--track);
  appearance: none;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }

  &::-webkit-slider-thumb {
    width: 20px;
    height: 20px;
    border: 2px solid var(--color-text);
    border-radius: 50%;
    background: transparent;
    appearance: none;
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border: 2px solid var(--color-text);
    border-radius: 50%;
    background: transparent;
  }
}
</style>
