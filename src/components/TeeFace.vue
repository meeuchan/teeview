<script setup lang="ts">
import LinkTo from './LinkTo.vue'

const props = defineProps<{
  name: string
}>()
</script>

<template>
  <LinkTo :href="`https://ddnet.org/players/${props.name}/`"
    ><img :src="`/${props.name}.png`" class="tee-icon me-1" />{{ props.name }}</LinkTo
  >
</template>

<style lang="scss" scoped>
.tee-icon {
  width: 2rem;
}
</style>
