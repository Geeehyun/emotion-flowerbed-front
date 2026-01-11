<template>
  <div class="teacher-classmap-view">
    <!-- 헤더 (월 네비게이션) -->
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

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="teacher-calendar-skeleton">
      <div class="teacher-calendar-grid">
        <div class="teacher-weekday-header" v-for="day in weekdays" :key="day">
          {{ day }}
        </div>
        <div class="teacher-calendar-day-skeleton" v-for="i in 35" :key="i">
          <div class="teacher-skeleton-pulse"></div>
        </div>
      </div>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="errorMessage" class="teacher-calendar-error">
      <div class="teacher-error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <p class="teacher-error-message">{{ errorMessage }}</p>
      <button @click="loadMonthlyData" class="teacher-retry-btn">다시 시도</button>
    </div>

    <!-- 캘린더 뷰 -->
    <div v-else class="teacher-calendar-container">
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
          <div v-if="day.hasData && day.isCurrentMonth" class="teacher-emotion-bars">
            <div
              v-if="day.area.red > 0"
              class="teacher-emotion-bar teacher-red-bar"
              :style="{ height: getBarHeight(day.area.red, day.total) }"
              :title="`빨강: ${day.area.red}명`"
            ></div>
            <div
              v-if="day.area.yellow > 0"
              class="teacher-emotion-bar teacher-yellow-bar"
              :style="{ height: getBarHeight(day.area.yellow, day.total) }"
              :title="`노랑: ${day.area.yellow}명`"
            ></div>
            <div
              v-if="day.area.blue > 0"
              class="teacher-emotion-bar teacher-blue-bar"
              :style="{ height: getBarHeight(day.area.blue, day.total) }"
              :title="`파랑: ${day.area.blue}명`"
            ></div>
            <div
              v-if="day.area.green > 0"
              class="teacher-emotion-bar teacher-green-bar"
              :style="{ height: getBarHeight(day.area.green, day.total) }"
              :title="`초록: ${day.area.green}명`"
            ></div>
            <div
              v-if="day.area.none > 0"
              class="teacher-emotion-bar teacher-gray-bar"
              :style="{ height: getBarHeight(day.area.none, day.total) }"
              :title="`미제출: ${day.area.none}명`"
            ></div>
            <div
              v-if="day.area.unanalyzed > 0"
              class="teacher-emotion-bar teacher-unanalyzed-bar"
              :style="{ height: getBarHeight(day.area.unanalyzed, day.total) }"
              :title="`분석불가: ${day.area.unanalyzed}명`"
            ></div>
          </div>
          <div v-else-if="day.isCurrentMonth" class="teacher-no-data">
            <span class="teacher-no-data-text">-</span>
          </div>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getClassMonthlyEmotionDistribution } from '@/services/teacherApi.js'

// 상태 관리
const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth() + 1) // 1-12
const isLoading = ref(false)
const errorMessage = ref('')
const monthlyData = ref(null)

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
  if (total === 0) return '0%'
  const percent = (count / total) * 100
  return `${percent}%`
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

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  loadMonthlyData()
})
</script>
