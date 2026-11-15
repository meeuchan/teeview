<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref, type RendererElement, type RendererNode, type VNode } from 'vue'
import { ActiveTabKey } from './TabSymbols'

type ITabNode = VNode<RendererNode, RendererElement, { title: string; disabled: string }>

const slots = defineSlots<{
  default(): ITabNode[]
}>()
const tabs = computed(() => slots.default())
const activeTabKey = ref(tabs.value[0].props?.title || '')
provide(ActiveTabKey, activeTabKey)

const listEl = ref<HTMLElement>()
const fadeStart = ref(false)
const fadeEnd = ref(false)
let resizeObserver: ResizeObserver | undefined

function updateFade() {
  const el = listEl.value
  if (!el) return
  const maxScroll = el.scrollWidth - el.clientWidth
  fadeStart.value = el.scrollLeft > 1
  fadeEnd.value = el.scrollLeft < maxScroll - 1
}

onMounted(() => {
  const el = listEl.value
  if (!el) return
  updateFade()
  resizeObserver = new ResizeObserver(updateFade)
  resizeObserver.observe(el)
  for (const child of el.children) resizeObserver.observe(child)
})

onBeforeUnmount(() => resizeObserver?.disconnect())

function setTabActive(tab: ITabNode, event: MouseEvent) {
  if (isTabDisabled(tab)) return
  activeTabKey.value = tab.props?.title || '';
  (event.currentTarget as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
}

function isTabActive(tab: ITabNode) {
  return tab.props?.title === activeTabKey.value
}

function isTabDisabled(tab: ITabNode) {
  return !!tab.props?.disabled || tab.props?.disabled === ''
}
</script>

<template>
  <div class="tabs-bar">
    <div ref="listEl" class="tabs-list" :class="{ 'fade-start': fadeStart, 'fade-end': fadeEnd }" role="tablist"
      @scroll.passive="updateFade">
      <button v-for="tab in tabs" :key="tab.props?.title" type="button" role="tab" class="tab"
        :aria-selected="isTabActive(tab)" :disabled="isTabDisabled(tab)" @click="setTabActive(tab, $event)">
        {{ tab.props?.title }}
      </button>
    </div>
  </div>

  <slot></slot>
</template>

<style lang="scss" scoped>
@property --tabs-fade-start {
  syntax: '<length>';
  inherits: false;
  initial-value: 0px;
}

@property --tabs-fade-end {
  syntax: '<length>';
  inherits: false;
  initial-value: 0px;
}

$fade-size: 50px;

.tabs-bar {
  border-bottom: var(--border);
}

.tabs-list {
  --tabs-fade-start: 0px;
  --tabs-fade-end: 0px;

  display: flex;
  gap: var(--space-1);
  padding: var(--space-2);
  overflow-x: auto;
  scrollbar-width: none;

  $mask: linear-gradient(to right,
      transparent,
      #000 var(--tabs-fade-start),
      #000 calc(100% - var(--tabs-fade-end)),
      transparent);
  -webkit-mask-image: $mask;
  mask-image: $mask;
  transition:
    --tabs-fade-start 0.2s,
    --tabs-fade-end 0.2s;

  &::-webkit-scrollbar {
    display: none;
  }

  &.fade-start {
    --tabs-fade-start: #{$fade-size};
  }

  &.fade-end {
    --tabs-fade-end: #{$fade-size};
  }
}

.tab {
  position: relative;
  flex: 1 0 auto;
  padding: var(--space-2) var(--space-3);
  border: 0;
  background: transparent;
  color: var(--color-subtle);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-extrabold);
  cursor: pointer;
  transition:
    background-color 0.2s,
    color 0.2s;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    /* sits on the tabs-bar border, below the tabs-list padding */
    bottom: calc(-1 * var(--space-2));
    width: 0;
    height: 4px;
    border-radius: var(--radius-sm) var(--radius-sm) 0 0;
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
