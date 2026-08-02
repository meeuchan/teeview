<script setup lang="ts">
import { onMounted, ref } from 'vue'
import InputSkinFile from './inputs/InputSkinFile.vue'
import InputGameSkinUrl from './inputs/InputGameSkinUrl.vue'
import { WeaponType, WeaponTypeLabels } from '@/lib/Parts'
import type { IRendererOptions } from '@/lib/Renderer'
import { getEnumNumericKeys, getImageFromUrl } from '@/utils'

export type IWeaponOptions = Pick<IRendererOptions, 'gameSkin' | 'weapon'>

type GameSkinInputMode = 'default' | 'file' | 'url'

const weapons = getEnumNumericKeys(WeaponType)

const mode = ref<GameSkinInputMode>('default')
const gameSkin = ref<HTMLImageElement>()
const selectedWeapon = ref(weapons[0])

const emit = defineEmits<{
  change: [value: IWeaponOptions]
}>()

function setGameSkin(img: HTMLImageElement) {
  gameSkin.value = img
  buildOptions()
}

async function loadDefault() {
  const img = await getImageFromUrl(`${import.meta.env.BASE_URL}game.png`)
  setGameSkin(img)
}

function onModeChange() {
  if (mode.value === 'default') loadDefault()
}

function buildOptions() {
  const options: IWeaponOptions = {
    gameSkin: gameSkin.value,
    weapon: selectedWeapon.value,
  }
  emit('change', options)
}

onMounted(async () => {
  await loadDefault()
})
</script>

<template>
  <div class="container-fluid g-0">
    <div class="row mb-3">
      <div class="col-sm mb-3 mb-md-0">
        <div class="d-flex align-items-center mb-3">
          <span class="me-2">From:</span>
          <div class="btn-group btn-group-sm" role="group" aria-label="Gameskin input mode">
            <input id="gameSkinModeDefault" type="radio" class="btn-check" value="default" v-model="mode"
              @change="onModeChange()" autocomplete="off" />
            <label class="btn btn-outline-primary" for="gameSkinModeDefault">Default</label>

            <input id="gameSkinModeFile" type="radio" class="btn-check" value="file" v-model="mode"
              autocomplete="off" />
            <label class="btn btn-outline-primary" for="gameSkinModeFile">File</label>

            <input id="gameSkinModeUrl" type="radio" class="btn-check" value="url" v-model="mode" autocomplete="off" />
            <label class="btn btn-outline-primary" for="gameSkinModeUrl">URL</label>
          </div>
        </div>

        <div class="gameSkinInput mb-3">
          <InputSkinFile v-if="mode === 'file'" @input="setGameSkin($event)" />
          <InputGameSkinUrl v-if="mode === 'url'" @input="setGameSkin($event)" />
        </div>

        <label for="weaponInput" class="form-label">Weapon:</label>
        <select id="weaponInput" v-model="selectedWeapon" @change="buildOptions()" class="form-select">
          <option v-for="weapon in weapons" :key="weapon" :value="weapon">
            {{ WeaponTypeLabels[weapon as WeaponType] }}
          </option>
        </select>
      </div>
      <div class="col-sm text-center text-md-end">
        <img id="gameSkinPreview" :src="gameSkin?.src" v-if="gameSkin?.src" class="img-thumbnail" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gameSkinInput {
  min-height: 38px;
}

#gameSkinPreview {
  max-height: 128px;
}
</style>
