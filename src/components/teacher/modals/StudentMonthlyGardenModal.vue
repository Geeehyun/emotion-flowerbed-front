<template>
  <BaseTeacherModal
    v-model="isOpen"
    :title="`${studentName}의 감정 화단`"
    max-width="1200px"
    @close="handleClose"
  >
    <template #default>
      <div class="teacher-garden-modal-content">
        <!-- 에러 상태 -->
        <div v-if="errorMessage" class="teacher-garden-error">
          <p>{{ errorMessage }}</p>
        </div>

        <!-- 좌우 분할 레이아웃 -->
        <div v-else class="teacher-garden-split-layout" :class="{ 'loading': isLoading }">
          <!-- 로딩 오버레이 -->
          <div v-if="isLoading" class="teacher-garden-loading-overlay">
            <div class="teacher-loading-spinner"></div>
            <p class="teacher-loading-text">감정 화단을 불러오는 중...</p>
          </div>

          <!-- 좌측: 감정 화단 -->
          <div class="teacher-garden-section">
          <!-- 월 선택 바 -->
          <div class="teacher-month-selector">
            <button class="teacher-month-nav" @click="changeMonth(-1)">◀</button>
            <div class="teacher-month-display">{{ currentYear }}년 {{ currentMonth }}월</div>
            <button class="teacher-month-nav" @click="changeMonth(1)">▶</button>
          </div>

          <!-- 요일 헤더 -->
          <div class="teacher-weekday-header-container">
            <div class="teacher-weekday-header" v-for="day in weekDays" :key="`weekday-${day}`">
              {{ day }}
            </div>
          </div>

          <div class="teacher-garden-wrapper">
            <!-- 화단 배경 이미지 -->
            <img src="@/assets/images/garden-bg-rectangle.png" alt="화단" class="teacher-garden-bg-image" loading="lazy">

            <!-- 격자 그리드로 꽃 배치 -->
            <div class="teacher-flower-grid" :style="gardenGridStyle">
              <!-- 1일 이전 빈 칸 -->
              <div
                class="teacher-grid-cell"
                v-for="(i, index) in emptyDaysBeforeFirst"
                :key="`before-${i}`"
                :style="{ zIndex: getCellZIndex(index) }"
              >
                <div class="teacher-empty-slot" style="opacity: 0;"></div>
              </div>

              <!-- 감정 일기가 있는 날들 -->
              <template v-for="(day, index) in daysInCurrentMonth" :key="day">
                <div
                  class="teacher-grid-cell"
                  v-if="getEmotionForDay(day)"
                  :data-day="day"
                  :style="{ zIndex: getCellZIndex(emptyDaysBeforeFirst + index) }"
                >
                  <div
                    class="teacher-flower"
                    :class="{ 'selected': selectedDay === day }"
                    @click="selectDay(day)"
                  >
                    <LazyImage
                      :src="getFlowerImageUrl(day)"
                      :alt="getFlowerName(day)"
                      :image-class="isUnknownEmotion(day) ? 'teacher-flower-image unknown-flower' : 'teacher-flower-image'"
                      skeleton-type="default"
                    />
                    <div class="teacher-tooltip">
                      <div class="teacher-tooltip-card">
                        <div class="teacher-tooltip-flower-name">{{ getFlowerName(day) }}</div>
                        <div class="teacher-tooltip-meaning">"{{ getFlowerMeaning(day) }}"</div>
                        <div class="teacher-tooltip-date">{{ currentYear }}.{{ String(currentMonth).padStart(2, '0') }}.{{ String(day).padStart(2, '0') }}</div>
                        <div class="teacher-tooltip-emotion">{{ getEmotionName(day) }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 빈 칸 (일기 없음) -->
                <div
                  class="teacher-grid-cell"
                  v-else
                  :data-day="day"
                  :style="{ zIndex: getCellZIndex(emptyDaysBeforeFirst + index) }"
                >
                  <div class="teacher-empty-slot">
                    {{ day }}
                  </div>
                </div>
              </template>

              <!-- 1일 이후 빈 칸 (7의 배수로 맞추기) -->
              <div
                class="teacher-grid-cell"
                v-for="(i, index) in emptyDaysAfterLast"
                :key="`after-${i}`"
                :style="{ zIndex: getCellZIndex(emptyDaysBeforeFirst + daysInCurrentMonth + index) }"
              >
                <div class="teacher-empty-slot" style="opacity: 0;"></div>
              </div>
            </div>
          </div>
          </div>

          <!-- 우측: 선택한 날짜의 감정 상세 -->
          <div class="teacher-emotion-detail-section">
            <div v-if="!selectedDay" class="teacher-emotion-detail-empty">
              <div class="teacher-detail-empty-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                </svg>
              </div>
              <p class="teacher-detail-empty-text">화단에서 꽃을 클릭하면<br/>감정 정보를 확인할 수 있습니다</p>
            </div>

            <div v-else class="teacher-emotion-detail-content">
              <div class="teacher-emotion-detail-header">
                <h3 class="teacher-detail-date">{{ currentYear }}.{{ String(currentMonth).padStart(2, '0') }}.{{ String(selectedDay).padStart(2, '0') }} ({{ getDayOfWeek(selectedDay) }})</h3>
              </div>

              <!-- 꽃 & 핵심 감정 카드 (통합) -->
              <div class="teacher-emotion-flower-card">
                <div class="teacher-flower-image-large">
                  <LazyImage
                    :src="getFlowerPotImageUrl(selectedDay)"
                    :alt="getFlowerName(selectedDay)"
                    :image-class="isUnknownEmotion(selectedDay) ? 'unknown-flower' : ''"
                    skeleton-type="card"
                  />
                </div>
                <div class="teacher-flower-info">
                  <div class="teacher-flower-name-large">{{ getFlowerName(selectedDay) }}</div>
                  <div class="teacher-flower-meaning-large">"{{ getFlowerMeaning(selectedDay) }}"</div>
                </div>
                <div class="teacher-emotion-divider"></div>
                <div class="teacher-emotion-info-content">
                  <div class="teacher-emotion-label">핵심 감정</div>
                  <div class="teacher-emotion-name-large" :style="{ color: getEmotionColor(selectedDay) }">
                    {{ getEmotionName(selectedDay) }}
                  </div>
                  <div class="teacher-emotion-area-large">
                    <span class="teacher-area-badge" :class="getEmotionAreaClass(selectedDay)">
                      {{ getEmotionAreaName(selectedDay) }} 영역
                    </span>
                  </div>
                </div>
              </div>

              <!-- 감정 분포 -->
              <div v-if="getEmotionDistribution(selectedDay)" class="teacher-emotion-distribution-card">
                <div class="teacher-emotion-label">감정 분포</div>
                <div class="teacher-emotion-bars">
                  <div
                    v-for="emotion in getEmotionDistribution(selectedDay)"
                    :key="emotion.emotion"
                    class="teacher-emotion-bar-item"
                  >
                    <div class="teacher-emotion-bar-header">
                      <span class="teacher-emotion-bar-name">{{ emotion.emotionNameKr }}</span>
                      <span class="teacher-emotion-bar-percent">{{ emotion.percent }}%</span>
                    </div>
                    <div class="teacher-emotion-bar-track">
                      <div
                        class="teacher-emotion-bar-fill"
                        :style="{ width: emotion.percent + '%', backgroundColor: emotion.color }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 안내 메시지 -->
        <div v-if="!isLoading && !errorMessage" class="teacher-garden-notice">
          <p>💡 일기 내용은 조회할 수 없으며, 감정 정보만 확인할 수 있습니다</p>
        </div>
      </div>
    </template>
  </BaseTeacherModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BaseTeacherModal from './BaseTeacherModal.vue'
import LazyImage from '@/components/common/LazyImage.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  studentName: {
    type: String,
    default: ''
  },
  monthlyEmotions: {
    type: Object,
    default: null
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'change-month'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleClose = () => {
  emit('close')
}

// 요일
const weekDays = ['일', '월', '화', '수', '목', '금', '토']

// 선택한 날짜
const selectedDay = ref(null)

// 날짜 선택
const selectDay = (day) => {
  selectedDay.value = day
}

// 현재 년월 (monthlyEmotions에서 추출)
const currentYear = computed(() => {
  if (!props.monthlyEmotions?.yearMonth) return new Date().getFullYear()
  return parseInt(props.monthlyEmotions.yearMonth.split('-')[0])
})

const currentMonth = computed(() => {
  if (!props.monthlyEmotions?.yearMonth) return new Date().getMonth() + 1
  return parseInt(props.monthlyEmotions.yearMonth.split('-')[1])
})

// 해당 월의 일수
const daysInCurrentMonth = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  return new Date(year, month, 0).getDate()
})

