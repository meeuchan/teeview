<script setup lang="ts">
import { PoseType, PoseTypeLabels } from '@/lib/Parts'
import type { IRendererOptions } from '@/lib/Renderer'
import { getEnumNumericKeys } from '@/utils'
import { ref, watch } from 'vue'
import Select from './ui/Select.vue'
import Toggle from './ui/Toggle.vue'

export type IPoseOptions = Pick<IRendererOptions, 'pose' | 'noFeet' | 'ddFat'>

const poses = getEnumNumericKeys(PoseType)
const poseOptions = poses.map((pose) => ({ label: PoseTypeLabels[pose as PoseType], value: pose }))

const selectedPose = ref(poses[0])
const noFeet = ref(false)
const ddFat = ref(false)

const emit = defineEmits<{
  change: [value: IPoseOptions]
}>()

watch(noFeet, (value) => {
  if (value) selectedPose.value = poses[0]
})

watch([selectedPose, noFeet, ddFat], () => buildOptions())

function buildOptions() {
  const options: IPoseOptions = {
    pose: selectedPose.value,
    noFeet: noFeet.value,
    ddFat: ddFat.value,
  }

  emit('change', options)
}
</script>

<template>
  <form class="container" @submit.prevent>
    <div class="pose-modes">
      <Toggle v-model="noFeet" label="No feet" />
      <Toggle v-model="ddFat" label="DDFat" />
    </div>
    <div class="field">
      <span class="field-label">Pose</span>
      <Select v-model="selectedPose" :options="poseOptions" :disabled="noFeet" label="Pose" />
    </div>
  </form>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pose-modes {
  display: grid;
  gap: 16px;
  @media (min-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
