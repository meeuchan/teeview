<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue'
import { Renderer, type IRendererOptions } from '@/lib/Renderer'
import Canvas from '@/lib/Canvas'
import { WeaponType } from '@/lib/Parts'

const props = defineProps<{
  options?: IRendererOptions
}>()

const renderer = ref(new Renderer())
const canvas = useTemplateRef('teePreview')

const emit = defineEmits<{
  change: [value: HTMLCanvasElement]
}>()

const hasWeapon = computed(
  () =>
    props.options?.weapon !== undefined &&
    props.options.weapon !== WeaponType.None &&
    !!props.options?.gameSkin,
)
const previewSize = computed(() => (hasWeapon.value ? 480 : 192))

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
  <div id="teeView" class="card d-flex align-items-center justify-content-center" :style="{ height: '480px' }">
    <canvas id="teePreview" ref="teePreview"
      :style="{ height: previewSize + 'px', width: previewSize + 'px' }"></canvas>
  </div>
</template>
