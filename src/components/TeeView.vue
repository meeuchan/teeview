<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from 'vue'
import { Renderer, type IRendererOptions } from '@/lib/Renderer'
import Canvas from '@/lib/Canvas'

const props = defineProps<{
  options?: IRendererOptions
}>()

const renderer = ref(new Renderer())
const canvas = useTemplateRef('teePreview')

const emit = defineEmits<{
  change: [value: HTMLCanvasElement]
}>()

onMounted(() => {
  if (props.options) renderTee(props.options)
})

watch(
  () => props.options,
  (newOptions) => {
    if (!newOptions) return
    renderTee(newOptions)
  },
)

function renderTee(options: IRendererOptions) {
  if (!canvas.value) return
  const render = renderer.value.render(options)
  if (!render) return
  const ctx = canvas.value.getContext('2d')!

  canvas.value.width = render.width
  canvas.value.height = render.height
  ctx.drawImage(render, 0, 0)

  emit('change', Canvas.clone(canvas.value))
}
</script>

<template>
  <div id="teeView" class="card d-flex align-items-center justify-content-center">
    <canvas id="teePreview" ref="teePreview"></canvas>
  </div>
</template>

<style lang="scss" scoped>
#teeView {
  height: 256px;
}

#teePreview {
  height: 192px;
  width: 192px;
}
</style>
