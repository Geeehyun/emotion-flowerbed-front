<template>
  <div class="teacher-letter-detail-view" :class="{ 'is-modal': isModal }">
    <!-- 콘텐츠 영역 (스크롤 가능) -->
    <div class="teacher-letter-content-wrapper">
      <!-- 헤더 (모달이 아닐 때만 표시) -->
      <div v-if="!isModal" class="teacher-letter-header">
      <button @click="$emit('back')" class="teacher-back-btn">
        ← 목록으로
      </button>
      <div class="teacher-letter-title-area">
        <h2 class="teacher-letter-title">{{ letter?.title }}</h2>
        <p class="teacher-letter-period">{{ letter?.period }}</p>
      </div>
    </div>

    <!-- 미분석 메시지 (isAnalyzed = false) -->
    <div v-if="!letter?.isAnalyzed" class="teacher-not-analyzed-full-message">
      <p>데이터가 충분하지 않아 분석할 수 없습니다.</p>
      <p class="teacher-diary-count">일기 {{ letter?.diaryCount || 0 }}건 작성</p>
    </div>

    <!-- 학생이 보는 내용 섹션 -->
    <div v-else class="teacher-student-content-section">
      <div class="teacher-section-badge">
        <span class="teacher-badge-icon">👤</span>
        <span class="teacher-badge-text">학생이 보는 내용</span>
      </div>

      <!-- 한 주간 피운 꽃들 -->
      <div id="section-flowers" class="teacher-letter-section">
        <h3 class="teacher-section-title">한 주간 피운 꽃들</h3>
        <div class="teacher-weekly-calendar">
          <div
            v-for="(day, index) in letter?.weekFlowers"
            :key="index"
            class="teacher-letter-calendar-day"
          >
            <div class="teacher-day-header">
              <span class="teacher-day-date">{{ day.date }}</span>
              <span class="teacher-day-name">{{ day.day }}</span>
            </div>
            <div class="teacher-day-flower" :class="{ 'has-diary': day.hasEntry }">
              <div v-if="day.hasEntry" class="teacher-flower-wrapper">
                <img
                  :src="getFlowerPotImage(day.flowerKey)"
                  :alt="day.emotionName"
                  class="teacher-flower-pot-image"
                  loading="lazy"
                />
              </div>
            </div>
            <!-- 호버 툴팁 (calendar-day 레벨로 이동) -->
            <div v-if="day.hasEntry" class="teacher-flower-tooltip">
              <div class="teacher-flower-tooltip-card">
                <div class="teacher-flower-tooltip-name">{{ day.flowerName }}</div>
                <div class="teacher-flower-tooltip-meaning">"{{ day.flowerMeaning }}"</div>
                <div class="teacher-flower-tooltip-emotion">{{ day.emotionName }}</div>
              </div>
            </div>
            <div v-if="day.hasEntry" class="teacher-day-emotion">
              {{ day.emotionName }}
            </div>
          </div>
        </div>
      </div>

      <!-- 마음의 색깔들 (감정 차트) -->
      <div id="section-emotions" class="teacher-letter-section">
        <h3 class="teacher-section-title">마음의 색깔들</h3>
        <div class="teacher-emotion-chart">
          <canvas ref="chartCanvas"></canvas>
        </div>
        <div class="teacher-chart-legend">
          <div
            v-for="emotion in letter?.emotions"
            :key="emotion.name"
            class="teacher-legend-item"
          >
            <span
              class="teacher-legend-color"
              :style="{ backgroundColor: emotion.color }"
            ></span>
            <span class="teacher-legend-text">{{ emotion.name }} ({{ emotion.count }}일)</span>
          </div>
        </div>
      </div>

      <!-- 정원사의 관찰 노트 -->
      <div id="section-observation" class="teacher-letter-section">
        <h3 class="teacher-section-title">정원사의 관찰 노트</h3>
        <div class="teacher-analysis-content">
          <p>{{ letter?.studentReport }}</p>
        </div>
      </div>

      <!-- 주간 하이라이트 -->
      <div id="section-highlights" class="teacher-letter-section" v-if="letter?.highlights">
        <h3 class="teacher-section-title">반짝이는 순간들</h3>

        <!-- 이번 주의 꽃 -->
        <div class="teacher-highlight-main" v-if="letter.highlights.flowerOfTheWeek">
          <div class="teacher-flower-of-week">
            <div class="teacher-flower-of-week-image">
              <img
                :src="getFlowerPotImage(letter.highlights.flowerOfTheWeek.imageFile3d.replace('.png', ''))"
                :alt="letter.highlights.flowerOfTheWeek.flowerNameKr"
                loading="lazy"
              />
            </div>
            <div class="teacher-flower-of-week-info">
              <div class="teacher-flower-of-week-title">🌸 이번 주를 대표하는 꽃</div>
              <div class="teacher-flower-of-week-name">{{ letter.highlights.flowerOfTheWeek.flowerNameKr }}</div>
              <div class="teacher-flower-of-week-emotion">
                {{ letter.highlights.flowerOfTheWeek.emotionNameKr }} · {{ letter.highlights.flowerOfTheWeek.count }}일
              </div>
              <div class="teacher-flower-of-week-meaning">"{{ letter.highlights.flowerOfTheWeek.flowerMeaning }}"</div>
            </div>
          </div>
        </div>

        <!-- 통계 그리드 -->
        <div class="teacher-highlight-stats" v-if="letter.highlights.quickStats">
          <div class="teacher-stat-item">
            <div class="teacher-stat-icon">📝</div>
            <div class="teacher-stat-label">일기 작성</div>
            <div class="teacher-stat-value">{{ letter.highlights.quickStats.totalDiaries }}일</div>
          </div>
          <div class="teacher-stat-item">
            <div class="teacher-stat-icon">🌈</div>
            <div class="teacher-stat-label">감정 다양성</div>
            <div class="teacher-stat-value">{{ letter.highlights.quickStats.emotionVariety }}가지</div>
          </div>
          <div class="teacher-stat-item">
            <div class="teacher-stat-icon">🎨</div>
            <div class="teacher-stat-label">주요 감정 영역</div>
            <div class="teacher-stat-value teacher-stat-area">{{ letter.highlights.quickStats.dominantAreaNameKr }}</div>
          </div>
        </div>

        <!-- 정원 평가 -->
        <div class="teacher-garden-score" v-if="letter.highlights.gardenDiversity">
          <div class="teacher-score-header">
            <div class="teacher-score-icon">⭐</div>
            <div class="teacher-score-info">
              <div class="teacher-score-level">{{ letter.highlights.gardenDiversity.level }}</div>
            </div>
          </div>
          <div class="teacher-score-description">{{ letter.highlights.gardenDiversity.description }}</div>
        </div>
      </div>

      <!-- 이번 주 키워드 -->
      <div id="section-keywords" class="teacher-letter-section" v-if="letter?.weekKeywords && letter.weekKeywords.length > 0">
        <h3 class="teacher-section-title">이번 주 키워드</h3>
        <div class="teacher-week-keywords">
          <div
            v-for="(keyword, index) in letter.weekKeywords"
            :key="index"
            class="teacher-week-keyword-tag"
          >
            {{ keyword }}
          </div>
        </div>
      </div>

      <!-- 마음 가드닝 TIP -->
      <div id="section-tips" class="teacher-letter-section" v-if="letter?.mindGardeningTip && letter.mindGardeningTip.length > 0">
        <h3 class="teacher-section-title">마음 가드닝 TIP</h3>
        <div class="teacher-gardening-tips">
          <div
            v-for="(tip, index) in letter.mindGardeningTip"
            :key="index"
            class="teacher-tip-bubble"
          >
            <div class="teacher-tip-text">{{ tip }}</div>
          </div>
        </div>
      </div>

      <!-- 정원사가 전하는 편지 -->
      <div id="section-letter" class="teacher-letter-section teacher-gardener-letter">
        <h3 class="teacher-section-title">정원사가 전하는 편지</h3>
        <div class="teacher-letter-paper">
          <p class="teacher-letter-content">
            {{ letter?.studentEncouragement }}
          </p>
          <div class="teacher-letter-signature">
            <p class="teacher-signature-text">당신의 감정 정원사 올림</p>
            <p class="teacher-signature-date">{{ letter?.date }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 선생님 전용 분석 섹션 -->
    <div v-if="letter?.isAnalyzed" class="teacher-exclusive-content-section">
      <div class="teacher-section-badge teacher-exclusive-badge">
        <span class="teacher-badge-icon">👨‍🏫</span>
        <span class="teacher-badge-text">선생님 전용 분석</span>
      </div>

      <!-- 선생님용 주간 분석 -->
      <div id="section-analysis" class="teacher-letter-section">
        <h3 class="teacher-section-title">주간 감정 분석</h3>
        <div class="teacher-exclusive-analysis">
          <pre class="teacher-analysis-text">{{ letter?.teacherReport }}</pre>
        </div>
      </div>

      <!-- 학생 말걸기 TIP -->
      <div id="section-talk-tips" class="teacher-letter-section" v-if="letter?.teacherTalkTip?.length > 0">
        <h3 class="teacher-section-title">학생 말걸기 TIP</h3>
        <div class="teacher-talk-questions">
          <div
            v-for="(tip, index) in letter.teacherTalkTip"
            :key="index"
            class="teacher-question-item"
          >
            <div class="teacher-question-badge">Q.</div>
            <div class="teacher-question-text">{{ tip }}</div>
          </div>
        </div>
      </div>
    </div>
    </div> <!-- teacher-letter-content-wrapper 끝 -->

    <!-- 섹션 네비게이션 -->
    <nav v-if="letter?.isAnalyzed" class="teacher-letter-nav" :class="{ expanded: isNavExpanded }">
      <!-- 토글 버튼 (모바일에서만 표시) -->
      <button class="teacher-nav-toggle" @click="toggleNav">
        <span>목차</span>
        <span class="teacher-nav-toggle-icon">{{ isNavExpanded ? '▲' : '▼' }}</span>
      </button>

      <div class="teacher-letter-nav-inner">
        <!-- 학생 내용 섹션 -->
        <div class="teacher-nav-section-label">학생 내용</div>
        <div
          v-for="section in studentSections"
          :key="section.id"
          @click="scrollToSection(section.id)"
          :class="['teacher-nav-item', { active: activeSection === section.id }]"
        >
          {{ section.label }}
        </div>

        <!-- 선생님 전용 섹션 -->
        <div class="teacher-nav-section-label teacher-exclusive-label">선생님 전용</div>
        <div
          v-for="section in teacherSections"
          :key="section.id"
          @click="scrollToSection(section.id)"
          :class="['teacher-nav-item', { active: activeSection === section.id }]"
        >
          {{ section.label }}
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js/auto'
import { ANIMATION_DELAY } from '@/constants/uiConstants.js'

// Chart.js 등록
Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

const props = defineProps({
  letter: {
    type: Object,
    default: null
  },
  isModal: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['back'])

const chartCanvas = ref(null)
let chartInstance = null
const activeSection = ref('section-flowers')
const isNavExpanded = ref(false)

// 화분 이미지 가져오기
const getFlowerPotImage = (flowerKey) => {
  if (!flowerKey) return ''
  return `/flowers/3d_pot/${flowerKey}.png`
}

// 차트 생성
const createChart = () => {
  if (!chartCanvas.value || !props.letter?.emotions) return

  // 기존 차트 제거
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')

  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: props.letter.emotions.map(e => e.name),
      datasets: [{
        data: props.letter.emotions.map(e => e.count),
        backgroundColor: props.letter.emotions.map(e => e.color),
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.parsed}일`
            }
          }
        }
      }
    }
  })
}

watch(() => props.letter, () => {
  if (props.letter) {
    setTimeout(() => {
      createChart()
    }, ANIMATION_DELAY.CHART_RENDER)
  }
}, { deep: true, immediate: true })

// 학생 내용 섹션 목록
const studentSections = computed(() => {
  if (!props.letter?.isAnalyzed) return []

  const sections = [
    { id: 'section-flowers', label: '피운 꽃들' },
    { id: 'section-emotions', label: '마음의 색깔' },
    { id: 'section-observation', label: '관찰 노트' }
  ]

  if (props.letter?.highlights) {
    sections.push({ id: 'section-highlights', label: '반짝이는 순간' })
  }

  if (props.letter?.weekKeywords?.length > 0) {
    sections.push({ id: 'section-keywords', label: '주간 키워드' })
  }

  if (props.letter?.mindGardeningTip?.length > 0) {
    sections.push({ id: 'section-tips', label: '가드닝 TIP' })
  }

  sections.push({ id: 'section-letter', label: '정원사 편지' })

  return sections
})

// 선생님 전용 섹션 목록
const teacherSections = computed(() => {
  if (!props.letter?.isAnalyzed) return []

  const sections = [
    { id: 'section-analysis', label: '주간 분석' }
  ]

  if (props.letter?.teacherTalkTip?.length > 0) {
    sections.push({ id: 'section-talk-tips', label: '말걸기 TIP' })
  }

  return sections
})

// 전체 섹션 목록 (스크롤 감지용)
const availableSections = computed(() => {
  return [...studentSections.value, ...teacherSections.value]
})

// 섹션으로 스크롤
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (!element) return

  // 모달인 경우 콘텐츠 래퍼 스크롤
  if (props.isModal) {
    const contentWrapper = document.querySelector('.teacher-letter-content-wrapper')
    if (contentWrapper) {
      // getBoundingClientRect를 사용한 정확한 위치 계산
      const wrapperRect = contentWrapper.getBoundingClientRect()
      const elementRect = element.getBoundingClientRect()
      const scrollTop = contentWrapper.scrollTop

      // 모바일에서는 목차 버튼 높이 고려 (약 50px)
      const isMobile = window.innerWidth <= 768
      const offsetAdjustment = isMobile ? 70 : 20
      const offset = elementRect.top - wrapperRect.top + scrollTop - offsetAdjustment

      contentWrapper.scrollTop = offset
    }
  } else {
    // 일반 페이지인 경우 window 스크롤
    const offsetTop = element.offsetTop - 80
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    })
  }

  // 모바일에서 네비게이션 자동으로 닫기
  if (window.innerWidth <= 768) {
    isNavExpanded.value = false
  }
}

// 네비게이션 토글
const toggleNav = () => {
  isNavExpanded.value = !isNavExpanded.value
}

// 스크롤 감지하여 현재 섹션 업데이트
const handleScroll = (event) => {
  const sections = availableSections.value.map(s => s.id)

  // 스크롤 위치 가져오기
  let scrollPosition
  if (props.isModal && event?.target) {
    scrollPosition = event.target.scrollTop + 100
  } else {
    scrollPosition = window.scrollY + 150
  }

  for (let i = sections.length - 1; i >= 0; i--) {
    const element = document.getElementById(sections[i])
    if (element) {
      let elementTop
      if (props.isModal) {
        const contentWrapper = document.querySelector('.teacher-letter-content-wrapper')
        if (contentWrapper) {
          // contentWrapper 기준으로 offsetTop 계산
          let offset = 0
          let current = element
          while (current && current !== contentWrapper) {
            offset += current.offsetTop
            current = current.offsetParent
          }
          elementTop = offset
        }
      } else {
        elementTop = element.offsetTop
      }

      if (elementTop && elementTop <= scrollPosition) {
        activeSection.value = sections[i]
        break
      }
    }
  }
}

onMounted(() => {
  // 모달인 경우 콘텐츠 래퍼에 이벤트 리스너 추가
  if (props.isModal) {
    setTimeout(() => {
      const contentWrapper = document.querySelector('.teacher-letter-content-wrapper')
      if (contentWrapper) {
        contentWrapper.addEventListener('scroll', handleScroll)
      }
    }, 100)
  } else {
    window.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  if (props.isModal) {
    const contentWrapper = document.querySelector('.teacher-letter-content-wrapper')
    if (contentWrapper) {
      contentWrapper.removeEventListener('scroll', handleScroll)
    }
  } else {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>
