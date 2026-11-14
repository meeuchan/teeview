<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import InputSkinFile from './inputs/InputSkinFile.vue'
import InputGameSkinUrl from './inputs/InputGameSkinUrl.vue'
import { WeaponType, WeaponTypeLabels } from '@/lib/Parts'
import type { IRendererOptions } from '@/lib/Renderer'
import { getEnumNumericKeys, getImageFromUrl } from '@/utils'
import SkinPreview from './SkinPreview.vue'
import Select from './ui/Select.vue'

export type IWeaponOptions = Pick<IRendererOptions, 'gameSkin' | 'weapon'>

type GameSkinInputMode = 'default' | 'file' | 'url'

const modes: { label: string; value: GameSkinInputMode }[] = [
  { label: 'Default', value: 'default' },
  { label: 'File', value: 'file' },
  { label: 'URL', value: 'url' },
]

const weapons = getEnumNumericKeys(WeaponType)
const weaponOptions = weapons.map((weapon) => ({
  label: WeaponTypeLabels[weapon as WeaponType],
  value: weapon,
}))

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

watch(mode, (value) => {
  if (value === 'default') loadDefault()
})

watch(selectedWeapon, () => buildOptions())

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
  <div class="panel">
    <div class="field">
      <span class="field-label">Weapon</span>
      <Select v-model="selectedWeapon" :options="weaponOptions" label="Weapon" />
    </div>

    <div class="container">
      <div class="skin-loader-container">
        <div class="field">
          <span class="field-label">Load Gameskin From</span>
          <Select v-model="mode" :options="modes" label="Gameskin source" />
        </div>
        <InputSkinFile v-if="mode === 'file'" @input="setGameSkin($event)" />
        <InputGameSkinUrl v-if="mode === 'url'" @input="setGameSkin($event)" />
      </div>

      <div>
        <SkinPreview :image="gameSkin" label="Current skin" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.container {
  display: grid;
  gap: 16px;
  align-items: start;

  @media (min-width: 720px) {
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
  }
}

.skin-loader-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
