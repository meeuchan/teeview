<script setup lang="ts">
import { ref } from 'vue'
import InfoButton from './components/InfoButton.vue'
import TeeOptions from './components/TeeOptions.vue'
import TeeView from './components/TeeView.vue'
import type { IRendererOptions } from './lib/Renderer'
import KofiIcon from './components/icons/KofiIcon.vue'
import GitHubIcon from './components/icons/GitHubIcon.vue'
import Button from './components/ui/Button.vue'

const options = ref<IRendererOptions>()
const result = ref<HTMLCanvasElement>()
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>TeeView</h1>
      <div class="header-links">
        <Button href="https://github.com/meeuchan/teeview" variant="ghost" size="icon" title="Open GitHub Repo">
          <GitHubIcon />
        </Button>
        <Button href="https://ko-fi.com/meeuchan" variant="ghost" size="icon" title="Support Me on Ko-fi">
          <KofiIcon />
        </Button>
        <InfoButton />
      </div>
    </header>

    <div class="container">
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

<style lang="scss" scoped>
.app {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 0 16px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin: 16px 0;
}

.header-links {
  display: flex;
  gap: 12px;
}
</style>
