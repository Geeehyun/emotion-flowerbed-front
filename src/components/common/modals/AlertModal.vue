<template>
  <div v-if="modelValue" class="modal active alert-modal">
    <div class="alert-content">
      <div class="alert-icon">
        <!-- Success 아이콘 -->
        <svg v-if="type === 'success'" class="icon-svg success" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        <!-- Error 아이콘 -->
        <svg v-else-if="type === 'error'" class="icon-svg error" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M8 8L16 16M16 8L8 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>

        <!-- Info 아이콘 -->
        <svg v-else-if="type === 'info'" class="icon-svg info" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M12 11V17M12 7V8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>

        <!-- Delete 아이콘 -->
        <svg v-else-if="type === 'delete'" class="icon-svg delete" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 6H21M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6M10 11V17M14 11V17M5 6L6 19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19L19 6H5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
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
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error', 'info', 'delete'].includes(value)
  }
})

defineEmits(['close'])
</script>
