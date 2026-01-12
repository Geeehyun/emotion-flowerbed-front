<template>
  <div v-if="modelValue" class="teacher-modal-overlay" @click="handleBackgroundClick">
    <div class="teacher-modal-content" :style="{ maxWidth: maxWidth }" @click.stop>
      <!-- 헤더 -->
      <div class="teacher-modal-header">
        <slot name="header">
          <div>
            <h3 class="teacher-modal-title">{{ title }}</h3>
            <p v-if="subtitle" class="teacher-modal-subtitle">{{ subtitle }}</p>
          </div>
        </slot>
        <button @click="handleClose" class="teacher-modal-close-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 본문 -->
      <div class="teacher-modal-body">
        <slot></slot>
      </div>

      <!-- 푸터 (선택사항) -->
      <div v-if="$slots.footer" class="teacher-modal-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  maxWidth: {
    type: String,
    default: '900px'
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const handleBackgroundClick = (e) => {
  if (e.target.classList.contains('teacher-modal-overlay')) {
    handleClose()
  }
}

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}
</script>
