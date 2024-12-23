<script setup lang="ts">
import DarkModeButton from './components/DarkModeButton.vue'
import QuestionIcon from './components/icons/QuestionIcon.vue'
import TeeOptions from './components/TeeOptions.vue'
import TeeView from './components/TeeView.vue'
</script>

<template>
  <div class="app-container">
    <div class="container">
      <div class="row justify-content-between">
        <div class="col">
          <h1>TeeView</h1>
        </div>
        <div class="col d-flex justify-content-end align-items-center">
          <DarkModeButton />
          <button type="button" class="btn btn-primary btn-sm rounded-pill ms-2">
            <QuestionIcon />
          </button>
        </div>
      </div>

      <div class="row mb-2">
        <div class="col">
          <TeeView />
        </div>
      </div>

      <div class="row">
        <div class="col">
          <TeeOptions />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
