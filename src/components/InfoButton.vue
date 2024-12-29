<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import InfoIcon from './icons/InfoIcon.vue'
import * as bootstrap from 'bootstrap'
import TeeFace from './TeeFace.vue'
import LinkTo from './LinkTo.vue'
import GitHubIcon from './icons/GitHubIcon.vue'
import { version } from '../../package.json'

const helpModal = ref<bootstrap.Modal | null>()

onMounted(() => {
  helpModal.value = new bootstrap.Modal('#helpModal')
  helpModal.value.hide()
})

onBeforeUnmount(() => {
  helpModal.value?.dispose()
})

function openModal() {
  helpModal.value?.show()
}

function closeModal() {
  helpModal.value?.hide()
}
</script>

<template>
  <button type="button" @click="openModal()" class="btn btn-primary btn-sm ms-2">
    <InfoIcon />
  </button>

  <div class="modal fade" id="helpModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <p class="mb-0">
            <span class="modal-title fw-bold fs-3 me-2">TeeView</span>
            <span class="text-secondary">v{{ version }}</span>
          </p>
          <button type="button" @click="closeModal()" class="btn-close" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h5>Info</h5>
          <p class="mb-1">
            <LinkTo href="https://github.com/meeuchan/teeview" class="d-flex align-items-center"
              ><GitHubIcon class="me-2" />GitHub</LinkTo
            >
          </p>
          <p class="mb-2">
            Developer:
            <TeeFace name="Meeu" />
          </p>
          <p class="mb-3">
            I developed this tool primarily to create Discord emotes (which I call Teemojis). I then
            realized it would be a fun tool to release to the DDNet community for everyone to use.
            If you find any bugs, please report it to the GitHub page. Enjoy!
          </p>
          <h5>Credits</h5>
          <ul class="mb-0">
            <li>
              <TeeFace name="Skeith" />
              - Accuracy Checker
            </li>
            <li>
              <TeeFace name="Broso56" />
              - Tester
            </li>
            <li>
              <TeeFace name="Dotu" />
              - Emotional Support
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
