<script setup lang="ts">
import { ref } from 'vue'
import TeeFace from './TeeFace.vue'
import LinkTo from './LinkTo.vue'
import GitHubIcon from './icons/GitHubIcon.vue'
import KofiIcon from './icons/KofiIcon.vue'
import Button from './ui/Button.vue'
import Dialog from './ui/Dialog.vue'
import { version } from '../../package.json'
import InfoIcon from './icons/InfoIcon.vue'

const open = ref(false)

const skinSources = [
  'https://skins.ddstats.tw/',
  'https://ddnet.org/skins/skin/community/',
  'https://ddnet.org/skins/skin/',
]

const thanks = [
  { name: 'Skeith', role: 'Accuracy Checker' },
  { name: 'Broso56', role: 'Tester' },
  { name: 'Dotu', role: 'Emotional Support' },
]
</script>

<template>
  <Button variant="ghost" size="icon" aria-label="About TeeView" title="About" @click="open = true">
    <InfoIcon />
  </Button>

  <Dialog v-model:open="open">
    <template #title>
      <div class="title">
        <span class="title-name">TeeView</span>
        <span class="title-version">v{{ version }}</span>
      </div>
    </template>

    <section>
      <div class="developer">
        <TeeFace name="Meeu" />
        <span class="role muted">Developer</span>
      </div>
      <p>
        I developed this tool primarily to create Discord emotes (which I call Teemojis). I then
        realized it would be a fun tool to release to the DDNet community for everyone to use. If
        you find any bugs, please report it to the GitHub page. Enjoy!
      </p>
      <div class="actions">
        <Button href="https://github.com/meeuchan/teeview"> <GitHubIcon /> GitHub </Button>
        <Button href="https://ko-fi.com/meeuchan"> <KofiIcon /> Support on Ko-fi </Button>
      </div>
    </section>

    <section>
      <h3>Skin databases</h3>
      <p class="muted">When fetching skins by name, TeeView tries these sources in order:</p>
      <ol class="sources">
        <li v-for="source in skinSources" :key="source">
          <LinkTo :href="source">{{ source.replace('https://', '') }}</LinkTo>
        </li>
      </ol>
    </section>

    <section>
      <h3>Special thanks</h3>
      <ul class="thanks">
        <li v-for="person in thanks" :key="person.name">
          <TeeFace :name="person.name" />
          <span class="role muted">{{ person.role }}</span>
        </li>
      </ul>
    </section>
  </Dialog>
</template>

<style scoped lang="scss">
.title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.title-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.title-name {
  font-size: 1.35rem;
  font-weight: 900;
}

.title-version {
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  background: var(--color-pill);
  color: var(--color-subtle);
  font-size: 0.75rem;
  font-weight: 700;
}

section + section {
  margin-top: 1.5rem;
}

h3 {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.075em;
  text-transform: uppercase;
  color: var(--color-subtle);
  margin-bottom: 8px;
}

.muted {
  color: var(--color-subtle);
}

p {
  font-size: 0.95rem;
}

.role {
  font-size: 0.8rem;
}

.developer {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 16px;
  background: var(--color-surface);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.sources {
  margin: 0.5rem 0 0;
  padding-left: 1.25rem;

  li + li {
    margin-top: 0.2rem;
  }
}

.thanks {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border-radius: 16px;
    background: var(--color-surface);
  }
}
</style>
