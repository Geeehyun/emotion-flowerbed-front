<template>
  <section class="teacher-emotion-distribution-section">
    <div class="teacher-section-card">
      <div class="teacher-section-header-row">
        <h2 class="teacher-section-title">
          학급 감정 분포 현황
        </h2>
        <div class="teacher-date-selector">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="teacher-calendar-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <DatePicker
            :model-value="parseDate(selectedDate)"
            @update:model-value="handleDateChange"
            mode="date"
            locale="ko"
            :popover="{ visibility: 'click' }"
          >
            <template v-slot="{ inputValue, togglePopover }">
              <input
                type="text"
                :value="inputValue"
                @click="togglePopover"
                readonly
                class="teacher-date-input"
                placeholder="날짜 선택"
              />
            </template>
          </DatePicker>
        </div>
      </div>

      <!-- 로딩 상태 -->
      <EmotionDistributionSkeleton v-if="isLoading" />

      <!-- 에러 상태 -->
      <div v-else-if="errorMessage" class="teacher-distribution-empty-state">
        <div class="teacher-empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="teacher-error-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <p class="teacher-empty-message teacher-error-message">{{ errorMessage }}</p>
        <button @click="emit('date-change')" class="teacher-retry-btn">다시 시도</button>
      </div>

      <!-- 데이터 없음 -->
      <div v-else-if="totalStudents === 0" class="teacher-distribution-empty-state">
        <div class="teacher-empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        </div>
        <p class="teacher-empty-message">조회할 데이터가 없습니다</p>
        <p class="teacher-empty-description">선택한 날짜에 제출된 감정 일기가 없습니다</p>
      </div>

      <!-- 데이터 있음 -->
      <div v-else class="teacher-distribution-content">
        <div class="teacher-chart-wrapper">
          <div class="teacher-chart-container">
            <canvas ref="chartCanvas"></canvas>
          </div>
          <div class="teacher-chart-total-text">
            <span class="teacher-total-count">{{ totalStudents }}<span class="teacher-count-unit">명</span></span>
          </div>
        </div>
        <div class="teacher-zone-stats">
          <div
            v-for="zone in zones"
            :key="zone.key"
            :class="['teacher-zone-stat-item', zone.className]"
          >
            <h4>{{ zone.label }}</h4>
            <div class="teacher-stat-value">{{ getZoneCount(zone.key) }}<span class="teacher-stat-percent">명 ({{ getZonePercent(zone.key) }}%)</span></div>
            <div v-if="getZoneStudents(zone.key).length > 0" class="teacher-zone-tooltip">
              <div class="teacher-zone-tooltip-arrow"></div>
              <div class="teacher-zone-tooltip-content">
                <p class="teacher-zone-tooltip-title">{{ zone.label }} 학생</p>
                <ul class="teacher-zone-tooltip-list">
                  <li v-for="student in getZoneStudents(zone.key)" :key="student.id">
                    <span class="student-name">{{ student.name }}</span>
                    <span v-if="student.coreEmotionNameKr" class="student-emotion">{{ student.coreEmotionNameKr }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js/auto'
import { DatePicker } from 'v-calendar'
import 'v-calendar/style.css'
import EmotionDistributionSkeleton from './EmotionDistributionSkeleton.vue'

// Chart.js 등록
Chart.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  selectedDate: {
    type: String,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  },
  totalStudents: {
    type: Number,
    default: 0
  },
  zoneDistribution: {
    type: Object,
    required: true
  },
  students: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:selectedDate', 'date-change'])

// 날짜 변환 함수
const parseDate = (dateString) => {
  if (!dateString) return new Date()
  return new Date(dateString)
}

const formatDate = (date) => {
  if (!date) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const handleDateChange = (date) => {
  const formattedDate = formatDate(date)
  emit('update:selectedDate', formattedDate)
  emit('date-change')
}

const chartCanvas = ref(null)
let emotionChart = null

const zones = [
  { key: 'red', label: '빨강 영역', className: 'teacher-red-zone' },
  { key: 'yellow', label: '노랑 영역', className: 'teacher-yellow-zone' },
  { key: 'blue', label: '파랑 영역', className: 'teacher-blue-zone' },
  { key: 'green', label: '초록 영역', className: 'teacher-green-zone' },
  { key: 'none', label: '미제출', className: 'teacher-gray-zone' },
  { key: 'unanalyzed', label: '분석불가', className: 'teacher-unanalyzed-zone' }
]

const getZoneCount = (zone) => {
  return props.zoneDistribution[zone] || 0
}

const getZonePercent = (zone) => {
  const count = getZoneCount(zone)
  const total = props.totalStudents
  return total > 0 ? Math.round((count / total) * 100) : 0
}

const getZoneStudents = (zone) => {
  return props.students.filter(s => s.area === zone)
}

const createEmotionChart = () => {
  if (!chartCanvas.value) return

  // 기존 차트가 있으면 삭제
  if (emotionChart) {
    emotionChart.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')

  const data = {
    labels: ['빨강 영역', '노랑 영역', '파랑 영역', '초록 영역', '미제출', '분석불가'],
    datasets: [{
      data: [
        props.zoneDistribution.red,
        props.zoneDistribution.yellow,
        props.zoneDistribution.blue,
        props.zoneDistribution.green,
        props.zoneDistribution.none,
        props.zoneDistribution.unanalyzed
      ],
      backgroundColor: [
        '#EF5350', // 빨강
        '#FFD54F', // 노랑
        '#42A5F5', // 파랑
        '#66BB6A', // 초록
        '#BDBDBD', // 회색 (미제출)
        '#9E9E9E'  // 어두운 회색 (분석불가)
      ],
      borderWidth: 2,
      borderColor: '#FFFFFF'
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            const label = context.label || ''
            const value = context.parsed || 0
            const total = props.totalStudents
            const percent = total > 0 ? Math.round((value / total) * 100) : 0
            return `${label}: ${value}명 (${percent}%)`
          }
        }
      }
    }
  }

  emotionChart = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: options
  })
}

// 컴포넌트가 마운트될 때 차트 생성
onMounted(async () => {
  if (props.totalStudents > 0) {
    await nextTick()
    createEmotionChart()
  }
})

// zoneDistribution이 변경될 때마다 차트 재생성
watch(() => props.zoneDistribution, async () => {
  if (props.totalStudents > 0) {
    await nextTick()
    createEmotionChart()
  }
}, { deep: true })

// chartCanvas ref를 부모에게 전달
defineExpose({ chartCanvas })
</script>
