<script setup lang="ts">
const props = defineProps<{
  label: string
  disabled?: boolean
}>()

const model = defineModel<boolean>({ required: true })
</script>

<template>
  <label class="toggle" :class="{ 'is-disabled': props.disabled }">
    <span class="toggle-label">{{ props.label }}</span>
    <input v-model="model" type="checkbox" role="switch" :disabled="props.disabled" />
    <span class="track" aria-hidden="true"><span class="thumb"></span></span>
  </label>
</template>

<style scoped lang="scss">
.toggle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  cursor: pointer;

  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.toggle-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-extrabold);
  letter-spacing: var(--letter-spacing-caps);
  text-transform: uppercase;
  color: var(--color-subtle);
}

input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.track {
  position: relative;
  flex-shrink: 0;
  width: 40px;
  height: 24px;
  border-radius: var(--radius-full);
  background: var(--color-pill);
  border: var(--border);
  transition: background-color 0.2s;
}

.thumb {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-text);
  transition: transform 0.2s cubic-bezier(0.3, 1.5, 0.6, 1);
}

input:checked + .track {
  background: var(--color-primary);

  .thumb {
    transform: translateX(16px);
  }
}

input:focus-visible + .track {
  outline: var(--border-width) solid var(--color-primary);
  outline-offset: var(--border-width);
}
</style>
