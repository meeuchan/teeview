<script setup lang="ts">
import { ref } from 'vue'
import Tab from './tabs/Tab.vue'
import Tabs from './tabs/Tabs.vue'
import TeeOptionsSkin from './TeeOptionsSkin.vue'
import type { IRendererOptions } from '@/lib/Renderer'
import TeeOptionsPart, { type IPartsOptions } from './TeeOptionsPart.vue'

const skin = ref<HTMLImageElement>()
const partOptions = ref<IPartsOptions>()

const emit = defineEmits<{
  change: [value: IRendererOptions]
}>()

function buildOptions() {
  if (!skin.value) return

  const options: IRendererOptions = {
    skin: skin.value,
    ...partOptions.value
  }
  emit('change', options)
}
</script>

<template>
  <div id="teeOptions">
    <div class="card">
    <Tabs>
      <Tab title="Skin" class="card-body">
        <TeeOptionsSkin @change="((skin = $event), buildOptions())" />
      </Tab>
      <Tab title="Color" :disabled="!skin" class="card-body">
        <div>B</div>
      </Tab>
      <Tab title="Parts" :disabled="!skin" class="card-body">
        <TeeOptionsPart @change="((partOptions = $event), buildOptions())" />
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
