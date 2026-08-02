<script setup lang="ts">
import { PoseType, PoseTypeLabels } from '@/lib/Parts'
import type { IRendererOptions } from '@/lib/Renderer'
import { getEnumNumericKeys } from '@/utils'
import { ref } from 'vue'

export type IPoseOptions = Pick<IRendererOptions, 'pose' | 'noFeet'>

const poses = getEnumNumericKeys(PoseType)

const selectedPose = ref(poses[0])
const noFeet = ref(false)

const emit = defineEmits<{
  change: [value: IPoseOptions]
}>()

function onNoFeetChange() {
  if (noFeet.value) selectedPose.value = poses[0]
  buildOptions()
}

function buildOptions() {
  const options: IPoseOptions = {
    pose: selectedPose.value,
    noFeet: noFeet.value,
  }

  emit('change', options)
}
</script>

<template>
  <form class="container-fluid g-0" @submit.prevent>
    <div class="row">
      <div class="col">
        <div class="form-check mb-3">
          <input id="noFeetCheckbox" type="checkbox" v-model="noFeet" @change="onNoFeetChange()"
            class="form-check-input" />
          <label class="form-check-label" for="noFeetCheckbox">No Feet</label>
        </div>
        <div class="mb-3">
          <label for="poseInput" class="form-label">Pose:</label>
          <select id="poseInput" v-model="selectedPose" @change="buildOptions()" :disabled="noFeet" class="form-select">
            <option v-for="pose in poses" :key="pose" :value="pose">
              {{ PoseTypeLabels[pose as PoseType] }}
            </option>
          </select>
        </div>
      </div>
      <div class="col"></div>
    </div>
  </form>
</template>
