<script setup lang="ts">
import { ref } from 'vue'
import InputSkinFile from './inputs/InputSkinFile.vue'
import LinkTo from './LinkTo.vue'

const skin = ref<HTMLImageElement>()

const emit = defineEmits<{
  change: [value: HTMLImageElement]
}>()

function setSkin(img: HTMLImageElement) {
  skin.value = img
  emit('change', img)
}
</script>

<template>
  <div class="container-fluid g-0">
    <div class="row">
      <div class="col-sm mb-3 mb-md-0">
        <p>
          Get a skin from
          <LinkTo href="https://ddnet.org/skins">ddnet.org</LinkTo> or
          <LinkTo href="https://teedata.net/skins">teedata.net</LinkTo>.
        </p>
        <InputSkinFile @input="setSkin($event)" />
      </div>
      <div class="col-sm text-center text-md-end">
        <img id="skinPreview" :src="skin?.src" v-if="skin?.src" class="img-thumbnail" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#skinPreview {
  max-height: 128px;
}
</style>
