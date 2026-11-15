<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Button from '../ui/Button.vue'

const dialSize = 220
const center = dialSize / 2
const radius = 72
const trackRadius = center - 30
const labelGap = 8
const labelRadius = trackRadius + labelGap

const cardinalPoints = [
  { label: 'Up', value: 270, transform: 'translate(-50%, -100%)' },
  { label: 'Right', value: 0, transform: 'translate(0, -50%)' },
  { label: 'Down', value: 90, transform: 'translate(-50%, 0)' },
  { label: 'Left', value: 180, transform: 'translate(-100%, -50%)' },
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

function pointOnCircle(deg: number, r: number) {
  const rad = (deg * Math.PI) / 180
  return {
    x: center + r * Math.cos(rad),
    y: center + r * Math.sin(rad),
  }
}

// Percentages so the dial can be sized in rem and scale with the user's font size.
function pointStyle(deg: number, r = radius) {
  const point = pointOnCircle(deg, r)
  return { left: `${(point.x / dialSize) * 100}%`, top: `${(point.y / dialSize) * 100}%` }
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

function onKeydown(event: KeyboardEvent) {
  const step = event.shiftKey ? 15 : 5
  const delta = { ArrowRight: step, ArrowDown: step, ArrowLeft: -step, ArrowUp: -step }[event.key]
  if (!delta) return
  event.preventDefault()
  setAngle((angle.value ?? 0) + delta)
}

let dragging = false

function onDialPointerDown(event: PointerEvent) {
  if (props.disabled) return
  const target = event.target as HTMLElement
  if (target.closest('button, input')) return
  dragging = true
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  updateFromPointer(event)
}

function onDialPointerMove(event: PointerEvent) {
  if (!dragging) return
  updateFromPointer(event)
}

function onDialPointerUp(event: PointerEvent) {
  if (!dragging) return
  dragging = false
  ;(event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId)
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
  <div
    class="dial"
    :class="{ disabled }"
    role="slider"
    aria-label="Eye direction"
    aria-valuemin="0"
    aria-valuemax="359"
    :aria-valuenow="angle ?? undefined"
    :aria-valuetext="angle === null ? 'Front' : `${angle} degrees`"
    :aria-disabled="disabled || undefined"
    :tabindex="disabled ? -1 : 0"
    @keydown="onKeydown"
    @pointerdown="onDialPointerDown"
    @pointermove="onDialPointerMove"
    @pointerup="onDialPointerUp"
    @pointercancel="onDialPointerUp"
  >
    <div class="dial-track"></div>
    <div class="dial-hole"></div>
    <div
      v-if="angle !== null"
      class="dial-hand"
      :style="{ transform: `rotate(${angle}deg)` }"
    ></div>
    <div v-if="angle !== null" class="dial-knob" :style="pointStyle(angle)"></div>
    <div
      v-for="point in cardinalPoints"
      :key="point.label"
      class="cardinal"
      :style="{ ...pointStyle(point.value, labelRadius), transform: point.transform }"
    >
      <Button
        :variant="angle === point.value ? 'primary' : 'secondary'"
        :disabled="disabled"
        tabindex="-1"
        @click="setAngle(point.value)"
      >
        {{ point.label }}
      </Button>
    </div>
    <div class="dial-center">
      <div class="angle-input">
        <input
          v-model="displayAngle"
          type="number"
          min="0"
          max="359"
          placeholder="—"
          :disabled="disabled"
          aria-label="Angle in degrees"
        />
        <span v-if="angle !== null">°</span>
      </div>
      <Button
        :variant="angle === null ? 'primary' : 'secondary'"
        :disabled="disabled"
        @click="setFront"
      >
        Front
      </Button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use 'sass:math';

// Mirrors the constants in the script (in px at a 16px root), converted to rem so the
// dial grows with the text inside it.
@function px($value) {
  @return math.div($value, 16) * 1rem;
}

.dial {
  position: relative;
  width: px(220);
  height: px(220);
  margin: var(--space-4) auto;
  border-radius: 50%;
  touch-action: none;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  &.disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
}

.dial-track {
  position: absolute;
  inset: px(30);
  border-radius: 50%;
  border: var(--border);
  background: var(--color-pill);
  mask: radial-gradient(circle, transparent 0 px(64), #000 calc(#{px(64)} + 0.5px));
  pointer-events: none;
}

.dial-hole {
  position: absolute;
  top: 50%;
  left: 50%;
  box-sizing: border-box;
  width: px(128);
  height: px(128);
  border: var(--border);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.dial-hand {
  position: absolute;
  top: 50%;
  left: 50%;
  width: px(72);
  height: 2px;
  margin-top: -1px;
  background: linear-gradient(to right, transparent, var(--color-primary));
  transform-origin: 0 50%;
  pointer-events: none;
}

.dial-knob {
  position: absolute;
  width: 18px;
  height: 18px;
  border: var(--border);
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.cardinal {
  position: absolute;
}

.dial-center {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  width: 4.5rem;
  transform: translate(-50%, -50%);
}

.angle-input {
  display: flex;
  align-items: baseline;
  justify-content: center;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-black);
  font-variant-numeric: tabular-nums;

  input {
    width: 3ch;
    padding: 0;
    border: 0;
    background: transparent;
    font-weight: var(--font-weight-black);
    text-align: center;
    appearance: textfield;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      appearance: none;
    }

    &:focus {
      outline: none;
      color: var(--color-text);
    }
  }
}
</style>
