<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { getSkinImageByNameOrUrl, parseSkinCommand } from '@/utils'
import { TeeColor } from '@/lib/Color'
import type { IColorPreset } from '@/lib/Tee'

const input = useTemplateRef('commandInput')
const hasInputChanged = ref(false)
const inputError = ref<string | null>()

const emit = defineEmits<{
  input: [value: HTMLImageElement]
  colors: [value: IColorPreset]
}>()

async function applyCommand() {
  clearError()

  const command = input.value?.value
  if (!command?.trim()) {
    setError('Please input something.')
    return
  }

  const parsed = parseSkinCommand(command)
  if (!parsed.skinName) {
    setError('Could not find a player_skin value in the command.')
    return
  }

  try {
    const img = await getSkinImageByNameOrUrl(parsed.skinName)
    hasInputChanged.value = true
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
  } catch (e) {
    setError(e instanceof Error ? e.message : 'Invalid command.')
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
  <form
    @submit.prevent=""
    novalidate
    class="needs-validation position-relative"
    :class="[hasInputChanged && 'was-validated']"
  >
    <textarea
      ref="commandInput"
      @change="applyCommand()"
      class="form-control"
      rows="2"
      placeholder="Paste the command from DDStats.tw here"
      required
    ></textarea>
    <div class="invalid-tooltip">{{ inputError }}</div>
  </form>
</template>
