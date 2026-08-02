<script setup lang="ts">
import type { IRendererOptions } from '@/lib/Renderer'
import { ref } from 'vue'

export type IPoseOptions = Pick<IRendererOptions, 'noFeet'>

const noFeet = ref(false)

const emit = defineEmits<{
  change: [value: IPoseOptions]
}>()

function buildOptions() {
  const options: IPoseOptions = {
    noFeet: noFeet.value,
  }

  emit('change', options)
}
</script>

<template>
  <form class="container-fluid g-0">
    <div class="row">
      <div class="col">
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
