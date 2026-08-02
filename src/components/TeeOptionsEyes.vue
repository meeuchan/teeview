<script setup lang="ts">
import { EyeType, EyeTypeLabels } from '@/lib/Parts'
import type { IRendererOptions } from '@/lib/Renderer'
import { getEnumNumericKeys } from '@/utils'
import { ref } from 'vue'
import InputEyeAngle from './inputs/InputEyeAngle.vue'

export type IEyesOptions = Pick<IRendererOptions, 'eyes' | 'eyeAngle' | 'noFace'>

const eyes = getEnumNumericKeys(EyeType)

const selectedEyes = ref(eyes[0])
const eyeAngle = ref<number | null>(0)
const noFace = ref(false)

const emit = defineEmits<{
  change: [value: IEyesOptions]
}>()

function buildOptions() {
  const options: IEyesOptions = {
    eyes: selectedEyes.value,
    eyeAngle: eyeAngle.value,
    noFace: noFace.value,
  }

  emit('change', options)
}
</script>

<template>
  <form class="container-fluid g-0" @submit.prevent>
    <div class="row">
      <div class="col-sm mb-2 mb-md-0">
        <div class="form-check mb-3">
          <input id="noFaceCheckbox" type="checkbox" v-model="noFace" @change="buildOptions()"
            class="form-check-input" />
          <label class="form-check-label" for="noFaceCheckbox">No Face</label>
        </div>
        <div class="mb-3">
          <label for="eyesInput" class="form-label">Eyes:</label>
          <select id="eyesInput" v-model="selectedEyes" @change="buildOptions()" :disabled="noFace" class="form-select">
            <option v-for="eye in eyes" :key="eye" :value="eye">
              {{ EyeTypeLabels[eye as EyeType] }}
            </option>
          </select>
        </div>
      </div>
      <div class="col-sm mb-2 mb-md-0">
        <label class="form-label mb-0">Direction:</label>
        <InputEyeAngle :angle="eyeAngle" :disabled="noFace" @input="((eyeAngle = $event), buildOptions())" />
      </div>
    </div>
  </form>
</template>