// 1일이 무슨 요일인지 (0=일요일)
const emptyDaysBeforeFirst = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  return new Date(year, month - 1, 1).getDay()
})

// 마지막 날 이후 빈 칸 개수
const emptyDaysAfterLast = computed(() => {
  const totalCells = emptyDaysBeforeFirst.value + daysInCurrentMonth.value
  const remainder = totalCells % 7
  return remainder === 0 ? 0 : 7 - remainder
})

// 필요한 주차 수 (행 개수)
const totalWeeks = computed(() => {
  const totalCells = emptyDaysBeforeFirst.value + daysInCurrentMonth.value
  return Math.ceil(totalCells / 7)
})

// 화단 그리드 스타일
const gardenGridStyle = computed(() => {
  return {
    gridTemplateRows: `repeat(${totalWeeks.value}, 1fr)`
  }
})

// 셀의 z-index 계산 (행 번호 기준)
const getCellZIndex = (cellIndex) => {
  // cellIndex는 0부터 시작, 행 번호는 Math.floor(cellIndex / 7) + 1
  const rowNumber = Math.floor(cellIndex / 7) + 1
  return rowNumber
}

// 일기 데이터를 날짜별로 매핑
const emotionsByDate = computed(() => {
  if (!props.monthlyEmotions?.emotions) return {}

  const map = {}
  props.monthlyEmotions.emotions.forEach(emotion => {
    const day = parseInt(emotion.date.split('-')[2])
    map[day] = emotion
  })
  return map
})

