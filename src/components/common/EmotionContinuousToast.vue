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

<!-- 스타일은 src/assets/styles/garden.css에 통합되어 있습니다 -->
