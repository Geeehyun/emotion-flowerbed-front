<template>
  <BaseModal
    v-model="isOpen"
    max-width="700px"
    @close="handleClose"
  >
    <template #header>
      <div class="letter-detail-header">
        <button @click="handleBackToList" class="back-to-list-btn">
          ← 목록으로
        </button>
        <div class="letter-header-info">
          <h2 class="text-xl font-bold text-gray-800">{{ letter?.title }}</h2>
          <p class="text-sm text-gray-500 mt-1">{{ letter?.period }}</p>
        </div>
      </div>
    </template>

    <template #default>
      <div class="letter-detail-content">
        <!-- 인사말 -->
        <div class="letter-section greeting">
          <p class="greeting-text">
            한 주의 여정을 담은 편지를 전합니다.<br />
            당신이 가꾼 감정 정원을 함께 돌아봐요.
          </p>
        </div>

        <!-- 일주일 치 감정 - 꽃 영역 -->
        <div class="letter-section week-flowers-section">
          <h3 class="section-title section-label">한 주간 피운 꽃들</h3>
          <div class="weekly-calendar">
            <div
              v-for="(day, index) in letter?.weekFlowers"
              :key="index"
              class="calendar-day"
            >
              <div class="day-header">
                <span class="day-date">{{ day.date }}</span>
                <span class="day-name">{{ day.day }}</span>
              </div>
              <div class="day-flower" :class="{ 'has-diary': day.hasEntry }">
                <div v-if="day.hasEntry" class="flower-wrapper" @click="handleFlowerClick(day)">
                  <img
                    :src="getFlowerPotImage(day.flowerKey)"
                    :alt="day.emotionName"
                    class="flower-pot-image"
                    loading="lazy"
                  />
                  <!-- 호버 툴팁 -->
                  <div class="flower-tooltip">
                    <div class="flower-tooltip-card">
                      <div class="flower-tooltip-name">{{ day.flowerName }}</div>
                      <div class="flower-tooltip-meaning">"{{ day.flowerMeaning }}"</div>
                      <div class="flower-tooltip-emotion">{{ day.emotionName }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="day.hasEntry" class="day-emotion">
                {{ day.emotionName }}
              </div>
            </div>
          </div>
        </div>

        <!-- 주간 감정 그래프 -->
        <div class="letter-section">
          <h3 class="section-title section-label">마음의 색깔들</h3>
          <div class="emotion-chart">
            <canvas ref="chartCanvas"></canvas>
          </div>
          <div class="chart-legend">
            <div
              v-for="emotion in letter?.emotions"
              :key="emotion.name"
              class="legend-item"
            >
              <span
                class="legend-color"
                :style="{ backgroundColor: emotion.color }"
              ></span>
              <span class="legend-text">{{ emotion.name }} ({{ emotion.count }}일)</span>
            </div>
          </div>
        </div>

        <!-- 감정 분석 -->
        <div class="letter-section">
          <h3 class="section-title section-label">정원사의 관찰 노트</h3>
          <div class="analysis-content">
            <p>{{ letter?.studentReport }}</p>
          </div>
        </div>

        <!-- 주간 하이라이트 -->
        <div class="letter-section" v-if="letter?.highlights">
          <h3 class="section-title section-label">반짝이는 순간들</h3>

          <!-- 이번 주의 꽃 -->
          <div class="highlight-main" v-if="letter.highlights.flowerOfTheWeek">
            <div class="flower-of-week">
              <div class="flower-of-week-image">
                <img
                  :src="getFlowerPotImage(letter.highlights.flowerOfTheWeek.imageFile3d.replace('.png', ''))"
                  :alt="letter.highlights.flowerOfTheWeek.flowerNameKr"
                  loading="lazy"
                />
              </div>
              <div class="flower-of-week-info">
                <div class="flower-of-week-title">🌸 이번 주를 대표하는 꽃</div>
                <div class="flower-of-week-name">{{ letter.highlights.flowerOfTheWeek.flowerNameKr }}</div>
                <div class="flower-of-week-emotion">
                  {{ letter.highlights.flowerOfTheWeek.emotionNameKr }} · {{ letter.highlights.flowerOfTheWeek.count }}일
                </div>
                <div class="flower-of-week-meaning">"{{ letter.highlights.flowerOfTheWeek.flowerMeaning }}"</div>
              </div>
            </div>
          </div>

          <!-- 통계 그리드 -->
          <div class="highlight-stats" v-if="letter.highlights.quickStats">
            <div class="stat-item">
              <div class="stat-icon">📝</div>
              <div class="stat-label">일기 작성</div>
              <div class="stat-value">{{ letter.highlights.quickStats.totalDiaries }}일</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">🌈</div>
              <div class="stat-label">감정 다양성</div>
              <div class="stat-value">{{ letter.highlights.quickStats.emotionVariety }}가지</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">🎨</div>
              <div class="stat-label">주요 감정 영역</div>
              <div class="stat-value stat-area">{{ letter.highlights.quickStats.dominantAreaNameKr }}</div>
            </div>
          </div>

          <!-- 정원 평가 -->
          <div class="garden-score" v-if="letter.highlights.gardenDiversity">
            <div class="score-header">
              <div class="score-icon">⭐</div>
              <div class="score-info">
                <div class="score-level">{{ letter.highlights.gardenDiversity.level }}</div>
                <div class="score-point">{{ letter.highlights.gardenDiversity.score }}점</div>
              </div>
            </div>
            <div class="score-description">{{ letter.highlights.gardenDiversity.description }}</div>
          </div>
        </div>

        <!-- 감정 정원사의 편지 -->
        <div class="letter-section gardener-letter">
          <h3 class="section-title section-label">정원사가 전하는 편지</h3>
          <div class="letter-paper">
            <p class="letter-content">
              {{ letter?.studentEncouragement }}
            </p>
            <div class="letter-signature">
              <p class="signature-text">당신의 감정 정원사 올림</p>
              <p class="signature-date">{{ letter?.date }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js'
import BaseModal from '@/components/common/modals/BaseModal.vue'
import { ANIMATION_DELAY } from '@/constants/uiConstants.js'

// Chart.js 등록
Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  letter: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'open-diary', 'back-to-list'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleClose = () => {
  emit('close')
}

const handleBackToList = () => {
  emit('back-to-list')
}

const chartCanvas = ref(null)
let chartInstance = null

// 화분 이미지 가져오기
const getFlowerPotImage = (flowerKey) => {
  if (!flowerKey) return ''
  return `/flowers/3d_pot/${flowerKey}.png`
}

// 꽃 클릭 핸들러 (일기로 이동)
const handleFlowerClick = (day) => {
  if (day.hasEntry && day.diaryId) {
    emit('open-diary', day.diaryId)
  }
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
  if (props.modelValue && props.letter) {
    setTimeout(() => {
      createChart()
    }, ANIMATION_DELAY.CHART_RENDER)
  }
}, { deep: true })

watch(() => props.modelValue, (newValue) => {
  if (newValue && props.letter) {
    setTimeout(() => {
      createChart()
    }, ANIMATION_DELAY.CHART_RENDER)
  }
})
</script>
