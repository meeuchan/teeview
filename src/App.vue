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
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 0 var(--space-4);

  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: var(--space-4) 0;
}

.header-links {
  display: flex;
  gap: var(--space-3);
}

.main {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-4);
}

.footer {
  margin-top: auto;
  padding: var(--space-6) 0 var(--space-4);
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-subtle);
}
</style>
