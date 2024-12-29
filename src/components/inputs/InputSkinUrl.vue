<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { getImageFromUrl } from '@/utils'

const input = useTemplateRef('fileInput')
const hasInputChanged = ref(false)
const inputError = ref<string | null>()

const emit = defineEmits<{
  input: [value: HTMLImageElement]
}>()

async function getSkin() {
  clearError()

  let url = input.value?.value
  if (!url?.startsWith('http')) {
    url = 'https://ddnet.org/skins/skin/' + url + '.png'
  }

  if (!url) {
    setError('Please input something.')
    return
  }

  try {
    const img = await getImageFromUrl(url)
    img.setAttribute('name', url)
    img.setAttribute('lastModified', 'x')

    if (img.width / img.height !== 2 || img.width < 256 || img.height < 128) {
      setError('The image must have a 2:1 size ratio and a minimum size of 256x128px.')
      return
    }

    hasInputChanged.value = true
    emit('input', img)
  } catch {
    setError('Invalid URL or skin name.')
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
    <div class="input-group has-validation">
      <span class="input-group-text" id="basic-addon1">URL/Name</span>
      <input ref="fileInput" type="text" @change="getSkin()" class="form-control me-1" required />
      <div class="invalid-tooltip">{{ inputError }}</div>
    </div>
  </form>
</template>
