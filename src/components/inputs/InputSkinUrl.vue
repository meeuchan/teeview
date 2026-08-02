<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { getSkinImageByNameOrUrl } from '@/utils'

const input = useTemplateRef('fileInput')
const hasInputChanged = ref(false)
const inputError = ref<string | null>()

const emit = defineEmits<{
  input: [value: HTMLImageElement]
}>()

async function getSkin() {
  clearError()

  const url = input.value?.value
  if (!url) {
    setError('Please input something.')
    return
  }

  try {
    const img = await getSkinImageByNameOrUrl(url)
    hasInputChanged.value = true
    emit('input', img)
  } catch (e) {
    setError(e instanceof Error ? e.message : 'Invalid URL or skin name.')
  }
}

function setError(error: string) {
  hasInputChanged.value = true
  input.value?.setCustomValidity(error)
  inputError.value = error
}

function clearError() {
  hasInputChanged.value = false
  input.value?.setCustomValidity('')
  inputError.value = null
}
</script>

<template>
  <form @submit.prevent="" novalidate class="needs-validation position-relative"
    :class="[hasInputChanged && 'was-validated']">
    <div class="input-group has-validation">
      <span class="input-group-text" id="basic-addon1">URL/Name</span>
      <input ref="fileInput" type="text" @change="getSkin()" class="form-control me-1" required placeholder="default" />
      <div class="invalid-tooltip">{{ inputError }}</div>
    </div>
  </form>
</template>
