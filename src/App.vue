<script setup lang="ts">
import { ref } from 'vue'
import DarkModeButton from './components/DarkModeButton.vue'
import InfoButton from './components/InfoButton.vue'
import TeeOptions from './components/TeeOptions.vue'
import TeeView from './components/TeeView.vue'
import type { IRendererOptions } from './lib/Renderer'
import KofiIcon from './components/icons/KofiIcon.vue'
import GitHubIcon from './components/icons/GitHubIcon.vue'

const options = ref<IRendererOptions>()
const result = ref<HTMLCanvasElement>()
</script>

<template>
  <div class="app-container">
    <div class="container">
      <div class="row justify-content-between mb-1">
        <div class="col">
          <h1>TeeView</h1>
        </div>
        <div class="col d-flex justify-content-end align-items-center">
          <DarkModeButton />
          <a href="https://github.com/meeuchan/teeview" target="_blank" class="btn btn-success btn-sm ms-2">
            <GitHubIcon />
          </a>
          <a href="https://ko-fi.com/meeuchan" target="_blank" class="btn btn-danger btn-sm ms-2">
            <KofiIcon />
          </a>
          <InfoButton />
        </div>
      </div>

      <div class="row mb-2">
        <div class="col">
          <TeeView :options="options" @change="result = $event" />
        </div>
      </div>

      <div class="row">
        <div class="col">
          <TeeOptions :result="result" @change="options = $event" />
        </div>
      </div>
    </div>
  </div>
</template>
