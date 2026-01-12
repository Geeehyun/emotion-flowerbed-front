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

<style scoped>
/* 모달 오버레이 */
.teacher-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 모달 컨텐츠 */
.teacher-modal-content {
  background: #F8F3E8;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  max-width: 95vw;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 모달 헤더 */
.teacher-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #D4C4B0;
}

.teacher-modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #5D4E37;
  margin: 0 0 4px 0;
}

.teacher-modal-subtitle {
  font-size: 13px;
  color: #8B7355;
  margin: 0;
}

.teacher-modal-close-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: none;
  border: 1px solid #D4C4B0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.teacher-modal-close-btn:hover {
  background: #F0E8D8;
}

.teacher-modal-close-btn svg {
  width: 20px;
  height: 20px;
  color: #5D4E37;
}

/* 모달 바디 */
.teacher-modal-body {
  padding: 16px;
  flex: 1;
  overflow-y: auto;
}

/* 모달 푸터 */
.teacher-modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #D4C4B0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

/* 데스크톱 스타일 */
@media (min-width: 769px) {
  .teacher-modal-header {
    padding: 24px 32px;
  }

  .teacher-modal-title {
    font-size: 22px;
  }

  .teacher-modal-subtitle {
    font-size: 15px;
  }

  .teacher-modal-body {
    padding: 24px 32px;
  }

  .teacher-modal-footer {
    padding: 20px 32px;
  }
}
</style>
