<script setup lang="ts">
const props = defineProps<{
  href: string
}>()
</script>

<template>
  <a :href="props.href" target="_blank" rel="noopener" class="link"><slot></slot></a>
</template>

<style scoped>
.link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-primary);
  font-weight: var(--font-weight-bold);
  text-decoration: none;
  text-underline-offset: 3px;
}

.link:hover {
  text-decoration: underline;
}
</style>
