<template>
  <div v-if="modelValue" class="modal active loading-modal">
    <div class="loading-backdrop" @click.stop></div>
    <div class="loading-content">
      <div class="loading-icon-wrapper">
        <div class="loading-spinner">
          <div class="spinner-dot dot-1"></div>
          <div class="spinner-dot dot-2"></div>
          <div class="spinner-dot dot-3"></div>
          <div class="spinner-dot dot-4"></div>
        </div>
      </div>
      <div class="loading-text">{{ message }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  message: {
    type: String,
    default: '로딩중...'
  }
})
</script>
