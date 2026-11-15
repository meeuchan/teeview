<script setup lang="ts">
import { ref, watch } from 'vue'
import InputTeeColor from './inputs/InputTeeColor.vue'
import { TeeColor } from '@/lib/Color'
import type { IColorPreset, ITeeColors } from '@/lib/Tee'
import { debounce } from '@/utils'
import Toggle from './ui/Toggle.vue'

const props = defineProps<{
  preset?: IColorPreset
}>()

const useCustomColors = ref(false)
const bodyColor = ref<TeeColor>()
const feetColor = ref<TeeColor>()

const emit = defineEmits<{
  change: [value: ITeeColors | undefined]
}>()

const debouncedChangeEmit = debounce((value: ITeeColors | undefined) => emit('change', value))

watch(
  () => props.preset,
  (preset) => {
    if (!preset) return

    useCustomColors.value = preset.useCustomColors
    if (preset.body) bodyColor.value = preset.body
    if (preset.feet) feetColor.value = preset.feet
    buildOptions()
  },
)

watch(useCustomColors, () => buildOptions())

function buildOptions() {
  if (useCustomColors.value && bodyColor.value && feetColor.value) {
    debouncedChangeEmit({
      body: bodyColor.value,
      feet: feetColor.value,
    })
  } else {
    debouncedChangeEmit(undefined)
  }
}
</script>

<template>
  <form class="container" @submit.prevent>
    <Toggle
      v-model="useCustomColors"
      label="Custom colors"
      description="Tint the body and feet like in-game"
    />
    <div class="color-inputs">
      <InputTeeColor
        label="Body"
        :code="bodyColor?.code"
        :disabled="!useCustomColors"
        @input="((bodyColor = $event), buildOptions())"
      />
      <InputTeeColor
        label="Feet"
        :code="feetColor?.code"
        :disabled="!useCustomColors"
        @input="((feetColor = $event), buildOptions())"
      />
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

.color-inputs {
  display: grid;
  gap: var(--space-4);
  @media (min-width: $breakpoint-md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
