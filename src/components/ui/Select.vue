<script setup lang="ts" generic="T extends string | number">
const props = defineProps<{
  options: { label: string; value: T }[]
  label: string
  disabled?: boolean
  columns?: number
}>()

const model = defineModel<T>({ required: true })

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
    role="radiogroup"
    :aria-label="props.label"
    :aria-disabled="props.disabled || undefined"
    class="select-group"
    :class="[props.columns ? 'is-grid' : 'is-row', props.disabled && 'is-disabled']"
    :style="
      props.columns
        ? { gridTemplateColumns: `repeat(${props.columns}, minmax(0, 1fr))` }
        : undefined
    "
  >
    <button
      v-for="(option, index) in props.options"
      :key="option.value"
      type="button"
      role="radio"
      class="select-option"
      :aria-checked="model === option.value"
      :tabindex="model === option.value ? 0 : -1"
      :disabled="props.disabled"
      @click="select(option.value)"
      @keydown="onKeydown($event, index)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.select-group {
  padding: 4px;
  gap: 4px;
  border-radius: 16px;
  background: var(--color-surface);
  border: var(--border);

  &.is-row {
    display: flex;
  }

  &.is-grid {
    display: grid;
  }

  &.is-disabled {
    opacity: 0.5;
  }
}

.select-option {
  flex: 1;
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
