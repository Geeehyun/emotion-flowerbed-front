<template>
  <div class="teacher-classmap-view">
    <!-- 헤더 (월 네비게이션 + 탭 + 범례) -->
    <div class="teacher-classmap-header">
      <div class="teacher-month-navigation">
        <button @click="previousMonth" class="teacher-month-nav-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h2 class="teacher-current-month">{{ formattedMonth }}</h2>
        <button @click="nextMonth" class="teacher-month-nav-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      <!-- 탭 전환 -->
      <div class="teacher-view-tabs">
        <button
          @click="currentViewType = 'chart'"
          :class="['teacher-view-tab', { active: currentViewType === 'chart' }]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
          그래프형
        </button>
        <button
          @click="currentViewType = 'calendar'"
          :class="['teacher-view-tab', { active: currentViewType === 'calendar' }]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          달력형
        </button>
      </div>

      <div class="teacher-legend-group">
        <div class="teacher-legend-item">
          <div class="teacher-legend-color teacher-red-legend"></div>
          <span>빨강</span>
        </div>
        <div class="teacher-legend-item">
          <div class="teacher-legend-color teacher-yellow-legend"></div>
          <span>노랑</span>
        </div>
        <div class="teacher-legend-item">
          <div class="teacher-legend-color teacher-blue-legend"></div>
          <span>파랑</span>
        </div>
        <div class="teacher-legend-item">
          <div class="teacher-legend-color teacher-green-legend"></div>
          <span>초록</span>
        </div>
        <div class="teacher-legend-item">
          <div class="teacher-legend-color teacher-gray-legend"></div>
          <span>미제출</span>
        </div>
        <div class="teacher-legend-item">
          <div class="teacher-legend-color teacher-unanalyzed-legend"></div>
          <span>분석불가</span>
        </div>
      </div>
    </div>

    <!-- 요약 정보 -->
    <div v-if="!isLoading && !errorMessage && monthlyData" class="teacher-monthly-summary">
      <div class="teacher-summary-card">
        <h3 class="teacher-summary-title">이달의 학급 현황</h3>
        <div class="teacher-summary-content">
          <div class="teacher-summary-item">
            <span class="teacher-summary-label">총 학생 수</span>
            <span class="teacher-summary-value">{{ monthlyData.totalStudents }}명</span>
          </div>
          <div class="teacher-summary-item">
            <span class="teacher-summary-label">데이터 수집 일수</span>
            <span class="teacher-summary-value">{{ daysWithData }}일</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="teacher-loading-container">
      <div class="teacher-loading-spinner"></div>
      <p class="teacher-loading-text">데이터를 불러오는 중...</p>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="errorMessage" class="teacher-error-container">
      <div class="teacher-error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <p class="teacher-error-message">{{ errorMessage }}</p>
      <button @click="loadMonthlyData" class="teacher-retry-btn">다시 시도</button>
    </div>

    <!-- 그래프형 뷰 -->
    <div v-else-if="currentViewType === 'chart'" class="teacher-chart-view">
      <div class="teacher-chart-container-wrapper">
        <canvas ref="emotionLineChart"></canvas>
      </div>
    </div>

    <!-- 달력형 뷰 -->
    <div v-else-if="currentViewType === 'calendar'" class="teacher-calendar-container">
      <div class="teacher-calendar-grid">
        <!-- 요일 헤더 -->
        <div class="teacher-weekday-header" v-for="day in weekdays" :key="day">
          {{ day }}
        </div>

        <!-- 날짜 셀 -->
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          :class="[
            'teacher-calendar-day',
            { 'teacher-other-month': !day.isCurrentMonth },
            { 'teacher-today': day.isToday },
            { 'teacher-has-data': day.hasData }
          ]"
        >
          <div class="teacher-day-number">{{ day.date }}</div>
          <div v-if="day.hasData && day.isCurrentMonth && day.area" class="teacher-calendar-segment-bar">
            <div
              v-if="day.area?.red > 0"
              class="teacher-emotion-bar teacher-red-bar"
              :style="{ flexGrow: day.area.red }"
            >
              <div class="teacher-bar-tooltip">
                <strong>빨강 영역</strong><br>
                {{ day.area.red }}명 ({{ getBarHeight(day.area.red, day.total) }})
              </div>
            </div>
            <div
              v-if="day.area?.yellow > 0"
              class="teacher-emotion-bar teacher-yellow-bar"
              :style="{ flexGrow: day.area.yellow }"
            >
              <div class="teacher-bar-tooltip">
                <strong>노랑 영역</strong><br>
                {{ day.area.yellow }}명 ({{ getBarHeight(day.area.yellow, day.total) }})
              </div>
            </div>
            <div
              v-if="day.area?.blue > 0"
              class="teacher-emotion-bar teacher-blue-bar"
              :style="{ flexGrow: day.area.blue }"
            >
              <div class="teacher-bar-tooltip">
                <strong>파랑 영역</strong><br>
                {{ day.area.blue }}명 ({{ getBarHeight(day.area.blue, day.total) }})
              </div>
            </div>
            <div
              v-if="day.area?.green > 0"
              class="teacher-emotion-bar teacher-green-bar"
              :style="{ flexGrow: day.area.green }"
            >
              <div class="teacher-bar-tooltip">
                <strong>초록 영역</strong><br>
                {{ day.area.green }}명 ({{ getBarHeight(day.area.green, day.total) }})
              </div>
            </div>
            <div
              v-if="day.area?.none > 0"
              class="teacher-emotion-bar teacher-gray-bar"
              :style="{ flexGrow: day.area.none }"
            >
              <div class="teacher-bar-tooltip">
                <strong>미제출</strong><br>
                {{ day.area.none }}명 ({{ getBarHeight(day.area.none, day.total) }})
              </div>
            </div>
            <div
              v-if="day.area?.unanalyzed > 0"
              class="teacher-emotion-bar teacher-unanalyzed-bar"
              :style="{ flexGrow: day.area.unanalyzed }"
            >
              <div class="teacher-bar-tooltip">
                <strong>분석불가</strong><br>
                {{ day.area.unanalyzed }}명 ({{ getBarHeight(day.area.unanalyzed, day.total) }})
              </div>
            </div>
          </div>
          <div v-else-if="day.isCurrentMonth" class="teacher-no-data">
            <span class="teacher-no-data-text">-</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 영역별 키워드 -->
    <div v-if="!isLoading && !errorMessage && monthlyData?.areaKeywords" class="teacher-area-keywords-section">
      <h3 class="teacher-keywords-title">이달의 영역별 주요 키워드</h3>
      <div class="teacher-keywords-grid">
        <!-- 빨강 영역 -->
        <div class="teacher-keyword-card teacher-red-card">
          <div class="teacher-keyword-card-header">
            <div class="teacher-keyword-area-icon" style="background: #EF5350;">🔥</div>
            <div class="teacher-keyword-area-name">빨강 영역</div>
          </div>
          <div class="teacher-keyword-list">
            <span
              v-for="(keyword, index) in monthlyData.areaKeywords.red"
              :key="index"
              class="teacher-keyword-item teacher-red-keyword"
            >
              {{ keyword }}
            </span>
            <span v-if="!monthlyData.areaKeywords.red || monthlyData.areaKeywords.red.length === 0" class="teacher-no-keyword">
              키워드 없음
            </span>
          </div>
        </div>

        <!-- 노랑 영역 -->
        <div class="teacher-keyword-card teacher-yellow-card">
          <div class="teacher-keyword-card-header">
            <div class="teacher-keyword-area-icon" style="background: #FFD54F;">☀️</div>
            <div class="teacher-keyword-area-name">노랑 영역</div>
          </div>
          <div class="teacher-keyword-list">
            <span
              v-for="(keyword, index) in monthlyData.areaKeywords.yellow"
              :key="index"
              class="teacher-keyword-item teacher-yellow-keyword"
            >
              {{ keyword }}
            </span>
            <span v-if="!monthlyData.areaKeywords.yellow || monthlyData.areaKeywords.yellow.length === 0" class="teacher-no-keyword">
              키워드 없음
            </span>
          </div>
        </div>

        <!-- 파랑 영역 -->
        <div class="teacher-keyword-card teacher-blue-card">
          <div class="teacher-keyword-card-header">
            <div class="teacher-keyword-area-icon" style="background: #42A5F5;">💧</div>
            <div class="teacher-keyword-area-name">파랑 영역</div>
          </div>
          <div class="teacher-keyword-list">
            <span
              v-for="(keyword, index) in monthlyData.areaKeywords.blue"
              :key="index"
              class="teacher-keyword-item teacher-blue-keyword"
            >
              {{ keyword }}
            </span>
            <span v-if="!monthlyData.areaKeywords.blue || monthlyData.areaKeywords.blue.length === 0" class="teacher-no-keyword">
              키워드 없음
            </span>
          </div>
        </div>

        <!-- 초록 영역 -->
        <div class="teacher-keyword-card teacher-green-card">
          <div class="teacher-keyword-card-header">
            <div class="teacher-keyword-area-icon" style="background: #66BB6A;">🌿</div>
            <div class="teacher-keyword-area-name">초록 영역</div>
          </div>
          <div class="teacher-keyword-list">
            <span
              v-for="(keyword, index) in monthlyData.areaKeywords.green"
              :key="index"
              class="teacher-keyword-item teacher-green-keyword"
            >
              {{ keyword }}
            </span>
            <span v-if="!monthlyData.areaKeywords.green || monthlyData.areaKeywords.green.length === 0" class="teacher-no-keyword">
              키워드 없음
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js/auto'
import { getClassMonthlyEmotionDistribution } from '@/services/teacherApi.js'

