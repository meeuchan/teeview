<script setup lang="ts">
import { ref } from 'vue'
import InfoButton from './components/InfoButton.vue'
import TeeOptions from './components/TeeOptions.vue'
import TeeView from './components/TeeView.vue'
import type { IRendererOptions } from './lib/Renderer'
import KofiIcon from './components/icons/KofiIcon.vue'
import GitHubIcon from './components/icons/GitHubIcon.vue'
import Button from './components/ui/Button.vue'
import LinkTo from './components/LinkTo.vue'

const options = ref<IRendererOptions>()
const result = ref<HTMLCanvasElement>()
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>TeeView</h1>
      <div class="header-links">
        <Button
          href="https://github.com/meeuchan/teeview"
          variant="ghost"
          size="icon"
          title="Open GitHub Repo"
        >
          <GitHubIcon />
        </Button>
        <Button
          href="https://ko-fi.com/meeuchan"
          variant="ghost"
          size="icon"
          title="Support Me on Ko-fi"
        >
          <KofiIcon />
        </Button>
        <InfoButton />
      </div>
    </header>

    <main class="main">
      <div>
        <TeeView :options="options" @change="result = $event" />
      </div>
      <aside>
        <TeeOptions :result="result" @change="options = $event" />
      </aside>
    </main>

    <footer class="footer">
      Made by <LinkTo href="https://github.com/meeuchan">Meeu</LinkTo> ·
      <LinkTo href="https://ko-fi.com/meeuchan">Support on Ko-fi</LinkTo>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.app {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 0 16px;

  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 16px 0;
}

.header-links {
  display: flex;
  gap: 12px;
}

.main {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
}

.footer {
  margin-top: auto;
  padding: 24px 0 16px;
  text-align: center;
  font-size: 0.8rem;
  color: var(--color-subtle);
}
</style>
