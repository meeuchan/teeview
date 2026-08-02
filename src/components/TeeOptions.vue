<script setup lang="ts">
import { ref } from 'vue'
import Tab from './tabs/Tab.vue'
import Tabs from './tabs/Tabs.vue'
import TeeOptionsSkin from './TeeOptionsSkin.vue'
import type { IRendererOptions } from '@/lib/Renderer'
import TeeOptionsEyes, { type IEyesOptions } from './TeeOptionsEyes.vue'
import TeeOptionsPose, { type IPoseOptions } from './TeeOptionsPose.vue'
import TeeOptionsColors from './TeeOptionsColors.vue'
import type { IColorPreset, ITeeColors } from '@/lib/Tee'
import TeeOptionsDownload from './TeeOptionsDownload.vue'

const props = defineProps<{
  result?: HTMLCanvasElement
}>()

const skin = ref<HTMLImageElement>()
const colorOptions = ref<ITeeColors>()
const colorPreset = ref<IColorPreset>()
const eyesOptions = ref<IEyesOptions>()
const poseOptions = ref<IPoseOptions>()

const emit = defineEmits<{
  change: [value: IRendererOptions]
}>()

function buildOptions() {
  if (!skin.value) return

  const options: IRendererOptions = {
    skin: skin.value,
    colors: colorOptions.value,
    ...eyesOptions.value,
    ...poseOptions.value,
  }
  emit('change', options)
}
</script>

<template>
  <div id="teeOptions">
    <div class="card">
      <Tabs>
        <Tab title="Skin" class="card-body">
          <TeeOptionsSkin @change="((skin = $event), buildOptions())" @colors="colorPreset = $event" />
        </Tab>
        <Tab title="Colors" :disabled="!skin" class="card-body">
          <TeeOptionsColors :preset="colorPreset" @change="((colorOptions = $event), buildOptions())" />
        </Tab>
        <Tab title="Eyes" :disabled="!skin" class="card-body">
          <TeeOptionsEyes @change="((eyesOptions = $event), buildOptions())" />
        </Tab>
        <Tab title="Pose" :disabled="!skin" class="card-body">
          <TeeOptionsPose @change="((poseOptions = $event), buildOptions())" />
        </Tab>
        <Tab title="Download" :disabled="!skin" class="card-body">
          <TeeOptionsDownload :result="props.result" />
        </Tab>
      </Tabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#teeOptions {
  height: 256px;
}
</style>
