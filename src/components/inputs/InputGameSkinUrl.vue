<script setup lang="ts">
import { ref } from 'vue'
import { getGameSkinImageFromUrl } from '@/utils'
import ApplyButton from '../ApplyButton.vue'

const value = ref('')
const loading = ref(false)
const inputError = ref<string | null>()

const emit = defineEmits<{
  input: [value: HTMLImageElement]
}>()

async function getGameSkin() {
  clearError()

  const url = value.value.trim()
  if (!url) {
    setError('Please input a URL.')
    return
  }

  loading.value = true
  try {
    const img = await getGameSkinImageFromUrl(url)
    emit('input', img)
  } catch (e) {
    setError(e instanceof Error ? e.message : 'Invalid URL.')
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
  <form class="field" novalidate @submit.prevent="getGameSkin()">
    <label for="gameSkinUrlInput" class="field-label">Game skin URL</label>
    <div class="row">
      <input
        id="gameSkinUrlInput"
        v-model="value"
        type="text"
        class="input"
        placeholder="https://…/game.png"
        autocomplete="off"
        spellcheck="false"
        :aria-invalid="!!inputError || undefined"
      />
    </div>
    <div class="field-footer">
      <p v-if="inputError" class="field-error" role="alert">{{ inputError }}</p>
      <p v-else class="field-hint">Must be a PNG or SVG and at least 256×128.</p>
      <ApplyButton label="Load tee skin" :loading="loading" />
    </div>
  </form>
</template>
