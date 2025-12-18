<template>
  <BaseModal
    v-model="isOpen"
    title="나의 감정 화단이란?"
    max-width="600px"
    @close="handleClose"
  >
    <template #default>
      <!-- 서비스 소개 -->
      <div class="about-section">
        <div class="feature-item">
          <div class="feature-icon">📝</div>
          <div class="feature-content">
            <h3 class="feature-title">감정 일기 작성</h3>
            <p class="feature-desc">
              오늘의 감정을 기록하면 AI가 분석하여<br />
              당신의 감정에 어울리는 꽃을 선물해요
            </p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">🌸</div>
          <div class="feature-content">
            <h3 class="feature-title">감정 화단 가꾸기</h3>
            <p class="feature-desc">
              매일 작성한 일기가 화단에 꽃으로 피어나며<br />
              나만의 아름다운 감정 정원이 만들어져요
            </p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">📊</div>
          <div class="feature-content">
            <h3 class="feature-title">감정 무드미터</h3>
            <p class="feature-desc">
              예일대학교의 감정 인식 도구를 기반으로<br />
              당신의 감정 패턴을 시각화하여 보여드려요
            </p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">📖</div>
          <div class="feature-content">
            <h3 class="feature-title">감정 도감</h3>
            <p class="feature-desc">
              다양한 감정과 꽃말을 수집하며<br />
              나의 감정 세계를 더욱 풍성하게 만들어요
            </p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">💌</div>
          <div class="feature-content">
            <h3 class="feature-title">주간 감정 레터</h3>
            <p class="feature-desc">
              일주일간의 감정을 분석하여<br />
              따뜻한 응원의 편지를 보내드려요
            </p>
          </div>
        </div>
      </div>

      <!-- 하단 메시지 -->
      <div class="about-footer">
        <p class="footer-message">
          💐 매일의 감정을 소중히 기록하고<br />
          아름다운 꽃으로 피워보세요
        </p>
      </div>
    </template>

    <template #footer>
      <button class="confirm-btn" @click="handleClose">
        시작하기
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseModal from '@/components/common/modals/BaseModal.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleClose = () => {
  emit('update:modelValue', false)
}
</script>
