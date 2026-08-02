<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const dialSize = 230
const center = dialSize / 2
const radius = 76.25

const cardinalPoints = [
  { label: 'Up', value: 270 },
  { label: 'Right', value: 0 },
  { label: 'Down', value: 90 },
  { label: 'Left', value: 180 },
]

const props = defineProps<{
  angle?: number | null
  disabled?: boolean
}>()

const angle = ref<number | null>(props.angle ?? 0)

const emit = defineEmits<{
  input: [value: number | null]
}>()

watch(
  () => props.angle,
  (value) => {
    if (value === undefined || value === angle.value) return
    angle.value = value
  },
)

const displayAngle = computed({
  get: () => angle.value ?? '',
  set: (value) => setAngle(Number(value)),
})

function pointOnCircle(deg: number) {
  const rad = (deg * Math.PI) / 180
  return {
    x: center + radius * Math.cos(rad),
    y: center + radius * Math.sin(rad),
  }
}

function pointStyle(deg: number) {
  const point = pointOnCircle(deg)
  return { left: `${point.x}px`, top: `${point.y}px` }
}

function normalizeAngle(value: number) {
  if (Number.isNaN(value)) return 0
  const wrapped = value % 360
  return wrapped < 0 ? wrapped + 360 : wrapped
}

function setAngle(value: number) {
  if (props.disabled) return
  angle.value = normalizeAngle(value)
  emit('input', angle.value)
}

function setFront() {
  if (props.disabled) return
  angle.value = null
  emit('input', null)
}

let dragging = false

function onDialPointerDown(event: PointerEvent) {
  if (props.disabled) return
  const target = event.target as HTMLElement
  if (target.closest('button, input')) return
  dragging = true
    ; (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  updateFromPointer(event)
}

function onDialPointerMove(event: PointerEvent) {
  if (!dragging) return
  updateFromPointer(event)
}

function onDialPointerUp(event: PointerEvent) {
  if (!dragging) return
  dragging = false
    ; (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId)
}

function updateFromPointer(event: PointerEvent) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const dx = event.clientX - (rect.left + rect.width / 2)
  const dy = event.clientY - (rect.top + rect.height / 2)
  let deg = (Math.atan2(dy, dx) * 180) / Math.PI
  if (deg < 0) deg += 360
  setAngle(Math.round(deg))
}
</script>

<template>
  <div class="dial" :class="{ disabled }" @pointerdown="onDialPointerDown" @pointermove="onDialPointerMove"
    @pointerup="onDialPointerUp" @pointercancel="onDialPointerUp">
    <div class="dial-track"></div>
    <div v-if="angle !== null" class="dial-knob" :style="pointStyle(angle)"></div>
    <button v-for="point in cardinalPoints" :key="point.label" type="button" class="cardinal-btn btn btn-sm"
      :class="angle === point.value ? 'btn-primary' : 'btn-outline-secondary'" :style="pointStyle(point.value)"
      :disabled="disabled" @click="setAngle(point.value)">
      {{ point.label }}
    </button>
    <div class="dial-center">
      <input type="number" min="0" max="359" placeholder="Front" class="form-control form-control-sm text-center"
        v-model="displayAngle" :disabled="disabled" />
      <button type="button" class="btn btn-sm" :class="angle === null ? 'btn-primary' : 'btn-outline-secondary'"
        :disabled="disabled" @click="setFront">
        Front
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dial {
  position: relative;
  width: 230px;
  height: 230px;
  margin: 0 auto;
  touch-action: none;

  &.disabled {
    opacity: 0.65;
  }
}

.dial-track {
  position: absolute;
  inset: 35px;
  border: 0.5rem solid var(--bs-secondary-bg);
  border-radius: 50%;
  pointer-events: none;
}

.dial-knob {
  position: absolute;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: var(--bs-primary);
  box-shadow: 0 0.1rem 0.25rem rgba(0, 0, 0, 0.1);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.cardinal-btn {
  position: absolute;
  transform: translate(-50%, -50%);
  white-space: nowrap;
}

.dial-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  width: 5.5rem;
}
</style>
