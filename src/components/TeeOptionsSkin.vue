<script setup lang="ts">
import { ref } from 'vue'
import InputSkinFile from './inputs/InputSkinFile.vue'
import LinkTo from './LinkTo.vue'
import InputSkinUrl from './inputs/InputSkinUrl.vue'
import InputSkinCommand from './inputs/InputSkinCommand.vue'
import type { IColorPreset } from '@/lib/Tee'

type SkinInputMode = 'file' | 'url' | 'command'

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
</script>

<template>
  <div class="container-fluid g-0">
    <div class="row">
      <div class="col-sm mb-3 mb-md-0">
        <div class="d-flex align-items-center mb-3">
          <span class="me-2">From:</span>
          <div class="btn-group btn-group-sm" role="group" aria-label="Skin input mode">
            <input id="skinModeFile" type="radio" class="btn-check" value="file" v-model="mode" autocomplete="off" />
            <label class="btn btn-outline-primary" for="skinModeFile">File</label>

            <input id="skinModeUrl" type="radio" class="btn-check" value="url" v-model="mode" autocomplete="off" />
            <label class="btn btn-outline-primary" for="skinModeUrl">URL/Name</label>

            <input id="skinModeCommand" type="radio" class="btn-check" value="command" v-model="mode"
              autocomplete="off" />
            <label class="btn btn-outline-primary" for="skinModeCommand">Command</label>
          </div>
        </div>

        <div>
          <InputSkinFile v-if="mode === 'file'" @input="setSkin($event)" />
          <InputSkinUrl v-if="mode === 'url'" @input="setSkin($event)" />
          <InputSkinCommand v-if="mode === 'command'" @input="setSkin($event)" @colors="emit('colors', $event)" />
        </div>
      </div>
      <div class="col-sm text-center text-md-end">
        <img id="skinPreview" :src="skin?.src" v-if="skin?.src" class="img-thumbnail" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#skinPreview {
  max-height: 128px;
}
</style>
