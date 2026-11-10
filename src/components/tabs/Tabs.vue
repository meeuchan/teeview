<script setup lang="ts">
import { computed, provide, ref, type RendererElement, type RendererNode, type VNode } from 'vue'
import { ActiveTabKey } from './TabSymbols'

type ITabNode = VNode<RendererNode, RendererElement, { title: string; disabled: string }>

const slots = defineSlots<{
  default(): ITabNode[]
}>()
const tabs = computed(() => slots.default())
const activeTabKey = ref(tabs.value[0].props?.title || '')
provide(ActiveTabKey, activeTabKey)

function setTabActive(tab: ITabNode) {
  if (isTabDisabled(tab)) return
  activeTabKey.value = tab.props?.title || ''
}

function isTabActive(tab: ITabNode) {
  return tab.props?.title === activeTabKey.value
}

function isTabDisabled(tab: ITabNode) {
  return !!tab.props?.disabled || tab.props?.disabled === ''
}
</script>

<template>
  <div class="tabs-list" role="tablist">
    <button v-for="tab in tabs" :key="tab.props?.title" type="button" role="tab" class="tab"
      :aria-selected="isTabActive(tab)" :disabled="isTabDisabled(tab)" @click="setTabActive(tab)">
      {{ tab.props?.title }}
    </button>
  </div>

  <slot></slot>
</template>

<style scoped lang="scss">
.tabs-list {
  display: flex;
  gap: 4px;
  padding: 8px;
  border-bottom: var(--border);
  overflow-x: auto;
  scrollbar-width: none;
}

.tab {
  position: relative;
  flex: 1 0 auto;
  padding: 0.5rem 0.75rem;
  border: 0;
  background: transparent;
  color: var(--color-subtle);
  font-size: 0.875rem;
  font-weight: 800;
  cursor: pointer;
  transition:
    background-color 0.2s,
    color 0.2s;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -8px;
    width: 0;
    height: 4px;
    border-radius: 4px 4px 0 0;
    background: var(--color-primary);
    transform: translateX(-50%);
    transition: width 0.25s cubic-bezier(0.3, 1.4, 0.5, 1);
  }

  &:hover:not(:disabled) {
    color: var(--color-text);
  }

  &[aria-selected='true'] {
    color: var(--color-text);

    &::after {
      width: 50%;
    }
  }

  &:disabled {
    opacity: 0.375;
    cursor: not-allowed;
  }
}
</style>
