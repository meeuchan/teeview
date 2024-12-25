<script setup lang="ts">
import { provide, ref, type RendererElement, type RendererNode, type VNode } from 'vue'
import { ActiveTabKey } from './TabSymbols'

type ITabNode = VNode<RendererNode, RendererElement, { title: string; disabled: string }>

const slots = defineSlots<{
  default(): ITabNode[]
}>()
const tabs = slots.default()
const activeTabKey = ref(tabs[0].props?.title || '')
provide(ActiveTabKey, activeTabKey)

function setTabActive(tab: ITabNode) {
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
  <ul class="nav nav-tabs">
    <li v-for="tab in tabs" class="nav-item">
      <button
        @click="setTabActive(tab)"
        class="nav-link"
        :class="[isTabActive(tab) && 'active', isTabDisabled(tab) && 'disabled']"
        :aria-current="isTabActive(tab) || undefined"
        :aria-disabled="isTabDisabled(tab) || undefined"
      >
        {{ tab.props?.title }}
      </button>
    </li>
  </ul>

  <slot></slot>
</template>
