<template>
  <div v-if="modelValue" class="teacher-modal-overlay" @click="handleClose">
    <div class="teacher-modal-content" @click.stop>
      <div class="teacher-modal-header">
        <h3 class="teacher-modal-title">위험 상태 해지</h3>
        <button @click="handleClose" class="teacher-modal-close-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="teacher-modal-body">
        <p class="teacher-modal-description">
          <strong>{{ studentName }}</strong> 학생의 위험 상태를 해지합니다.<br>
          해지 사유를 입력해주세요.
        </p>

        <div class="teacher-form-group">
          <label for="resolve-memo" class="teacher-form-label">해지 사유 <span class="teacher-required">*</span></label>
          <textarea
            id="resolve-memo"
            v-model="memo"
            placeholder="예: 학생 상담 완료. 최근 일주일간 감정 상태 개선 확인. 학부모와 통화하여 가정 내 문제 해결 중임을 확인함."
            rows="5"
            class="teacher-form-textarea"
          ></textarea>
          <p v-if="error" class="teacher-form-error">{{ error }}</p>
        </div>
      </div>

      <div class="teacher-modal-footer">
        <button @click="handleClose" class="teacher-btn teacher-btn-cancel">
          취소
        </button>
        <button @click="handleSubmit" :disabled="isSubmitting" class="teacher-btn teacher-btn-danger">
          {{ isSubmitting ? '처리 중...' : '위험 해지' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  studentName: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'resolve'])

const memo = ref('')
const error = ref('')
const isSubmitting = ref(false)

// 모달이 닫힐 때 입력 필드 초기화
watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    memo.value = ''
    error.value = ''
    isSubmitting.value = false
  }
})

const handleClose = () => {
  if (!isSubmitting.value) {
    emit('update:modelValue', false)
  }
}

const handleSubmit = () => {
  // 유효성 검사
  if (!memo.value.trim()) {
    error.value = '해지 사유를 입력해주세요.'
    return
  }

  if (memo.value.trim().length < 10) {
    error.value = '해지 사유를 10자 이상 입력해주세요.'
    return
  }

  error.value = ''
  isSubmitting.value = true

  // 부모 컴포넌트로 이벤트 전달
  emit('resolve', memo.value.trim())
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
  background: rgba(93, 78, 55, 0.5);
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
  box-shadow: 0 8px 32px rgba(93, 78, 55, 0.3);
  max-width: 500px;
  width: 90%;
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
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #D4C4B0;
}

.teacher-modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #5D4E37;
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
  padding: 24px;
  flex: 1;
  overflow-y: auto;
}

.teacher-modal-description {
  font-size: 14px;
  color: #8B7355;
  line-height: 1.6;
  margin-bottom: 20px;
}

.teacher-modal-description strong {
  color: #5D4E37;
  font-weight: 700;
}

/* 폼 그룹 */
.teacher-form-group {
  margin-bottom: 20px;
}

.teacher-form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #5D4E37;
  margin-bottom: 8px;
}

.teacher-required {
  color: #D32F2F;
}

.teacher-form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #D4C4B0;
  border-radius: 8px;
  background: white;
  color: #5D4E37;
  font-size: 14px;
  font-family: inherit;
  line-height: 1.5;
  resize: vertical;
  transition: all 0.2s;
}

.teacher-form-textarea:focus {
  outline: none;
  border-color: #C4915C;
  box-shadow: 0 0 0 3px rgba(196, 145, 92, 0.15);
}

.teacher-form-textarea::placeholder {
  color: #A68B6A;
}

.teacher-form-error {
  font-size: 13px;
  color: #D32F2F;
  margin-top: 6px;
}

/* 모달 푸터 */
.teacher-modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #D4C4B0;
}

.teacher-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.teacher-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.teacher-btn-cancel {
  background: #F0E8D8;
  color: #8B7355;
  border: 1px solid #D4C4B0;
}

.teacher-btn-cancel:hover:not(:disabled) {
  background: #EDE3D0;
  border-color: #C4915C;
}

.teacher-btn-danger {
  background: #D32F2F;
  color: white;
}

.teacher-btn-danger:hover:not(:disabled) {
  background: #B71C1C;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
}

/* 모바일 대응 */
@media (max-width: 768px) {
  .teacher-modal-content {
    width: 95%;
    max-height: 95vh;
  }

  .teacher-modal-header {
    padding: 20px 20px 12px;
  }

  .teacher-modal-body {
    padding: 20px;
  }

  .teacher-modal-footer {
    padding: 12px 20px;
  }
}
</style>
