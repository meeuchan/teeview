<script setup lang="ts">
import { ref, watch } from 'vue'
import InputTeeColor from './inputs/InputTeeColor.vue'
import { TeeColor } from '@/lib/Color'
import type { IColorPreset, ITeeColors } from '@/lib/Tee'
import { debounce } from '@/utils'

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
  <form class="container-fluid g-0">
    <div class="row mb-2">
      <div class="col">
        <div class="form-check">
          <input
            id="customColorCheckbox"
            type="checkbox"
            v-model="useCustomColors"
            @change="buildOptions()"
            class="form-check-input"
          />
          <label class="form-check-label" for="customColorCheckbox">Custom Colors</label>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm mb-2 mb-md-0">
        <label class="form-label">Body:</label>
        <InputTeeColor
          :code="bodyColor?.code"
          :disabled="!useCustomColors"
          @input="((bodyColor = $event), buildOptions())"
        />
      </div>
      <div class="col-sm">
        <label class="form-label">Feet:</label>
        <InputTeeColor
          :code="feetColor?.code"
          :disabled="!useCustomColors"
          @input="((feetColor = $event), buildOptions())"
        />
      </div>
    </div>
  </form>
</template>
