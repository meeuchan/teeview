<script setup lang="ts">
import { ref } from 'vue'
import { getSkinImageByNameOrUrl } from '@/utils'
import ApplyButton from '../ApplyButton.vue'

const value = ref('')
const loading = ref(false)
const inputError = ref<string | null>()

const emit = defineEmits<{
  input: [value: HTMLImageElement]
}>()

async function getSkin() {
  clearError()

  const url = value.value.trim()
  if (!url) {
    setError('Please input something.')
    return
  }

  loading.value = true
  try {
    const img = await getSkinImageByNameOrUrl(url)
    emit('input', img)
  } catch (e) {
    setError(e instanceof Error ? e.message : 'Invalid URL or skin name.')
  } finally {
    loading.value = false
  }
}

function setError(error: string) {
  inputError.value = error
}

function clearError() {
  inputError.value = null
}
</script>

<template>
  <form class="field" novalidate @submit.prevent="getSkin()">
    <label for="skinUrlInput" class="field-label">Skin name or URL</label>
    <input
      id="skinUrlInput"
      v-model="value"
      type="text"
      class="input"
      placeholder="e.g. cammo, bluekitty, https://…/skin.png"
      autocomplete="off"
      spellcheck="false"
      :aria-invalid="!!inputError || undefined"
    />
    <div class="field-footer">
      <p v-if="inputError" class="field-error" role="alert">{{ inputError }}</p>
      <p v-else class="field-hint">Names are looked up in the DDNet skin databases.</p>
      <ApplyButton label="Load tee skin" :loading="loading" />
    </div>
  </form>
</template>
