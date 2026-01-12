<template>
  <BaseTeacherModal
    v-model="isOpen"
    title="감정 무드미터란?"
    max-width="1000px"
    @close="handleClose"
  >
    <template #default>
      <div class="teacher-modal-container">
        <!-- 상단 페이지 인디케이터 -->
        <div class="teacher-page-indicator-top">
          <span class="teacher-page-number">{{ currentIndex + 1 }}</span>
          <span class="teacher-page-divider">/</span>
          <span class="teacher-page-total">{{ totalCards }}</span>
        </div>

        <!-- 카드 슬라이더 -->
        <div
          class="teacher-card-slider"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
          @mouseleave="handleMouseLeave"
        >
          <div
            class="teacher-cards-wrapper"
            :style="{
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out'
            }"
          >
            <!-- 카드 1: 감정 무드미터 소개 -->
            <div class="teacher-info-card">
              <h3 class="teacher-card-title">감정 무드미터란?</h3>
              <div class="teacher-definition-box">

                <p class="teacher-definition-text">
                  감정 무드미터는 <strong>예일대학교 감성지능센터(Yale Center for Emotional Intelligence)</strong>에서 개발한
                  감정 인식 및 조절 도구입니다.
                </p>
                <p class="teacher-definition-text">
                  학생들의 감정 상태를 <span class="text-highlight">에너지 수준(세로축)</span>과
                  <span class="text-highlight">쾌적함 정도(가로축)</span>의 2차원 공간으로 분류하여,
                  4가지 색상 영역으로 시각화합니다.
                </p>
              </div>
              <div class="teacher-colors-grid">
                <div class="teacher-color-box red">
                  <div class="color-label">빨강 영역</div>
                  <div class="color-desc">높은 에너지 + 불쾌</div>
                  <div class="color-example">화남, 두려움, 당황</div>
                </div>
                <div class="teacher-color-box yellow">
                  <div class="color-label">노랑 영역</div>
                  <div class="color-desc">높은 에너지 + 쾌적</div>
                  <div class="color-example">기쁨, 흥분, 행복</div>
                </div>
                <div class="teacher-color-box blue">
                  <div class="color-label">파랑 영역</div>
                  <div class="color-desc">낮은 에너지 + 불쾌</div>
                  <div class="color-example">슬픔, 우울, 지침</div>
                </div>
                <div class="teacher-color-box green">
                  <div class="color-label">초록 영역</div>
                  <div class="color-desc">낮은 에너지 + 쾌적</div>
                  <div class="color-example">평온, 안정, 만족</div>
                </div>
              </div>
            </div>

            <!-- 카드 2: 교육적 의의 -->
            <div class="teacher-info-card">
              <h3 class="teacher-card-title">감정 무드미터의 교육적 의의</h3>
              <div class="teacher-importance-grid">
                <div class="importance-item">
                  <h4 class="importance-title">🧠 감정 인식 능력 향상</h4>
                  <p class="importance-desc">
                    학생들이 자신의 감정을 명확히 인식하고 언어화하는 능력을 기릅니다.
                    이는 자기 이해의 기초가 됩니다.
                  </p>
                </div>
                <div class="importance-item">
                  <h4 class="importance-title">💬 감정 표현 및 소통</h4>
                  <p class="importance-desc">
                    복잡한 감정을 색상과 이름으로 표현함으로써,
                    학생들이 자신의 감정을 타인에게 효과적으로 전달할 수 있습니다.
                  </p>
                </div>
                <div class="importance-item">
                  <h4 class="importance-title">🎨 감정 조절 전략 수립</h4>
                  <p class="importance-desc">
                    현재 감정 상태를 파악함으로써, 상황에 맞는
                    적절한 감정 조절 전략을 선택할 수 있습니다.
                  </p>
                </div>
                <div class="importance-item">
                  <h4 class="importance-title">📈 사회정서학습(SEL) 지원</h4>
                  <p class="importance-desc">
                    학급 단위의 감정 데이터를 통해 학생들의 정서적 상태를
                    파악하고 맞춤형 지도를 제공할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

            <!-- 카드 3: 감정 화단 시스템 -->
            <div class="teacher-info-card">
              <h3 class="teacher-card-title">감정 화단 시스템 구조</h3>
              <div class="teacher-system-flow">
                <div class="flow-step">
                  <div class="flow-number">1</div>
                  <div class="flow-content">
                    <h4 class="flow-title">학생 일기 작성</h4>
                    <p class="flow-desc">학생들이 하루의 경험과 감정을 자유롭게 기록합니다.</p>
                  </div>
                </div>
                <div class="flow-arrow">↓</div>
                <div class="flow-step">
                  <div class="flow-number">2</div>
                  <div class="flow-content">
                    <h4 class="flow-title">AI 기반 감정 분석</h4>
                    <p class="flow-desc">
                      LLM 기술을 활용하여 일기 내용을 분석하고,
                      감정 무드미터의 영역 및 세부 감정을 자동으로 식별합니다.
                    </p>
                  </div>
                </div>
                <div class="flow-arrow">↓</div>
                <div class="flow-step">
                  <div class="flow-number">3</div>
                  <div class="flow-content">
                    <h4 class="flow-title">감정 시각화</h4>
                    <p class="flow-desc">
                      분석된 감정에 맞는 꽃으로 시각화하여,
                      학생들이 자신의 감정을 직관적으로 이해할 수 있도록 합니다.
                    </p>
                  </div>
                </div>
                <div class="flow-arrow">↓</div>
                <div class="flow-step">
                  <div class="flow-number">4</div>
                  <div class="flow-content">
                    <h4 class="flow-title">교사 오늘의 학급 화단  제공</h4>
                    <p class="flow-desc">
                      학급 전체의 감정 분포 현황을 실시간으로 확인하여,
                      학생 지도에 활용할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 카드 4: 활용 가이드 -->
            <div class="teacher-info-card">
              <h3 class="teacher-card-title">교사 활용 가이드</h3>
              <div class="teacher-guide-section">
                <div class="guide-item">
                  <h4 class="guide-title">
                    <span class="guide-badge red">빨강 영역</span>
                    집중 관찰이 필요한 학생
                  </h4>
                  <ul class="guide-list">
                    <li>개별 상담을 통해 감정의 원인 파악</li>
                    <li>감정 조절 활동 제공 (심호흡, 신체 활동 등)</li>
                    <li>필요시 학부모 면담 또는 전문가 연계</li>
                  </ul>
                </div>
                <div class="guide-item">
                  <h4 class="guide-title">
                    <span class="guide-badge yellow">노랑 영역</span>
                    주의 관찰 대상 학생
                  </h4>
                  <ul class="guide-list">
                    <li>긍정적 에너지를 학습 동기로 전환</li>
                    <li>지나친 흥분 상태인 경우 진정 활동 제공</li>
                  </ul>
                </div>
                <div class="guide-item">
                  <h4 class="guide-title">
                    <span class="guide-badge blue">파랑 영역</span>
                    정서적 지원이 필요한 학생
                  </h4>
                  <ul class="guide-list">
                    <li>공감적 대화를 통해 감정 표현 격려</li>
                    <li>긍정적 활동 참여 유도</li>
                    <li>지속적인 관찰 및 모니터링</li>
                  </ul>
                </div>
                <div class="guide-item">
                  <h4 class="guide-title">
                    <span class="guide-badge green">초록 영역</span>
                    정서적으로 안정된 학생
                  </h4>
                  <ul class="guide-list">
                    <li>현재 상태 유지 격려</li>
                    <li>또래 지원 활동 참여 유도</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- 카드 5: 참고 사항 -->
            <div class="teacher-info-card">
              <h3 class="teacher-card-title">활용 시 유의사항</h3>
              <div class="teacher-notice-section">
                <div class="notice-box important">
                  <h4 class="notice-title">⚠️ 중요</h4>
                  <ul class="notice-list">
                    <li>감정 데이터는 <strong>참고 자료</strong>이며, 학생을 평가하는 절대적 기준이 아닙니다.</li>
                    <li>모든 감정은 자연스러운 것이며, 특정 감정이 좋거나 나쁘다는 판단을 지양합니다.</li>
                    <li>학생의 개인정보 보호를 위해 감정 데이터를 외부에 공유하지 않습니다.</li>
                  </ul>
                </div>
                <div class="notice-box tip">
                  <h4 class="notice-title">💡 활용 팁</h4>
                  <ul class="notice-list">
                    <li>일일 감정 분포를 정기적으로 확인하여 학급 분위기를 파악합니다.</li>
                    <li>특정 영역에 지속적으로 머무르는 학생에게는 개별 관심이 필요합니다.</li>
                    <li>감정 무드미터를 활용한 학급 활동(감정 일기 나누기, 감정 토론 등)을 진행할 수 있습니다.</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- 네비게이션 버튼 -->
        <button
          v-if="currentIndex > 0"
          class="teacher-nav-btn teacher-nav-btn-prev"
          @click="prevCard"
        >
          ◀
        </button>
        <button
          v-if="currentIndex < totalCards - 1"
          class="teacher-nav-btn teacher-nav-btn-next"
          @click="nextCard"
        >
          ▶
        </button>
      </div>
    </template>
  </BaseTeacherModal>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import BaseTeacherModal from './BaseTeacherModal.vue'

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
const isDragging = ref(false)
let touchStartX = 0
let touchEndX = 0
let startX = 0
let currentTranslate = 0
let prevTranslate = 0

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
  isDragging.value = true
  startX = e.touches[0].clientX
  prevTranslate = -currentIndex.value * 100
}

