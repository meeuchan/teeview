<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import Button from './ui/Button.vue'
import { canCopyImage, copyCanvas, downloadCanvas, getExportCanvas, type ExportMode } from '@/lib/Export'
import DownloadIcon from './icons/DownloadIcon.vue';
import CopyIcon from './icons/CopyIcon.vue';
import CheckIcon from './icons/CheckIcon.vue';
import ErrorIcon from './icons/ErrorIcon.vue';

const props = defineProps<{
  source?: HTMLCanvasElement
  mode: ExportMode
  action: 'copy' | 'download'
  compact?: boolean
  primary?: boolean
}>()

type Status = 'idle' | 'busy' | 'done' | 'error'

const status = ref<Status>('idle')
let resetTimer: number | undefined

const label = computed(() => {
  if (props.action === 'download') return 'Download'
  if (status.value === 'done') return 'Copied!'
  if (status.value === 'error') return 'Failed'
  return 'Copy'
})

function flash(value: Status) {
  status.value = value
  clearTimeout(resetTimer)
  resetTimer = setTimeout(() => (status.value = 'idle'), 1600)
}

async function run() {
  if (!props.source) return
  const canvas = getExportCanvas(props.source, props.mode)

  if (props.action === 'download') {
    downloadCanvas(canvas)
    flash('done')
    return
  }

  status.value = 'busy'
  try {
    await copyCanvas(canvas)
    flash('done')
  } catch {
    flash('error')
  }
}

onBeforeUnmount(() => clearTimeout(resetTimer))
</script>

<template>
  <Button v-if="props.action === 'download' || canCopyImage" :variant="props.primary ? 'primary' : 'secondary'"
    size="sm" :disabled="!props.source || status === 'busy'"
    :title="props.action === 'copy' ? 'Copy image to clipboard' : 'Download PNG'"
    :class="{ 'is-done': status === 'done' }" @click="run()">
    <CheckIcon v-if="status === 'done'" />
    <ErrorIcon v-else-if="status === 'error'" />
    <template v-else>
      <CopyIcon v-if="props.action === 'copy'" />
      <DownloadIcon v-if="props.action === 'download'" />
    </template>
    <span>{{ label }}</span>
  </Button>
</template>
