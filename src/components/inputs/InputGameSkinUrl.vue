<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { getGameSkinImageFromUrl } from '@/utils'

const input = useTemplateRef('fileInput')
const hasInputChanged = ref(false)
const inputError = ref<string | null>()

const emit = defineEmits<{
  input: [value: HTMLImageElement]
}>()

async function getGameSkin() {
  clearError()

  const url = input.value?.value
  if (!url) {
    setError('Please input a URL.')
    return
  }

  try {
    const img = await getGameSkinImageFromUrl(url)
    hasInputChanged.value = true
    emit('input', img)
  } catch (e) {
    setError(e instanceof Error ? e.message : 'Invalid URL.')
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
      <span class="input-group-text" id="basic-addon1">URL</span>
      <input ref="fileInput" type="text" @change="getGameSkin()" class="form-control me-1" required
        placeholder="https://.../game.png" />
      <div class="invalid-tooltip">{{ inputError }}</div>
    </div>
  </form>
</template>
