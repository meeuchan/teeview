<script setup lang="ts">
import { ref } from 'vue'
import Tab from './tabs/Tab.vue'
import Tabs from './tabs/Tabs.vue'
import TeeOptionsSkin from './TeeOptionsSkin.vue'

const skin = ref<HTMLImageElement>()
</script>

<template>
  <div id="teeOptions" class="card">
    <Tabs>
      <Tab title="Skin" class="card-body">
        <TeeOptionsSkin @change="skin = $event" />
      </Tab>
      <Tab title="Color" class="card-body">
        <div>B</div>
      </Tab>
      <Tab title="Options" disabled class="card-body"></Tab>
    </Tabs>
  </div>
</template>

<style lang="scss" scoped>
#teeOptions {
  height: 256px;
}
</style>