const handleTouchMove = (e) => {
  if (!isDragging.value) return
  touchEndX = e.touches[0].clientX
  const currentPosition = e.touches[0].clientX
  const diff = currentPosition - startX
  const movePercent = (diff / window.innerWidth) * 100
  currentTranslate = prevTranslate + movePercent
}

const handleTouchEnd = () => {
  isDragging.value = false
  const swipeThreshold = 50
  const diff = touchStartX - touchEndX

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextCard()
    } else {
      prevCard()
    }
  }
  currentTranslate = -currentIndex.value * 100
}

// 마우스 이벤트 핸들러
const handleMouseDown = (e) => {
  isDragging.value = true
  startX = e.clientX
  prevTranslate = -currentIndex.value * 100
  e.preventDefault()
}

const handleMouseMove = (e) => {
  if (!isDragging.value) return
  const currentPosition = e.clientX
  const diff = currentPosition - startX
  const movePercent = (diff / window.innerWidth) * 100
  currentTranslate = prevTranslate + movePercent
}

const handleMouseUp = (e) => {
  if (!isDragging.value) return
  isDragging.value = false

  const endX = e.clientX
  const diff = startX - endX
  const swipeThreshold = 50

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextCard()
    } else {
      prevCard()
    }
  }
  currentTranslate = -currentIndex.value * 100
}

const handleMouseLeave = () => {
  if (isDragging.value) {
    isDragging.value = false
    currentTranslate = -currentIndex.value * 100
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
  currentIndex.value = 0
  emit('update:modelValue', false)
}
</script>
