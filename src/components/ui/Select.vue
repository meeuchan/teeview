<script setup lang="ts" generic="T extends string | number">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  options: { label: string; value: T }[]
  label: string
  disabled?: boolean
  maxColumns?: number
}>()

const columnLimit = computed(() =>
  Math.max(1, Math.min(props.options.length, props.maxColumns ?? Infinity)),
)

const model = defineModel<T>({ required: true })

const groupEl = ref<HTMLElement>()

const columns = ref(columnLimit.value)

const firstOptionSpan = computed(() => {
  const cols = columns.value
  const count = props.options.length
  if ((cols !== 2 && cols !== 3) || count <= cols) return undefined
  const span = cols - ((count - 1) % cols)
  return span > 1 ? span : undefined
})

function layout() {
  const group = groupEl.value
  const button = group?.querySelector<HTMLElement>('.select-option')
  if (!group || !button || group.clientWidth === 0) return

  const buttonStyle = getComputedStyle(button)
  const buttonChrome =
    parseFloat(buttonStyle.paddingLeft) +
    parseFloat(buttonStyle.paddingRight) +
    parseFloat(buttonStyle.borderLeftWidth) +
    parseFloat(buttonStyle.borderRightWidth)
  const labels = group.querySelectorAll<HTMLElement>('.select-option-label')
  const widestLabel = Math.max(...Array.from(labels, (el) => el.offsetWidth))
  const widestOption = widestLabel + 1 + buttonChrome

  const groupStyle = getComputedStyle(group)
  const available =
    group.clientWidth - parseFloat(groupStyle.paddingLeft) - parseFloat(groupStyle.paddingRight)
  const gap = parseFloat(groupStyle.columnGap) || 0

  const fit = Math.floor((available + gap) / (widestOption + gap))
  columns.value = Math.min(Math.max(fit, 1), columnLimit.value)
}

let observer: ResizeObserver | undefined

onMounted(() => {
  observer = new ResizeObserver(() => layout())
  if (groupEl.value) observer.observe(groupEl.value)
  layout()
  document.fonts?.ready.then(() => layout())
})

onBeforeUnmount(() => observer?.disconnect())

watch(
  () => [props.options.map((option) => option.label).join('\n'), props.maxColumns],
  () => nextTick(layout),
)

function select(value: T) {
  if (props.disabled) return
  model.value = value
}

function onKeydown(event: KeyboardEvent, index: number) {
  const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
  if (!step) return
  event.preventDefault()
  const next = (index + step + props.options.length) % props.options.length
  select(props.options[next].value)
  const group = (event.currentTarget as HTMLElement).parentElement
  ;(group?.children[next] as HTMLElement | undefined)?.focus()
}
</script>

<template>
  <div
    ref="groupEl"
    role="radiogroup"
    :aria-label="props.label"
    :aria-disabled="props.disabled || undefined"
    class="select-group"
    :class="{ 'is-disabled': props.disabled }"
    :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }"
  >
    <button
      v-for="(option, index) in props.options"
      :key="option.value"
      type="button"
      role="radio"
      class="select-option"
      :style="
        index === 0 && firstOptionSpan ? { gridColumn: `span ${firstOptionSpan}` } : undefined
      "
      :aria-checked="model === option.value"
      :tabindex="model === option.value ? 0 : -1"
      :disabled="props.disabled"
      @click="select(option.value)"
      @keydown="onKeydown($event, index)"
    >
      <span class="select-option-label">{{ option.label }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.select-group {
  display: grid;
  padding: 4px;
  gap: 4px;
  border-radius: 12px;
  background: var(--color-surface);

  &.is-disabled {
    opacity: 0.5;
  }
}

.select-option {
  min-width: 0;
  height: 32px;
  padding: 0 8px;

  border: 2px solid transparent;
  border-radius: 8px;

  background: transparent;
  color: var(--color-subtle);

  font-weight: 700;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  cursor: pointer;

  transition:
    background-color 0.15s,
    color 0.15s,
    box-shadow 0.15s,
    border-color 0.15s;

  &:hover:not(:disabled):not([aria-checked='true']) {
    color: var(--color-text);
  }

  &[aria-checked='true'] {
    color: var(--color-primary);
    border: 2px solid var(--color-primary);
  }

  &:disabled {
    cursor: not-allowed;
  }
}
</style>
