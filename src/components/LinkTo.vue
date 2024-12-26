<script setup lang="ts">
const props = defineProps<{
  href: string
}>()
</script>

<template>
  <a
    :href="props.href"
    target="_blank"
    class="link-underline link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover"
    ><slot></slot
  ></a>
</template>
