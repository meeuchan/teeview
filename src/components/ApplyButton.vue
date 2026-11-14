<script setup lang="ts">
import ArrowRightIcon from './icons/ArrowRightIcon.vue'
import SpinnerIcon from './icons/SpinnerIcon.vue'
import Button from './ui/Button.vue'

const props = defineProps<{
  label: string
  loading?: boolean
}>()
</script>

<template>
  <Button type="submit" variant="primary" :disabled="props.loading" :aria-label="props.label">
    <SpinnerIcon v-if="props.loading" />
    <ArrowRightIcon v-else />
  </Button>
</template>
