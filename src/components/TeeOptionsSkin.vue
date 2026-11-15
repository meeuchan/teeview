<script setup lang="ts">
import { onMounted, ref } from 'vue'
import InputSkinFile from './inputs/InputSkinFile.vue'
import InputSkinUrl from './inputs/InputSkinUrl.vue'
import InputSkinCommand from './inputs/InputSkinCommand.vue'
import type { IColorPreset } from '@/lib/Tee'
import { getImageFromUrl } from '@/utils'
import Select from './ui/Select.vue'
import SkinPreview from './SkinPreview.vue'

type SkinInputMode = 'file' | 'url' | 'command'

const modes: { label: string; value: SkinInputMode }[] = [
  { label: 'File', value: 'file' },
  { label: 'Name / URL', value: 'url' },
  { label: 'Command', value: 'command' },
]

const mode = ref<SkinInputMode>('file')
const skin = ref<HTMLImageElement>()

const emit = defineEmits<{
  change: [value: HTMLImageElement]
  colors: [value: IColorPreset]
}>()

function setSkin(img: HTMLImageElement) {
  skin.value = img
  emit('change', img)
}

onMounted(async () => {
  const img = await getImageFromUrl(`${import.meta.env.BASE_URL}default.png`)
  setSkin(img)
})
</script>

<template>
  <div class="container">
    <div class="skin-loader-container">
      <div class="field">
        <span class="field-label">Load Tee From</span>
        <Select v-model="mode" :options="modes" label="Skin source" />
      </div>
      <InputSkinFile v-if="mode === 'file'" @input="setSkin($event)" />
      <InputSkinUrl v-if="mode === 'url'" @input="setSkin($event)" />
      <InputSkinCommand
        v-if="mode === 'command'"
        @input="setSkin($event)"
        @colors="emit('colors', $event)"
      />
    </div>

    <div>
      <SkinPreview :image="skin" label="Current skin" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/vars' as *;

.container {
  display: grid;
  gap: var(--space-4);
  align-items: start;

  @media (min-width: $breakpoint-md) {
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
  }
}

.skin-loader-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
</style>
