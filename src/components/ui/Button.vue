<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'sm' | 'md' | 'icon'
    href?: string
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  { variant: 'secondary', size: 'md', type: 'button' },
)
</script>

<template>
  <a v-if="props.href" :href="props.href" target="_blank" rel="noopener" class="btn"
    :class="[`btn-${props.variant}`, `btn-${props.size}`]">
    <slot></slot>
  </a>
  <button v-else :type="props.type" :disabled="props.disabled" class="btn"
    :class="[`btn-${props.variant}`, `btn-${props.size}`]">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  border: none;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  user-select: none;

  transition: all 0.2s;
}

.btn-sm {
  height: 32px;
  padding: 0 0.75rem;
  font-size: 0.875rem;

  :slotted(svg) {
    width: 16px;
    height: 16px;
  }
}

.btn-primary {
  --btn-color-base: var(--color-primary);
  --btn-color-text: var(--color-bg);
}

.btn-secondary {
  --btn-color-base: var(--color-bg);
  --btn-color-text: var(--color-muted);
}

.btn-primary,
.btn-secondary {
  --btn-shadow-color: oklch(from var(--btn-color-base) calc(l - .125) c h);

  background: var(--btn-color-base);
  color: var(--btn-color-text);

  border-radius: 8px;
  font-weight: 700;
  line-height: 1;
  box-shadow:
    0 2.5px 0 var(--btn-shadow-color),
    0 0 0 -2.5px var(--btn-shadow-color);

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow:
      0 5px 0 var(--btn-shadow-color),
      0 0 0 -5px var(--btn-shadow-color);
  }

  &:active {
    transform: translateY(2px) scale(0.97);
    box-shadow:
      0 0 0 var(--btn-shadow-color),
      0 0 0 0 var(--btn-shadow-color);
  }
}

.btn-ghost {
  background: transparent;
  color: var(--color-subtle);

  &:hover:not(:disabled) {
    color: var(--color-text);
  }
}

.btn-icon {
  --size-icon: 24px;

  width: var(--size-icon);
  height: var(--size-icon);
  padding: 0;
}
</style>
