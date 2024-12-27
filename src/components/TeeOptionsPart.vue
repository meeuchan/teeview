<script setup lang="ts">
import { EyeType, EyeTypeLabels, FaceType, FaceTypeLabels } from '@/lib/Parts'
import type { IRendererOptions } from '@/lib/Renderer'
import { getEnumNumericKeys } from '@/utils'
import { ref } from 'vue'

export type IPartsOptions = Pick<IRendererOptions, 'eyes' | 'face' | 'noFace' | 'noFeet'>

const eyes = getEnumNumericKeys(EyeType)
const faces = getEnumNumericKeys(FaceType)

const selectedEyes = ref(eyes[0])
const selectedFace = ref(faces[0])
const noFace = ref(false)
const noFeet = ref(false)

const emit = defineEmits<{
  change: [value: IPartsOptions]
}>()

function buildOptions() {
  const options: IPartsOptions = {
    eyes: selectedEyes.value,
    face: selectedFace.value,
    noFace: noFace.value,
    noFeet: noFeet.value,
  }

  emit('change', options)
}
</script>

<template>
  <form class="container-fluid g-0">
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
      <div class="col">
        <label class="form-label">Extras:</label>
        <div class="form-check">
          <input
            id="noFaceCheckbox"
            type="checkbox"
            v-model="noFace"
            @change="buildOptions()"
            class="form-check-input"
          />
          <label class="form-check-label" for="noFaceCheckbox">No Face</label>
        </div>
        <div class="form-check">
          <input
            id="noFeetCheckbox"
            type="checkbox"
            v-model="noFeet"
            @change="buildOptions()"
            class="form-check-input"
          />
          <label class="form-check-label" for="noFeetCheckbox">No Feet</label>
        </div>
      </div>
    </div>
  </form>
</template>
