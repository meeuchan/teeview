<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { getImageFromFile } from '@/utils'

const input = useTemplateRef('fileInput')
const hasInputChanged = ref(false)
const inputError = ref<string | null>()

const emit = defineEmits<{
  input: [value: HTMLImageElement]
}>()

async function setSkin() {
  clearError()
  const file = input.value?.files?.[0]
  hasInputChanged.value = true

  if (!file) {
    setError('Please select a file.')
    return
  }
  if (!file.name.endsWith('.png')) {
    setError('Must be a .png file.')
    return
  }

  const img = await getImageFromFile(file)

  if (img.width / img.height !== 2 || img.width < 256 || img.height < 128) {
    setError('The image must have a 2:1 size ratio and a minimum size of 256x128px.')
    return
  }

  emit('input', img)
}

function setError(error: string) {
  input.value?.setCustomValidity(error)
  inputError.value = error
}

function clearError() {
  input.value?.setCustomValidity('')
  inputError.value = null
}
</script>

<template>
  <form
    novalidate
    class="needs-validation position-relative"
    :class="[hasInputChanged && 'was-validated']"
  >
    <input ref="fileInput" type="file" @change="setSkin()" class="form-control" required />
    <div class="invalid-tooltip">{{ inputError }}</div>
  </form>
</template>
