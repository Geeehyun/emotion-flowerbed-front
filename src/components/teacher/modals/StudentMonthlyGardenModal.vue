<template>
  <BaseModal
    v-model="isOpen"
    :title="`${studentName}의 감정 화단`"
    max-width="900px"
    @close="handleClose"
  >
    <template #default>
      <div class="teacher-garden-modal-content">
        <!-- 월 선택 바 -->
        <div class="teacher-month-selector">
          <button class="teacher-month-nav" @click="changeMonth(-1)">◀</button>
          <div class="teacher-month-display">{{ currentYear }}년 {{ currentMonth }}월</div>
          <button class="teacher-month-nav" @click="changeMonth(1)">▶</button>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="isLoading" class="teacher-garden-loading">
          <p>감정 화단을 불러오는 중...</p>
        </div>

        <!-- 에러 상태 -->
        <div v-else-if="errorMessage" class="teacher-garden-error">
          <p>{{ errorMessage }}</p>
        </div>

        <!-- 감정 화단 -->
        <div v-else class="teacher-garden-section">
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
            <div class="teacher-flower-grid">
              <!-- 1일 이전 빈 칸 -->
              <div class="teacher-grid-cell" v-for="i in emptyDaysBeforeFirst" :key="`before-${i}`">
                <div class="teacher-empty-slot" style="opacity: 0;"></div>
              </div>

              <!-- 감정 일기가 있는 날들 -->
              <template v-for="day in daysInCurrentMonth" :key="day">
                <div class="teacher-grid-cell" v-if="getEmotionForDay(day)" :data-day="day">
                  <div class="teacher-flower">
                    <img
                      :src="getFlowerImageUrl(day)"
                      :alt="getFlowerName(day)"
                      :class="isUnknownEmotion(day) ? 'teacher-flower-image unknown-flower' : 'teacher-flower-image'"
                      loading="lazy"
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
                <div class="teacher-grid-cell" v-else :data-day="day">
                  <div class="teacher-empty-slot">
                    {{ day }}
                  </div>
                </div>
              </template>

              <!-- 1일 이후 빈 칸 (7의 배수로 맞추기) -->
              <div class="teacher-grid-cell" v-for="i in emptyDaysAfterLast" :key="`after-${i}`">
                <div class="teacher-empty-slot" style="opacity: 0;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 안내 메시지 -->
        <div class="teacher-garden-notice">
          <p>💡 일기 내용은 조회할 수 없으며, 감정 정보만 확인할 수 있습니다</p>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/common/modals/BaseModal.vue'

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
    return '분석 중...'
  }
  return emotion.coreEmotionDetail.flowerMeaning
}

// 감정 이름
const getEmotionName = (day) => {
  const emotion = getEmotionForDay(day)
  if (!emotion?.isAnalyzed || !emotion?.coreEmotionDetail) {
    return '분석 중'
  }
  return emotion.coreEmotionDetail.emotionNameKr
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
  emit('change-month', yearMonth)
}
</script>
