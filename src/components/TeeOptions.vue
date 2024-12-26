<script setup lang="ts">
import { ref } from 'vue'
import Tab from './tabs/Tab.vue'
import Tabs from './tabs/Tabs.vue'
import TeeOptionsSkin from './TeeOptionsSkin.vue'
import type { IRendererOptions } from '@/lib/Renderer'

const skin = ref<HTMLImageElement>()

const emit = defineEmits<{
  change: [value: IRendererOptions]
}>()

function buildOptions() {
  if (!skin.value) return

  const options: IRendererOptions = {
    skin: skin.value,
  }
  emit('change', options)
}
</script>

<template>
  <div id="teeOptions" class="card">
    <Tabs>
      <Tab title="Skin" class="card-body">
        <TeeOptionsSkin @change="((skin = $event), buildOptions())" />
      </Tab>
      <Tab title="Color" :disabled="!skin" class="card-body">
        <div>B</div>
      </Tab>
      <Tab title="Options" :disabled="!skin" class="card-body"></Tab>
    </Tabs>
  </div>
</template>

<style lang="scss" scoped>
#teeOptions {
  height: 256px;
}
</style>
