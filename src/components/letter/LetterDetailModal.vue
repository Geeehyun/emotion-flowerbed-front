<template>
  <BaseModal
    v-model="isOpen"
    max-width="700px"
    @close="handleClose"
  >
    <template #header>
      <div>
        <h2 class="text-xl font-bold text-gray-800">{{ letter?.title }}</h2>
        <p class="text-sm text-gray-500 mt-1">{{ letter?.period }}</p>
      </div>
    </template>

    <template #default>
      <div class="letter-detail-content">
        <!-- 인사말 -->
        <div class="letter-section greeting">
          <div class="greeting-icon">💌</div>
          <p class="greeting-text">
            안녕하세요!<br />
            지난 한 주간의 감정 여정을 정리한 레터가 도착했어요.
          </p>
        </div>

        <!-- 주간 감정 그래프 -->
        <div class="letter-section">
          <h3 class="section-title">📊 이번 주 감정 그래프</h3>
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
          <h3 class="section-title">💭 감정 분석</h3>
          <div class="analysis-content">
            <p>{{ letter?.analysis }}</p>
          </div>
        </div>

        <!-- 주간 하이라이트 -->
        <div class="letter-section">
          <h3 class="section-title">✨ 이번 주 하이라이트</h3>
          <div class="highlights">
            <div
              v-for="(highlight, index) in letter?.highlights"
              :key="index"
              class="highlight-item"
            >
              <div class="highlight-icon">{{ highlight.icon }}</div>
              <div class="highlight-content">
                <div class="highlight-label">{{ highlight.label }}</div>
                <div class="highlight-value">{{ highlight.value }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 다음 주 응원 메시지 -->
        <div class="letter-section encouragement">
          <div class="encouragement-icon">🌟</div>
          <p class="encouragement-text">
            {{ letter?.encouragement }}
          </p>
        </div>

        <!-- 서명 -->
        <div class="letter-signature">
          <p>당신의 감정 정원사 올림</p>
          <p class="signature-date">{{ letter?.date }}</p>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js'
import BaseModal from '@/components/common/modals/BaseModal.vue'

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

const emit = defineEmits(['update:modelValue', 'close'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleClose = () => {
  emit('close')
}

const chartCanvas = ref(null)
let chartInstance = null

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
    }, 100)
  }
}, { deep: true })

watch(() => props.modelValue, (newValue) => {
  if (newValue && props.letter) {
    setTimeout(() => {
      createChart()
    }, 100)
  }
})
</script>
