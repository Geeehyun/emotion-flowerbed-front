<template>
  <div class="teacher-letter-detail-view">
    <!-- 헤더 -->
    <div class="teacher-letter-header">
      <button @click="$emit('back')" class="teacher-back-btn">
        ← 목록으로
      </button>
      <div class="teacher-letter-title-area">
        <h2 class="teacher-letter-title">{{ letter?.title }}</h2>
        <p class="teacher-letter-period">{{ letter?.period }}</p>
      </div>
    </div>

    <!-- 학생이 보는 내용 섹션 -->
    <div class="teacher-student-content-section">
      <div class="teacher-section-badge">
        <span class="teacher-badge-icon">👤</span>
        <span class="teacher-badge-text">학생이 보는 내용</span>
      </div>

      <!-- 한 주간 피운 꽃들 -->
      <div class="teacher-letter-section">
        <h3 class="teacher-section-title">한 주간 피운 꽃들</h3>
        <div class="teacher-weekly-calendar">
          <div
            v-for="(day, index) in letter?.weekFlowers"
            :key="index"
            class="teacher-calendar-day"
          >
            <div class="teacher-day-header">
              <span class="teacher-day-date">{{ day.date }}</span>
              <span class="teacher-day-name">{{ day.day }}</span>
            </div>
            <div class="teacher-day-flower" :class="{ 'has-diary': day.hasEntry }">
              <div v-if="day.hasEntry" class="teacher-flower-wrapper">
                <LazyImage
                  :src="getFlowerPotImage(day.flowerKey)"
                  :alt="day.emotionName"
                  image-class="teacher-flower-pot-image"
                  skeleton-type="card"
                />
              </div>
              <!-- 호버 툴팁 (wrapper 밖으로 이동) -->
              <div v-if="day.hasEntry" class="teacher-flower-tooltip">
                <div class="teacher-flower-tooltip-card">
                  <div class="teacher-flower-tooltip-name">{{ day.flowerName }}</div>
                  <div class="teacher-flower-tooltip-meaning">"{{ day.flowerMeaning }}"</div>
                  <div class="teacher-flower-tooltip-emotion">{{ day.emotionName }}</div>
                </div>
              </div>
            </div>
            <div v-if="day.hasEntry" class="teacher-day-emotion">
              {{ day.emotionName }}
            </div>
          </div>
        </div>
      </div>

      <!-- 마음의 색깔들 (감정 차트) -->
      <div class="teacher-letter-section">
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
      <div class="teacher-letter-section">
        <h3 class="teacher-section-title">정원사의 관찰 노트</h3>
        <div class="teacher-analysis-content">
          <p>{{ letter?.studentReport }}</p>
        </div>
      </div>

      <!-- 주간 하이라이트 -->
      <div class="teacher-letter-section" v-if="letter?.highlights">
        <h3 class="teacher-section-title">반짝이는 순간들</h3>

        <!-- 이번 주의 꽃 -->
        <div class="teacher-highlight-main" v-if="letter.highlights.flowerOfTheWeek">
          <div class="teacher-flower-of-week">
            <div class="teacher-flower-of-week-image">
              <LazyImage
                :src="getFlowerPotImage(letter.highlights.flowerOfTheWeek.imageFile3d.replace('.png', ''))"
                :alt="letter.highlights.flowerOfTheWeek.flowerNameKr"
                skeleton-type="card"
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
              <div class="teacher-score-point">{{ letter.highlights.gardenDiversity.score }}점</div>
            </div>
          </div>
          <div class="teacher-score-description">{{ letter.highlights.gardenDiversity.description }}</div>
        </div>
      </div>

      <!-- 이번 주 키워드 -->
      <div class="teacher-letter-section" v-if="letter?.weekKeywords && letter.weekKeywords.length > 0">
        <h3 class="teacher-section-title">이번 주 키워드</h3>
        <div class="teacher-week-keywords">
          <div
            v-for="(keyword, index) in letter.weekKeywords"
            :key="index"
            class="teacher-keyword-tag"
          >
            {{ keyword }}
          </div>
        </div>
      </div>

      <!-- 마음 가드닝 TIP -->
      <div class="teacher-letter-section" v-if="letter?.mindGardeningTip && letter.mindGardeningTip.length > 0">
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
      <div class="teacher-letter-section teacher-gardener-letter">
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
    <div class="teacher-exclusive-content-section">
      <div class="teacher-section-badge teacher-exclusive-badge">
        <span class="teacher-badge-icon">👨‍🏫</span>
        <span class="teacher-badge-text">선생님 전용 분석</span>
      </div>

      <!-- 선생님용 주간 분석 -->
      <div class="teacher-letter-section">
        <h3 class="teacher-section-title">주간 감정 분석</h3>
        <div class="teacher-exclusive-analysis">
          <pre class="teacher-analysis-text">{{ letter?.teacherReport }}</pre>
        </div>
      </div>

      <!-- 학생 말걸기 TIP -->
      <div class="teacher-letter-section" v-if="letter?.teacherTalkTip?.length > 0">
        <h3 class="teacher-section-title">학생 말걸기 TIP</h3>
        <div class="teacher-talk-questions">
          <div
            v-for="(tip, index) in letter.teacherTalkTip"
            :key="index"
            class="teacher-question-card"
            :class="`teacher-question-card-${index % 4}`"
          >
            <div class="teacher-question-badge">Q.</div>
            <div class="teacher-question-text">{{ tip }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js/auto'
import { ANIMATION_DELAY } from '@/constants/uiConstants.js'
import LazyImage from '@/components/common/LazyImage.vue'

// Chart.js 등록
Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

const props = defineProps({
  letter: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['back'])

const chartCanvas = ref(null)
let chartInstance = null

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
</script>