// 특정 날짜의 감정 데이터 가져오기
const getEmotionForDay = (day) => {
  return emotionsByDate.value[day]
}

// 미분석 감정 확인
const isUnknownEmotion = (day) => {
  const emotion = getEmotionForDay(day)
  return !emotion?.isAnalyzed
}

// 꽃 이미지 URL
const getFlowerImageUrl = (day) => {
  const emotion = getEmotionForDay(day)
  if (!emotion?.isAnalyzed || !emotion?.coreEmotionDetail) {
    return '/flowers/3d/unknown.png'
  }
  return `/flowers/3d/${emotion.coreEmotionDetail.imageFile3d}`
}

// 꽃 이름
const getFlowerName = (day) => {
  const emotion = getEmotionForDay(day)
  if (!emotion?.isAnalyzed || !emotion?.coreEmotionDetail) {
    return '알 수 없음'
  }
  return emotion.coreEmotionDetail.flowerNameKr
}

// 꽃말
const getFlowerMeaning = (day) => {
  const emotion = getEmotionForDay(day)
  if (!emotion?.isAnalyzed || !emotion?.coreEmotionDetail) {
    return '감정을 분석 할 수 없어요'
  }
  return emotion.coreEmotionDetail.flowerMeaning
}

// 감정 이름
const getEmotionName = (day) => {
  const emotion = getEmotionForDay(day)
  if (!emotion?.isAnalyzed || !emotion?.coreEmotionDetail) {
    return '알 수 없음'
  }
  return emotion.coreEmotionDetail.emotionNameKr
}

// 감정 색상 가져오기
const getEmotionColor = (day) => {
  const emotion = getEmotionForDay(day)
  if (!emotion?.isAnalyzed || !emotion?.coreEmotionDetail) {
    return '#A0927D'
  }
  return emotion.coreEmotionDetail.color || '#8B6F47'
}

// 감정 영역 클래스
const getEmotionAreaClass = (day) => {
  const emotion = getEmotionForDay(day)
  if (!emotion?.isAnalyzed || !emotion?.coreEmotionDetail) {
    return 'area-none'
  }
  const area = emotion.coreEmotionDetail.emotionArea
  return `area-${area}`
}

// 감정 영역명
const getEmotionAreaName = (day) => {
  const emotion = getEmotionForDay(day)
  if (!emotion?.isAnalyzed || !emotion?.coreEmotionDetail) {
    return '없음'
  }
  const areaNames = {
    red: '빨강',
    yellow: '노랑',
    blue: '파랑',
    green: '초록'
  }
  return areaNames[emotion.coreEmotionDetail.emotionArea] || '알 수 없음'
}

// 감정 분포 가져오기
const getEmotionDistribution = (day) => {
  const emotion = getEmotionForDay(day)
  if (!emotion?.isAnalyzed || !emotion?.emotions) {
    return null
  }
  return emotion.emotions
}

// 날짜의 요일 가져오기
const getDayOfWeek = (day) => {
  const year = currentYear.value
  const month = currentMonth.value
  const date = new Date(year, month - 1, day)
  const dayIndex = date.getDay()
  return weekDays[dayIndex]
}

// 꽃 화분 이미지 URL (우측 상세용)
const getFlowerPotImageUrl = (day) => {
  const emotion = getEmotionForDay(day)
  if (!emotion?.isAnalyzed || !emotion?.coreEmotionDetail) {
    return '/flowers/3d_pot/unknown.png'
  }
  return `/flowers/3d_pot/${emotion.coreEmotionDetail.imageFile3d}`
}

// 월 변경
const changeMonth = (delta) => {
  const year = currentYear.value
  const month = currentMonth.value + delta

  let newYear = year
  let newMonth = month

  if (newMonth > 12) {
    newYear += 1
    newMonth = 1
  } else if (newMonth < 1) {
    newYear -= 1
    newMonth = 12
  }

  const yearMonth = `${newYear}-${String(newMonth).padStart(2, '0')}`
  selectedDay.value = null // 월 변경 시 선택 초기화
  emit('change-month', yearMonth)
}
</script>
