<script setup lang="ts">
import { useTemplateRef, watch } from 'vue'
import Button from './Button.vue'
import CloseIcon from '../icons/CloseIcon.vue'

const open = defineModel<boolean>('open', { required: true })
const dialog = useTemplateRef('dialog')

watch(open, (value) => {
  if (!dialog.value) return
  if (value && !dialog.value.open) dialog.value.showModal()
  if (!value && dialog.value.open) dialog.value.close()
})

function onBackdropClick(event: MouseEvent) {
  if (event.target === dialog.value) open.value = false
}
</script>

<template>
  <dialog ref="dialog" class="dialog" @close="open = false" @click="onBackdropClick">
    <div class="dialog-inner">
      <header class="dialog-header">
        <slot name="title"></slot>
        <Button variant="ghost" size="icon" aria-label="Close" @click="open = false">
          <CloseIcon />
        </Button>
      </header>
      <div class="dialog-body">
        <slot></slot>
      </div>
    </div>
  </dialog>
</template>

<style scoped lang="scss">
.dialog {
  width: min(520px, calc(100vw - 2rem));
  max-height: calc(100vh - 32px);
  padding: 0;
  border: var(--border);
  border-radius: 16px;
  background: var(--color-card);
  color: var(--color-text);
  box-shadow: var(--shadow);

  &[open] {
    animation: pop 0.22s cubic-bezier(0.2, 1.2, 0.4, 1);
  }

  &::backdrop {
    background: rgba(10, 8, 6, 0.5);
    backdrop-filter: blur(4px);
  }
}

.dialog-inner {
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 2rem);
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1rem 0.75rem 1.5rem;
  border-bottom: var(--border);
}

.dialog-body {
  padding: 24px;
  overflow-y: auto;
}

@keyframes pop {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.97);
  }
}
</style>
