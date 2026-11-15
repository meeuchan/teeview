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

.title-name {
  font-size: 1.35rem;
  font-weight: var(--font-weight-black);
}

.title-version {
  padding: 0.1rem var(--space-2);
  border-radius: var(--radius-full);
  background: var(--color-pill);
  color: var(--color-subtle);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
}

section + section {
  margin-top: var(--space-6);
}

h3 {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-extrabold);
  letter-spacing: var(--letter-spacing-caps);
  text-transform: uppercase;
  color: var(--color-subtle);
  margin-bottom: var(--space-2);
}

.muted {
  color: var(--color-subtle);
}

p {
  font-size: 0.95rem;
}

.role {
  font-size: var(--font-size-sm);
}

.developer {
  margin-bottom: var(--space-3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-xl);
  background: var(--color-surface);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-4);
}

.sources {
  margin: var(--space-2) 0 0;
  padding-left: 1.25rem;

  li + li {
    margin-top: 0.2rem;
  }
}

.thanks {
  display: grid;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-xl);
    background: var(--color-surface);
  }
}
</style>
