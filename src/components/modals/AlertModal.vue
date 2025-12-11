<template>
  <div v-if="modelValue" class="modal active alert-modal">
    <div class="alert-content">
      <div class="alert-icon">{{ icon }}</div>
      <div class="alert-message">{{ message }}</div>
      <button class="alert-button" @click="$emit('close')">확인</button>
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
    default: ''
  },
  icon: {
    type: String,
    default: '🌸'
  }
})

defineEmits(['close'])
</script>
