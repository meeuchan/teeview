<script setup lang="ts">
import Canvas from '@/lib/Canvas'
import DownloadIcon from './icons/DownloadIcon.vue'

const props = defineProps<{
  result?: HTMLCanvasElement
}>()

function downloadCanvas(canvas: HTMLCanvasElement) {
  const data = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
  const a = document.createElement('a')
  a.href = data
  a.download = 'tee.png'
  a.click()
}

function downloadFullSize() {
  if (!props.result) return
  downloadCanvas(props.result)
}

function downloadEmojiSize() {
  if (!props.result) return
  const resizedCanvas = Canvas.resizeSmooth(props.result, 128, 128)
  downloadCanvas(resizedCanvas)
}
</script>

<template>
  <div class="container-fluid g-0">
    <div class="row">
      <div class="col d-flex gap-2">
        <button class="btn btn-primary" @click="downloadFullSize()">
          <DownloadIcon class="me-1" /> Full Size ({{ props.result?.width }}x{{
            props.result?.height
          }})
        </button>
        <button class="btn btn-primary" @click="downloadEmojiSize()">
          <DownloadIcon class="me-1" /> Emoji Size (128x128)
        </button>
      </div>
    </div>
  </div>
</template>