// Chart.js 등록
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

// 상태 관리
const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth() + 1) // 1-12
const currentViewType = ref('chart') // 'chart' or 'calendar', 기본값: 그래프형
const isLoading = ref(false)
const errorMessage = ref('')
const monthlyData = ref(null)
const emotionLineChart = ref(null)
let chartInstance = null

const weekdays = ['일', '월', '화', '수', '목', '금', '토']

// 현재 월 표시 (YYYY년 M월)
const formattedMonth = computed(() => {
  return `${currentYear.value}년 ${currentMonth.value}월`
})

// YYYY-MM 형식 문자열
const yearMonthString = computed(() => {
  const month = String(currentMonth.value).padStart(2, '0')
  return `${currentYear.value}-${month}`
})

// 캘린더 날짜 배열 생성
const calendarDays = computed(() => {
  const days = []
  const year = currentYear.value
  const month = currentMonth.value

  // 이번 달 첫날과 마지막날
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)

  // 첫 주 앞쪽 빈 날짜 (이전 달)
  const firstDayOfWeek = firstDay.getDay()
  const prevMonthLastDay = new Date(year, month - 1, 0).getDate()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: prevMonthLastDay - i,
      isCurrentMonth: false,
      isToday: false,
      hasData: false,
      area: {},
      total: 0
    })
  }

  // 이번 달 날짜
  const today = new Date()
  const isCurrentMonthAndYear =
    today.getFullYear() === year && today.getMonth() + 1 === month

  for (let date = 1; date <= lastDay.getDate(); date++) {
    const dateString = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`
    const dayData = monthlyData.value?.dailyDistribution?.find(d => d.date === dateString)

    const isToday = isCurrentMonthAndYear && today.getDate() === date
    const hasData = !!dayData

    const area = hasData ? dayData.area : {}
    const total = hasData
      ? (area.red || 0) + (area.yellow || 0) + (area.blue || 0) +
        (area.green || 0) + (area.none || 0) + (area.unanalyzed || 0)
      : 0

    days.push({
      date,
      isCurrentMonth: true,
      isToday,
      hasData,
      area,
      total
    })
  }

  // 마지막 주 뒤쪽 빈 날짜 (다음 달)
  const remainingDays = 7 - (days.length % 7)
  if (remainingDays < 7) {
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        isToday: false,
        hasData: false,
        area: {},
        total: 0
      })
    }
  }

  return days
})

// 데이터가 있는 날짜 수
const daysWithData = computed(() => {
  if (!monthlyData.value?.dailyDistribution) return 0
  return monthlyData.value.dailyDistribution.length
})

// 바 높이 계산 (최대 100%)
const getBarHeight = (count, total) => {
  if (total === 0) return '0.00%'
  const percent = (count / total) * 100
  return `${percent.toFixed(2)}%`
}

// 라인 차트 생성
const createLineChart = () => {
  if (!emotionLineChart.value) {
    console.error('❌ emotionLineChart ref가 없습니다!')
    return
  }

  if (!monthlyData.value?.dailyDistribution) {
    console.error('❌ dailyDistribution 데이터가 없습니다!')
    return
  }

  // 기존 차트 삭제
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = emotionLineChart.value.getContext('2d')

  // 날짜 레이블 (일자만)
  const labels = monthlyData.value.dailyDistribution.map(d => {
    const date = new Date(d.date)
    return `${date.getMonth() + 1}/${date.getDate()}`
  })

  // 각 영역별 데이터
  const redData = monthlyData.value.dailyDistribution.map(d => d.area.red || 0)
  const yellowData = monthlyData.value.dailyDistribution.map(d => d.area.yellow || 0)
  const blueData = monthlyData.value.dailyDistribution.map(d => d.area.blue || 0)
  const greenData = monthlyData.value.dailyDistribution.map(d => d.area.green || 0)
  const noneData = monthlyData.value.dailyDistribution.map(d => d.area.none || 0)
  const unanalyzedData = monthlyData.value.dailyDistribution.map(d => d.area.unanalyzed || 0)

  const data = {
    labels,
    datasets: [
      {
        label: '빨강 영역',
        data: redData,
        borderColor: '#EF5350',
        backgroundColor: 'rgba(239, 83, 80, 0.1)',
        tension: 0.4,
        fill: false
      },
      {
        label: '노랑 영역',
        data: yellowData,
        borderColor: '#FFD54F',
        backgroundColor: 'rgba(255, 213, 79, 0.1)',
        tension: 0.4,
        fill: false
      },
      {
        label: '파랑 영역',
        data: blueData,
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66, 165, 245, 0.1)',
        tension: 0.4,
        fill: false
      },
      {
        label: '초록 영역',
        data: greenData,
        borderColor: '#66BB6A',
        backgroundColor: 'rgba(102, 187, 106, 0.1)',
        tension: 0.4,
        fill: false
      },
      {
        label: '미제출',
        data: noneData,
        borderColor: '#BDBDBD',
        backgroundColor: 'rgba(189, 189, 189, 0.1)',
        tension: 0.4,
        fill: false,
        borderDash: [5, 5] // 점선
      },
      {
        label: '분석불가',
        data: unanalyzedData,
        borderColor: '#9E9E9E',
        backgroundColor: 'rgba(158, 158, 158, 0.1)',
        tension: 0.4,
        fill: false
        // 실선 (borderDash 없음)
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#5D4E37',
        bodyColor: '#5D4E37',
        borderColor: '#D4C4B0',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          title: function(context) {
            const index = context[0].dataIndex
            const dateStr = monthlyData.value.dailyDistribution[index].date
            const dayOfWeek = monthlyData.value.dailyDistribution[index].dayOfWeek
            return `${dateStr} (${dayOfWeek})`
          },
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}명`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: '#E8DFD0',
          drawBorder: false
        },
        ticks: {
          color: '#8B7355',
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#E8DFD0',
          drawBorder: false
        },
        ticks: {
          color: '#8B7355',
          font: {
            size: 11
          },
          stepSize: 1
        }
      }
    }
  }

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: data,
    options: options
  })
}

