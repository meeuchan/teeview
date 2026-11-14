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
  gap: 16px;
  padding: 8px 12px;
  border-radius: 16px;
  background: var(--color-surface);
  cursor: pointer;

  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.toggle-label {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.075em;
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
  border-radius: 999px;
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
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
