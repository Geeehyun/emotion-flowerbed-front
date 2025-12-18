<template>
  <transition name="slide-toast">
    <div v-if="isVisible" class="emotion-toast-container">
      <!-- 말풍선 -->
      <div class="speech-bubble">
        <button class="toast-close-btn" @click="close">
          <XMarkIcon class="w-4 h-4" />
        </button>
        <div class="toast-content">
          <div class="toast-emotion">
            <span class="emotion-icon">{{ emotionIcon }}</span>
            <span class="emotion-text">{{ emotionName }} 감정이 <strong>{{ consecutiveDays }}일째</strong>네요!</span>
          </div>
          <div class="toast-suggestion">
            <span class="activity-icon">{{ activityIcon }}</span>
            <span class="activity-text">{{ activityName }}을(를) 해보는 건 어때요?</span>
          </div>
        </div>
      </div>

      <!-- 물뿌리개 이미지 -->
      <div class="watering-can">
        <img src="@/assets/images/watering-can.png" alt="물뿌리개" class="watering-can-image" />
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  emotionName: {
    type: String,
    required: true
  },
  emotionIcon: {
    type: String,
    default: '🌸'
  },
  consecutiveDays: {
    type: Number,
    required: true
  },
  activityName: {
    type: String,
    required: true
  },
  activityIcon: {
    type: String,
    required: true
  },
  autoClose: {
    type: Boolean,
    default: true
  },
  duration: {
    type: Number,
    default: 7000 // 7초
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const isVisible = ref(false)
let autoCloseTimer = null

watch(() => props.modelValue, (newVal) => {
  isVisible.value = newVal

  if (newVal && props.autoClose) {
    // 자동 닫기 타이머 설정
    if (autoCloseTimer) clearTimeout(autoCloseTimer)
    autoCloseTimer = setTimeout(() => {
      close()
    }, props.duration)
  }
}, { immediate: true })

const close = () => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
    autoCloseTimer = null
  }
  isVisible.value = false
  emit('update:modelValue', false)
  emit('close')
}

// 컴포넌트 언마운트 시 타이머 정리
onMounted(() => {
  return () => {
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer)
    }
  }
})
</script>

<style scoped>
.emotion-toast-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  pointer-events: auto;
}

/* 말풍선 */
.speech-bubble {
  position: relative;
  background: white;
  border-radius: 20px;
  padding: 20px 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  max-width: 320px;
  border: 2px solid #7ED957;
}

/* 말풍선 꼬리 (물뿌리개를 향하도록) */
.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -12px;
  right: 40px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 12px 12px 0 12px;
  border-color: white transparent transparent transparent;
  filter: drop-shadow(0 3px 2px rgba(0, 0, 0, 0.1));
}

.speech-bubble::before {
  content: '';
  position: absolute;
  bottom: -16px;
  right: 38px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 14px 14px 0 14px;
  border-color: #7ED957 transparent transparent transparent;
  z-index: -1;
}

.toast-close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #9CA3AF;
  transition: color 0.2s ease;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.toast-close-btn:hover {
  color: #4B5563;
  background: #F3F4F6;
}

.toast-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toast-emotion {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'LeeSeoyun', cursive;
  font-size: 15px;
  color: #2D3748;
}

.emotion-icon {
  font-size: 24px;
}

.emotion-text strong {
  color: #FF6B6B;
  font-weight: 700;
}

.toast-suggestion {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #F0FFF4 0%, #ECFDF5 100%);
  border-radius: 12px;
  font-family: 'LeeSeoyun', cursive;
  font-size: 14px;
  color: #2D3748;
  border: 1px solid #7ED957;
}

.activity-icon {
  font-size: 20px;
}

.activity-text {
  font-weight: 600;
  color: #059669;
}

/* 물뿌리개 */
.watering-can {
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
  animation: gentle-bounce 2s ease-in-out infinite;
}

.watering-can-image {
  width: 80px;
  height: auto;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

/* 애니메이션 */
@keyframes gentle-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* 슬라이드 인/아웃 애니메이션 */
.slide-toast-enter-active {
  animation: slide-in-right 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.slide-toast-leave-active {
  animation: slide-out-right 0.4s ease-in-out;
}

@keyframes slide-in-right {
  from {
    transform: translateX(120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-out-right {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(120%);
    opacity: 0;
  }
}

/* 모바일 최적화 */
@media (max-width: 480px) {
  .emotion-toast-container {
    bottom: 20px;
    right: 20px;
    left: 20px;
  }

  .speech-bubble {
    max-width: 100%;
    padding: 16px 20px;
  }

  .toast-emotion {
    font-size: 14px;
  }

  .emotion-icon {
    font-size: 20px;
  }

  .toast-suggestion {
    font-size: 13px;
    padding: 10px 14px;
  }

  .activity-icon {
    font-size: 18px;
  }

  .watering-can-image {
    width: 60px;
  }

  .speech-bubble::after {
    right: 30px;
  }

  .speech-bubble::before {
    right: 28px;
  }
}
</style>
