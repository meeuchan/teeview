<script setup lang="ts">
import { EyeType, EyeTypeLabels, FaceType, FaceTypeLabels } from '@/lib/Parts'
import type { IRendererOptions } from '@/lib/Renderer'
import { getEnumNumericKeys } from '@/utils'
import { ref } from 'vue'

export type IPartsOptions = Pick<IRendererOptions, 'eyes' | 'face'>

const eyes = getEnumNumericKeys(EyeType)
const faces = getEnumNumericKeys(FaceType)

const selectedEyes = ref(eyes[0])
const selectedFace = ref(faces[0])

const emit = defineEmits<{
  change: [value: IPartsOptions]
}>()

function buildOptions() {
  const options: IPartsOptions = {
    eyes: selectedEyes.value,
    face: selectedFace.value,
  }

  emit('change', options)
}
</script>

<template>
  <div class="container-fluid g-0">
    <div class="row">
      <div class="col">
        <div class="mb-3">
          <label for="eyesInput" class="form-label">Eyes:</label>
          <select
            id="eyesInput"
            v-model="selectedEyes"
            @change="buildOptions()"
            class="form-select"
          >
            <option v-for="eye in eyes" :key="eye" :value="eye">
              {{ EyeTypeLabels[eye as EyeType] }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label for="faceInput" class="form-label">Face:</label>
          <select
            id="faceInput"
            v-model="selectedFace"
            @change="buildOptions()"
            class="form-select"
          >
            <option v-for="face in faces" :key="face" :value="face">
              {{ FaceTypeLabels[face as FaceType] }}
            </option>
          </select>
        </div>
      </div>
      <div class="col">Extras:</div>
    </div>
  </div>
</template>
