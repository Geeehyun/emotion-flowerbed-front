<template>
  <BaseModal
    v-model="isOpen"
    title="감정 무드미터란?"
    max-width="600px"
    @close="handleClose"
  >
    <template #default>
          <div class="card-slider-container">
            <!-- 카드 슬라이더 -->
            <div
              class="card-slider"
              @touchstart="handleTouchStart"
              @touchmove="handleTouchMove"
              @touchend="handleTouchEnd"
            >
              <div
                class="cards-wrapper"
                :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
              >
                <!-- 카드 1: 감정을 아는 게 왜 중요할까요 -->
                <div class="guide-card section-importance">
                  <div class="card-emoji">💛</div>
                  <h3 class="card-title">내 감정을 아는 게<br />왜 중요할까요?</h3>
                  <p class="card-subtitle">
                    내 감정을 알면 좋은 점이 아주 많아요!
                  </p>
                  <div class="benefits-grid">
                    <div class="benefit-card">
                      <div class="benefit-emoji">🧩</div>
                      <div class="benefit-text">마음이 복잡할 때<br />정리가 돼요</div>
                    </div>
                    <div class="benefit-card">
                      <div class="benefit-emoji">💬</div>
                      <div class="benefit-text">친구에게 화났을 때<br />말로 설명할 수 있어요</div>
                    </div>
                    <div class="benefit-card">
                      <div class="benefit-emoji">🎯</div>
                      <div class="benefit-text">쉬어야 할지<br />힘낼지 알 수 있어요</div>
                    </div>
                    <div class="benefit-card">
                      <div class="benefit-emoji">🤝</div>
                      <div class="benefit-text">어른들이 나를<br />더 잘 도와줄 수 있어요</div>
                    </div>
                  </div>
                </div>

                <!-- 카드 2: 도입부 -->
                <div class="guide-card section-intro">
                  <div class="card-emoji">✨</div>
                  <div class="story-box">
                    <p class="story-text">
                      우리 마음에는 매일매일<br />
                      여러 가지 감정이 있어요
                    </p>
                    <div class="emotion-bubbles">
                      <span class="bubble">😊 기쁠 때</span>
                      <span class="bubble">🎉 신날 때</span>
                      <span class="bubble">😢 속상할 때</span>
                    </div>
                  </div>
                  <div class="question-box">
                    <div class="question-icon">🤔</div>
                    <p class="question-text">
                      "내가 지금 왜 이런 기분이지?"<br />
                      "이게 어떤 감정일까?"
                    </p>
                  </div>
                  <div>
                    <p class="answer-text">
                      그럴 때 도와주는 친구가 <strong>감정 무드미터</strong>예요!
                    </p>
                  </div>
                </div>

                <!-- 카드 3: 감정 무드미터 소개 -->
                <div class="guide-card section-definition">
                  <h3 class="card-title">감정 무드미터는<br />무엇인가요?</h3>
                  <div class="definition-box">
                    <div class="definition-placeholder">
                      <img src="@/assets/images/emotion-moodmeter.png" alt="감정 무드 미터" class="definition-image" loading="lazy"/>
                    </div>
                    <p class="definition-text">
                      지금 내 마음 상태를<br />
                      <span class="highlight">색</span>과 <span class="highlight">감정 이름</span>으로<br />
                      알려주는 지도예요
                    </p>
                  </div>
                  <div class="colors-display">
                    <div class="color-item">
                      <div class="color-circle red"></div>
                      <span>빨강</span>
                    </div>
                    <div class="color-item">
                      <div class="color-circle yellow"></div>
                      <span>노랑</span>
                    </div>
                    <div class="color-item">
                      <div class="color-circle blue"></div>
                      <span>파랑</span>
                    </div>
                    <div class="color-item">
                      <div class="color-circle green"></div>
                      <span>초록</span>
                    </div>
                  </div>
                </div>

                <!-- 카드 4: 감정화단 사용법 -->
                <div class="guide-card section-usage">
                  <div class="card-emoji">✏️</div>
                  <h3 class="card-title">감정화단은<br />이렇게 사용해요!</h3>
                  <div class="steps-container">
                    <div class="cute-step">
                      <div class="step-circle">1</div>
                      <div class="step-emoji">💭</div>
                      <div class="step-box">
                        <div class="step-title">오늘의 하루를 떠올려요</div>
                        <div class="step-desc">기억에 남는 일을 일기로 써요</div>
                      </div>
                    </div>
                    <div class="step-arrow">↓</div>
                    <div class="cute-step">
                      <div class="step-circle">2</div>
                      <div class="step-emoji">🤖</div>
                      <div class="step-box">
                        <div class="step-title">AI가 일기를 분석해요</div>
                        <div class="step-desc">감정에 어울리는 🌼꽃을 알려줘요</div>
                      </div>
                    </div>
                    <div class="step-arrow">↓</div>
                    <div class="cute-step">
                      <div class="step-circle">3</div>
                      <div class="step-emoji">🌺</div>
                      <div class="step-box">
                        <div class="step-title">나만의 감정 꽃 완성!</div>
                        <div class="step-desc">내 감정을 나타내는 특별한 꽃이에요</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 카드 5: 하단 메시지 -->
                <div class="guide-card section-footer">
                  <div class="final-message">
                    <div class="message-icon">✨</div>
                    <h3 class="final-title">기억하세요!</h3>
                    <div class="message-content">
                      <div class="message-item">
                        <p>감정에는 좋고 나쁨이 없어요</p>
                      </div>
                      <div class="message-item">
                        <p>모든 감정은 소중해요</p>
                      </div>
                      <div class="message-item">
                        <p>감정을 인정하고 이해하는 게 중요해요</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 네비게이션 버튼 -->
            <button
              v-if="currentIndex > 0"
              class="nav-btn nav-btn-prev"
              @click="prevCard"
            >
              ‹
            </button>
            <button
              v-if="currentIndex < totalCards - 1"
              class="nav-btn nav-btn-next"
              @click="nextCard"
            >
              ›
            </button>

            <!-- 페이지 인디케이터 -->
            <div class="card-indicators">
              <span
                v-for="(card, index) in totalCards"
                :key="index"
                class="indicator-dot"
                :class="{ active: currentIndex === index }"
                @click="goToCard(index)"
              ></span>
            </div>
          </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
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

