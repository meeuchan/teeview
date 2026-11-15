<script setup lang="ts">
import { EyeType, EyeTypeLabels } from '@/lib/Parts'
import type { IRendererOptions } from '@/lib/Renderer'
import { debounce, getEnumNumericKeys } from '@/utils'
import { ref, watch } from 'vue'
import InputEyeAngle from './inputs/InputEyeAngle.vue'
import Select from './ui/Select.vue'
import Toggle from './ui/Toggle.vue'

export type IEyesOptions = Pick<IRendererOptions, 'eyes' | 'eyeAngle' | 'noFace'>

const eyes = getEnumNumericKeys(EyeType)
const eyeOptions = eyes.map((eye) => ({ label: EyeTypeLabels[eye as EyeType], value: eye }))

const selectedEyes = ref(eyes[0])
const eyeAngle = ref<number | null>(0)
const noFace = ref(false)

const emit = defineEmits<{
  change: [value: IEyesOptions]
}>()

const debouncedChangeEmit = debounce((value: IEyesOptions) => emit('change', value))

watch([selectedEyes, noFace], () => buildOptions())

function buildOptions() {
  const options: IEyesOptions = {
    eyes: selectedEyes.value,
    eyeAngle: eyeAngle.value,
    noFace: noFace.value,
  }

  debouncedChangeEmit(options)
}
</script>

<template>
  <form class="container" @submit.prevent>
    <Toggle v-model="noFace" label="No face" description="Hide the eyes entirely" />
    <div class="eyes-options">
      <div class="field">
        <span class="field-label">Expression</span>
        <Select
          v-model="selectedEyes"
          :options="eyeOptions"
          :maxColumns="2"
          :disabled="noFace"
          label="Eye expression"
        />
      </div>
      <div class="field">
        <span class="field-label">Look direction</span>
        <InputEyeAngle
          :angle="eyeAngle"
          :disabled="noFace"
          @input="((eyeAngle = $event), buildOptions())"
        />
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped>
@use '@/assets/vars' as *;

.container {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.eyes-options {
  display: grid;
  gap: var(--space-4);
  @media (min-width: $breakpoint-md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
