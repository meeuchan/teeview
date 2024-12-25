<script setup lang="ts">
import { inject } from 'vue'
import { ActiveTabKey } from './TabSymbols'

const props = defineProps<{
  title: string
  disabled?: boolean
}>()

const activeTabKey = inject(ActiveTabKey)
</script>

<template>
  <div v-show="props.title === activeTabKey">
    <slot></slot>
  </div>
</template>
