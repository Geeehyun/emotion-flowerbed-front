<template>
  <BaseModal
    v-model="isOpen"
    title="감정 무드미터란?"
    max-width="600px"
    @close="handleClose"
  >
    <template #default>
          <!-- 소개 섹션 -->
          <div class="guide-section">
            <h3 class="section-title">감정 무드미터는 무엇인가요?</h3>
            <p class="section-text">
              감정 무드미터는 예일대학교에서 개발한 감정 인식 도구로,
              우리의 복잡한 감정을 <strong>에너지 수준</strong>과 <strong>쾌/불쾌 정도</strong>로
              분류하여 이해하기 쉽게 만들어줍니다.
            </p>
          </div>

          <!-- 4가지 영역 -->
          <div class="guide-section">
            <h3 class="section-title">4가지 감정 영역</h3>
            <div class="mood-quadrants">
              <div class="quadrant red">
                <div class="quadrant-icon">🔥</div>
                <div class="quadrant-name">빨강 영역</div>
                <div class="quadrant-desc">높은 에너지 + 불쾌한 감정</div>
                <div class="quadrant-emotions">화남, 짜증, 불안, 긴장</div>
              </div>
              <div class="quadrant yellow">
                <div class="quadrant-icon">⭐</div>
                <div class="quadrant-name">노랑 영역</div>
                <div class="quadrant-desc">높은 에너지 + 즐거운 감정</div>
                <div class="quadrant-emotions">행복, 신남, 기쁨, 설렘</div>
              </div>
              <div class="quadrant blue">
                <div class="quadrant-icon">💙</div>
                <div class="quadrant-name">파랑 영역</div>
                <div class="quadrant-desc">낮은 에너지 + 불쾌한 감정</div>
                <div class="quadrant-emotions">슬픔, 우울, 지침, 외로움</div>
              </div>
              <div class="quadrant green">
                <div class="quadrant-icon">🌿</div>
                <div class="quadrant-name">초록 영역</div>
                <div class="quadrant-desc">낮은 에너지 + 즐거운 감정</div>
                <div class="quadrant-emotions">평온, 편안, 여유, 만족</div>
              </div>
            </div>
          </div>

          <!-- 사용 방법 -->
          <div class="guide-section">
            <h3 class="section-title">어떻게 활용하나요?</h3>
            <div class="usage-steps">
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <div class="step-title">지금 느끼는 감정 파악하기</div>
                  <div class="step-desc">내 감정이 어느 영역에 있는지 확인해보세요</div>
                </div>
              </div>
              <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <div class="step-title">감정 일기 작성하기</div>
                  <div class="step-desc">오늘의 감정을 일기로 기록해보세요</div>
                </div>
              </div>
              <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <div class="step-title">감정 패턴 발견하기</div>
                  <div class="step-desc">화단에 심어진 꽃들로 나의 감정 흐름을 파악해요</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 하단 메시지 -->
          <div class="guide-footer">
            <p class="footer-message">
              💡 감정에는 좋고 나쁨이 없어요.<br />
              모든 감정을 인정하고 이해하는 것이 중요합니다!
            </p>
          </div>
    </template>

    <template #footer>
      <button class="confirm-btn" @click="handleClose">
        확인했어요
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