// 카드 슬라이더 상태
const currentIndex = ref(0)
const totalCards = 5
let touchStartX = 0
let touchEndX = 0

// 카드 네비게이션
const nextCard = () => {
  if (currentIndex.value < totalCards - 1) {
    currentIndex.value++
  }
}

const prevCard = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const goToCard = (index) => {
  currentIndex.value = index
}

// 터치 이벤트 핸들러
const handleTouchStart = (e) => {
  touchStartX = e.touches[0].clientX
}

const handleTouchMove = (e) => {
  touchEndX = e.touches[0].clientX
}

const handleTouchEnd = () => {
  const swipeThreshold = 50
  const diff = touchStartX - touchEndX

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // 왼쪽으로 스와이프 (다음 카드)
      nextCard()
    } else {
      // 오른쪽으로 스와이프 (이전 카드)
      prevCard()
    }
  }
}

// 키보드 네비게이션
const handleKeyDown = (e) => {
  if (!props.modelValue) return

  if (e.key === 'ArrowLeft') {
    prevCard()
  } else if (e.key === 'ArrowRight') {
    nextCard()
  }
}

// 모달이 열릴 때 키보드 이벤트 리스너 추가
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    window.addEventListener('keydown', handleKeyDown)
  } else {
    window.removeEventListener('keydown', handleKeyDown)
  }
})

onMounted(() => {
  if (props.modelValue) {
    window.addEventListener('keydown', handleKeyDown)
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

const handleClose = () => {
  currentIndex.value = 0 // 모달 닫을 때 첫 카드로 리셋
  emit('update:modelValue', false)
}
</script>
