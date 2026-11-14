<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { getSkinImageByNameOrUrl, parseSkinCommand } from '@/utils'
import { TeeColor } from '@/lib/Color'
import type { IColorPreset } from '@/lib/Tee'
import ApplyButton from '../ApplyButton.vue'

const value = ref('')
const loading = ref(false)
const applied = ref(false)
const inputError = ref<string | null>()

const emit = defineEmits<{
  input: [value: HTMLImageElement]
  colors: [value: IColorPreset]
}>()

async function applyCommand() {
  clearError()

  const command = value.value
  if (!command.trim()) {
    setError('Please input something.')
    return
  }

  const parsed = parseSkinCommand(command)
  if (!parsed.skinName) {
    setError('Could not find a player_skin value in the command.')
    return
  }

  loading.value = true
  try {
    const img = await getSkinImageByNameOrUrl(parsed.skinName)
    emit('input', img)

    const useCustomColors =
      parsed.useCustomColors === true &&
      parsed.bodyColorCode !== undefined &&
      parsed.feetColorCode !== undefined

    emit('colors', {
      useCustomColors,
      body: useCustomColors ? TeeColor.fromCode(parsed.bodyColorCode) : undefined,
      feet: useCustomColors ? TeeColor.fromCode(parsed.feetColorCode) : undefined,
    })
    applied.value = true
  } catch (e) {
    setError(e instanceof Error ? e.message : 'Invalid command.')
  } finally {
    loading.value = false
  }
}

async function onPaste() {
  await nextTick()
  applyCommand()
}

function setError(error: string) {
  applied.value = false
  inputError.value = error
}

function clearError() {
  applied.value = false
  inputError.value = null
}
</script>

<template>
  <form class="field" novalidate @submit.prevent="applyCommand()">
    <label for="skinCommandInput" class="field-label">Console command</label>
    <textarea
      id="skinCommandInput"
      v-model="value"
      class="input"
      rows="3"
      placeholder='player_skin "default";&#10;player_use_custom_color 1;&#10;…'
      spellcheck="false"
      :aria-invalid="!!inputError || undefined"
      @paste="onPaste()"
      @keydown.ctrl.enter.prevent="applyCommand()"
      @keydown.meta.enter.prevent="applyCommand()"
    ></textarea>
    <div class="field-footer">
      <p v-if="inputError" class="field-error" role="alert">{{ inputError }}</p>
      <p v-else class="field-hint">Paste the command from DDStats.tw.</p>
      <ApplyButton label="Load tee skin" :loading="loading" />
    </div>
  </form>
</template>