// 월별 데이터 로드
const loadMonthlyData = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const data = await getClassMonthlyEmotionDistribution(yearMonthString.value)
    monthlyData.value = data
  } catch (error) {
    console.error('월별 감정 분포 조회 실패:', error)
    errorMessage.value = error.message || '데이터를 불러오는데 실패했습니다.'
  } finally {
    isLoading.value = false

    // 로딩이 끝난 후 그래프형일 때 차트 생성
    if (!errorMessage.value && currentViewType.value === 'chart' && monthlyData.value) {
      await nextTick()
      createLineChart()
    }
  }
}

// 이전 월로 이동
const previousMonth = () => {
  if (currentMonth.value === 1) {
    currentYear.value--
    currentMonth.value = 12
  } else {
    currentMonth.value--
  }
}

// 다음 월로 이동
const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentYear.value++
    currentMonth.value = 1
  } else {
    currentMonth.value++
  }
}

// 월이 변경되면 데이터 다시 로드
watch([currentYear, currentMonth], () => {
  loadMonthlyData()
})

// 뷰 타입이 변경되면 차트 재생성
watch(currentViewType, async (newType) => {
  if (newType === 'chart' && monthlyData.value) {
    await nextTick()
    createLineChart()
  }
})

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  loadMonthlyData()
})
</script>
