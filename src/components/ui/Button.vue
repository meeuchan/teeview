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

  border: none;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  user-select: none;

  transition:
    background-color 0.2s,
    color 0.2s;
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
