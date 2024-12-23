<script setup lang="ts">
import { ref } from 'vue'
import MoonIcon from './icons/MoonIcon.vue'
import SunIcon from './icons/SunIcon.vue'

const htmlNode = document.documentElement
const darkMode = ref(!!localStorage.getItem('dark-mode'))

function setDarkMode(isDarkMode: boolean) {
  if (isDarkMode) {
    htmlNode.setAttribute('data-bs-theme', 'dark')
    localStorage.setItem('dark-mode', 'true')
    darkMode.value = true
  } else {
    htmlNode.removeAttribute('data-bs-theme')
    localStorage.removeItem('dark-mode')
    darkMode.value = false
  }
}

function toggleDarkMode() {
  setDarkMode(!darkMode.value)
}

setDarkMode(darkMode.value)
</script>

<template>
  <button type="button" class="btn btn-warning btn-sm rounded-pill ms-2" @click="toggleDarkMode">
    <MoonIcon v-if="darkMode" />
    <SunIcon v-else />
  </button>
</template>
