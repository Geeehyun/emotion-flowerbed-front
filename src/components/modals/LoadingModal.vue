<template>
  <div v-if="modelValue" class="modal active loading-modal">
    <div class="loading-content">
      <div class="loading-flower">🌱</div>
      <div class="loading-text">AI가 당신의 감정을 분석하고 있어요...</div>
      <div class="loading-spinner">
        <div class="flower-grow"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})
</script>
