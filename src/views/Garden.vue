<template>
  <div class="relative min-h-screen flex flex-col overflow-hidden">
    <!-- 움직이는 물방울 배경 -->
    <div class="polka-dot-bg">
      <div class="dots-layer dots-layer-1"></div>
      <div class="dots-layer dots-layer-2"></div>
    </div>

    <!-- 상단 타이틀 (main-container 밖으로 이동) -->
    <div class="header-section">
      <!-- 햄버거 메뉴 버튼 (좌측) -->
      <button
        class="hamburger-btn"
        @click="toggleSidebar"
        title="메뉴"
      >
        <Bars3Icon class="w-8 h-8" />
      </button>
      <!-- 데스크톱: 한 줄 타이틀 -->
      <h1 class="page-title desktop-title">나의 감정 화단</h1>
      <!-- 모바일: 두 줄 타이틀 -->
      <h1 class="page-title mobile-title">나의<br>감정 화단</h1>
    </div>

    <div class="main-container">

      <!-- 화단 영역 -->
      <div class="garden-section">
        <!-- 요일 헤더 (화단과 분리) -->
        <div class="weekday-header-container">
          <div class="weekday-header" v-for="day in weekDays" :key="`weekday-${day}`">
            {{ day }}
          </div>
        </div>

        <div class="garden-wrapper">
          <!-- 화단 배경 이미지 -->
          <img src="../assets/images/garden-bg-rectangle.png" alt="화단" class="garden-bg-image" loading="lazy">

          <!-- 격자 그리드로 꽃 배치 -->
          <div class="flower-grid">
            <!-- 1일 이전 빈 칸 -->
            <div class="grid-cell" v-for="i in emptyDaysBeforeFirst" :key="`before-${i}`">
              <div class="empty-slot" style="opacity: 0; cursor: default;"></div>
            </div>

            <!-- 일기가 있는 날들 -->
            <template v-for="day in daysInCurrentMonth" :key="day">
              <div class="grid-cell" v-if="diaryData[day]" :data-day="day">
                <div class="flower relative" @click="openDiary(day)">
                  <LazyImage
                    :src="getFlowerImageUrl(day)"
                    :alt="getFlowerName(day)"
                    :image-class="getFlowerDataForDay(day).emotionCode === 'UNKNOWN' ? 'flower-image unknown-flower' : 'flower-image'"
                    skeleton-type="default"
                  />
                  <div class="tooltip">
                    <div class="tooltip-card">
                      <div class="tooltip-flower-name">{{ getFlowerName(day) }}</div>
                      <div class="tooltip-meaning">"{{ getFlowerMeaning(day) }}"</div>
                      <div class="tooltip-date">{{ diaryData[day].date }}</div>
                      <div class="tooltip-emotion">{{ getEmotionNameKr(day) }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 빈 칸 -->
              <div class="grid-cell" v-else :data-day="day">
                <div class="empty-slot" @click="startPlanting(day)">
                  {{ day }}
                  <!-- 날짜 툴팁 -->
                  <div class="date-tooltip">
                    <div class="date-tooltip-card">
                      {{ currentMonth }}월 {{ day }}일
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- 1일 이후 빈 칸 (7의 배수로 맞추기) -->
            <div class="grid-cell" v-for="i in emptyDaysAfterLast" :key="`after-${i}`">
              <div class="empty-slot" style="opacity: 0; cursor: default;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 월 선택 바 (하단 고정) -->
      <div class="month-selector-bar">
        <button class="encyclopedia-btn" @click="openEncyclopedia" title="감정 도감">
          <BookOpenIcon class="w-6 h-6" />
        </button>
        <button class="month-nav" @click="changeMonth(-1)">◀</button>
        <div class="month-display" @click="openDatePicker">{{ currentYear }}년 {{ currentMonth }}월</div>
        <button class="month-nav" @click="changeMonth(1)">▶</button>
        <button class="write-diary-btn" @click="openWriteDiaryWithDatePicker" title="일기 작성">
          <img src="/icons/trowel.png" alt="일기 작성" class="trowel-icon" loading="lazy" />
        </button>
      </div>
    </div>

    <!-- 일기 읽기 모달 -->
    <DiaryReadModal
      v-model="showDiaryModal"
      :diary="currentDiary"
      :flower-detail="currentFlowerDetail"
      :is-flipped="isFlipped"
      :is-unanalyzed="isUnanalyzed"
      :postit-positions="postitPositions"
      :realistic-image="currentDiaryRealisticImage"
      :all-emotions-data="allEmotionsData"
      @close="closeDiaryModal"
      @toggle-flip="toggleFlip"
      @save-image="saveFlowerAsImage"
      @reanalyze="reanalyzeDiary"
      @reanalyze-test="reanalyzeDiaryTest"
      @delete="deleteDiaryEntry"
      @drag-start="startDrag"
    />


    <!-- 일기 작성 모달 -->
    <DiaryWriteModal
      v-model="showWriteModal"
      :date="writeModalDate"
      v-model:content="diaryContent"
      @close="closeWriteModal"
      @save="saveDiary"
    />

    <!-- AI 로딩 모달 -->
    <LoadingModal v-model="showLoading" :message="loadingMessage" />

    <!-- 커스텀 알럿 모달 -->
    <AlertModal
      v-model="showAlert"
      :message="alertMessage"
      :type="alertType"
      @close="closeAlert"
    />

    <!-- 감정 도감 모달 -->
    <EncyclopediaModal
      v-model="showEncyclopedia"
      :acquired-emotions="acquiredEmotions"
      :all-emotions="allEmotionsData"
      :selected-emotion="selectedEncyclopediaEmotion"
      :get3d-image="get3dPotImageFromDetail"
      :get-realistic-image="getRealisticImageFromDetail"
      @close="closeEncyclopedia"
      @select-emotion="selectEncyclopediaEmotion"
      @open-mood-meter-guide="openMoodMeterGuide"
    />


    <!-- 이미지 미리보기 모달 -->
    <ImagePreviewModal
      v-model="showImagePreview"
      :image-url="previewImageUrl"
      @close="closeImagePreview"
      @download="downloadImage"
    />

    <!-- 날짜 선택 모달 (모바일 친화적) -->
    <DatePickerModal
      v-model="showDatePicker"
      :year="selectedYear"
      :month="selectedMonth"
      :day="selectedDay"
      :is-write-mode="isWriteDiaryMode"
      :days-in-month="daysInSelectedMonth"
      @close="closeDatePicker"
      @confirm="confirmDate"
      @change-year="changeSelectedYear"
      @change-month="changeSelectedMonth"
      @select-day="selectDay"
    />

    <!-- 사이드바 메뉴 -->
    <SidebarMenu
      v-model="showSidebar"
      :has-new-letter="hasNewLetter"
      @menu-select="handleMenuSelect"
    />

    <!-- 레터 알림 모달 -->
    <LetterNotificationModal
      v-model="showLetterNotification"
      @confirm="openLetter"
    />

    <!-- 감정 레터 목록 모달 -->
    <LetterListModal
      v-model="showLetterList"
      @select-letter="handleSelectLetter"
      @close="showLetterList = false"
    />

    <!-- 감정 레터 상세 모달 -->
    <LetterDetailModal
      v-model="showLetterDetail"
      :letter="selectedLetter"
      @close="showLetterDetail = false"
      @open-diary="handleOpenDiaryFromLetter"
      @back-to-list="handleBackToLetterList"
    />

    <!-- 감정 무드미터 가이드 모달 -->
    <MoodMeterGuideModal
      v-model="showMoodMeterGuide"
    />

    <!-- 감정 가꾸기 모달 -->
    <EmotionControlModal
      v-model="showEmotionControl"
      :activities="emotionControlActivities"
      @close="showEmotionControl = false"
    />

    <!-- 3일 연속 감정 토스트 -->
    <EmotionContinuousToast
      v-model="showContinuousToast"
      :emotion-name="continuousEmotionData.emotionName"
      :emotion-icon="continuousEmotionData.emotionIcon"
      :consecutive-days="continuousEmotionData.consecutiveDays"
      :activity-name="continuousEmotionData.activityName"
      :activity-icon="continuousEmotionData.activityIcon"
      :emotion-area="continuousEmotionData.emotionArea"
      @close="showContinuousToast = false"
    />

    <!-- 리포트 템플릿 (이미지 캡처용, 화면에 보이지 않음) -->
    <div v-if="currentDiary" class="report-capture-container" ref="reportCaptureRef">
      <DiaryReportTemplate
        :diary="currentDiary"
        :flower-detail="currentFlowerDetail"
        :realistic-image="currentDiaryRealisticImage"
        :emotion-name="currentEmotionName"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { get3dImageFromDetail, get3dPotImageFromDetail, getRealisticImageFromDetail, getEmotionData, UNKNOWN_EMOTION } from '../utils/flowerMapper.js'
import { AREA_EMOJIS, AREA_SHORT_NAMES } from '../utils/emotionAreaMapper.js'
import * as diaryApi from '../services/diaryApi.js'
import * as weeklyReportApi from '../services/weeklyReportApi.js'
import { logout } from '../services/authApi.js'
import { ArrowPathIcon, XMarkIcon, PlusCircleIcon, ArrowDownTrayIcon, BookOpenIcon, Bars3Icon } from '@heroicons/vue/24/outline'
import html2canvas from 'html2canvas'

// 컴포넌트 import
// 레이아웃 컴포넌트
import SidebarMenu from '@/components/layout/SidebarMenu.vue'
import DatePickerModal from '@/components/layout/DatePickerModal.vue'

// 공통 모달 컴포넌트
import LoadingModal from '@/components/common/modals/LoadingModal.vue'
import AlertModal from '@/components/common/modals/AlertModal.vue'
import ImagePreviewModal from '@/components/common/modals/ImagePreviewModal.vue'
import LazyImage from '@/components/common/LazyImage.vue'

// 비즈니스 컴포넌트
import DiaryWriteModal from '@/components/diary/DiaryWriteModal.vue'
import DiaryReadModal from '@/components/diary/DiaryReadModal.vue'
import DiaryReportTemplate from '@/components/diary/DiaryReportTemplate.vue'
import EncyclopediaModal from '@/components/encyclopedia/EncyclopediaModal.vue'
import LetterNotificationModal from '@/components/letter/LetterNotificationModal.vue'
import LetterListModal from '@/components/letter/LetterListModal.vue'
import LetterDetailModal from '@/components/letter/LetterDetailModal.vue'
import MoodMeterGuideModal from '@/components/guide/MoodMeterGuideModal.vue'
import EmotionControlModal from '@/components/common/modals/EmotionControlModal.vue'
import EmotionContinuousToast from '@/components/common/EmotionContinuousToast.vue'

// 유틸리티
import * as dateUtils from '@/utils/dateUtils.js'

// 상수
import {
  MIN_MONTH,
  MAX_MONTH,
  YEAR_RANGE_PAST,
  YEAR_RANGE_FUTURE,
  YEAR_LIMIT_PAST,
  YEAR_LIMIT_FUTURE
} from '@/constants/dateConstants.js'
import {
  GARDEN_GRID_SIZE,
  ANIMATION_DELAY,
  REPORT_CAPTURE
} from '@/constants/uiConstants.js'
import { STORAGE_KEYS } from '@/constants/storageKeys.js'

// 상태 관리
const currentDay = ref(null)
const showDiaryModal = ref(false)
const showWriteModal = ref(false)
const diaryContent = ref('')
const showLoading = ref(false)
const loadingMessage = ref('로딩중...')
const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref('success')
// const selectedEmotion = ref('기쁨') // AI 감정 분석으로 대체됨
const { year: currentYearInit, month: currentMonthInit, day: currentDayInit } = dateUtils.getCurrentDate()
const currentYear = ref(currentYearInit)
const currentMonth = ref(currentMonthInit)
const showDatePicker = ref(false)
const selectedYear = ref(currentYearInit)
const selectedMonth = ref(currentMonthInit)
const selectedDay = ref(currentDayInit)
const isFlipped = ref(false) // 일기 모달 뒤집기 상태
const isWriteDiaryMode = ref(false) // 일기 작성 버튼으로 날짜 선택 모드
const showEncyclopedia = ref(false) // 도감 모달 표시 상태
const selectedEncyclopediaEmotion = ref(null) // 도감에서 선택한 감정
const allEmotionsData = ref([]) // 전체 감정 데이터 (API에서 로드)
const myEmotionsData = ref([]) // 내가 획득한 감정 데이터
const showImagePreview = ref(false) // 이미지 미리보기 모달
const previewImageUrl = ref('') // 미리보기 이미지 URL
const reportCaptureRef = ref(null) // 리포트 템플릿 캡처용 ref
const showSidebar = ref(false) // 사이드바 메뉴 표시 상태

const hasNewLetter = ref(false) // 안 읽은 레터 존재 여부 (사이드바 N 뱃지용)
const showLetterNotification = ref(false) // 레터 알림 모달 표시 상태
const showLetterList = ref(false) // 레터 목록 모달 표시 상태
const showLetterDetail = ref(false) // 레터 상세 모달 표시 상태
const selectedLetter = ref(null) // 선택된 레터
const showMoodMeterGuide = ref(false) // 무드미터 가이드 모달 표시 상태
const showEmotionControl = ref(false) // 감정 가꾸기 모달 표시 상태
const emotionControlActivities = ref([]) // 감정 가꾸기 활동 목록
const emotionCareData = ref(null) // 감정 가꾸기 데이터 { area: 'red', type: 'immediate' }
const showContinuousToast = ref(false) // 3일 연속 감정 토스트 표시 상태
const continuousEmotionData = ref({
  emotionName: '',
  emotionIcon: '',
  consecutiveDays: 0,
  activityName: '',
  activityIcon: '',
  emotionArea: 'red'
})

// 포스트잇 드래그 상태
const postitPositions = ref({
  name: {},
  meaning: {}
})
const dragState = ref({
  isDragging: false,
  currentPostit: null,
  startX: 0,
  startY: 0,
  initialLeft: 0,
  initialRight: 0,
  initialBottom: 0
})

// 일기 데이터 - API에서 로드됨
const diaryData = ref({})
// 레터에서 직접 조회한 일기 데이터 (화단 데이터와 분리)
const directDiary = ref(null)

// 현재 일기의 상세 꽃 정보
const currentFlowerDetail = computed(() => {
  return currentDiary.value?.flowerDetail || null
})

// 현재 일기의 realistic 이미지
const currentDiaryRealisticImage = computed(() => {
  if (!currentDiary.value) return ''

  // flowerDetail이 있으면 사용
  if (currentFlowerDetail.value) {
    return getRealisticImageFromDetail(currentFlowerDetail.value.imageFileRealistic)
  }

  // emotion 코드로 API 데이터에서 찾기
  if (currentDiary.value.emotion) {
    const emotionData = getEmotionData(allEmotionsData.value, currentDiary.value.emotion)
    if (emotionData) {
      return getRealisticImageFromDetail(emotionData.imageFileRealistic)
    }
  }

  return getRealisticImageFromDetail(UNKNOWN_EMOTION.imageFileRealistic)
})

// 현재 일기의 감정 이름
const currentEmotionName = computed(() => {
  if (!currentDiary.value) return '알 수 없음'

  // flowerDetail이 있으면 사용
  if (currentFlowerDetail.value) {
    return currentFlowerDetail.value.emotionNameKr || '알 수 없음'
  }

  // emotion 코드로 API 데이터에서 찾기
  if (currentDiary.value.emotion) {
    const emotionData = getEmotionData(allEmotionsData.value, currentDiary.value.emotion)
    if (emotionData) {
      return emotionData.emotionNameKr || '알 수 없음'
    }
  }

  return '알 수 없음'
})

// 분석 안된 일기인지 확인
const isUnanalyzed = computed(() => {
  return !currentDiary.value || !currentDiary.value.isAnalyzed
})

// 획득한 감정 목록 (전체 기간 기준 - API 데이터)
const acquiredEmotions = computed(() => {
  const emotions = new Set()
  myEmotionsData.value.forEach(item => {
    // emotionCode는 flowerDetail 안에 있음
    const code = item.flowerDetail?.emotionCode || item.emotion
    if (code) {
      emotions.add(code)
    }
  })
  return emotions
})

// 모든 감정 목록 (API 데이터)
const allEmotions = computed(() => {
  return allEmotionsData.value.map(emotion => emotion.emotionCode)
})

// 특정 날짜의 일기에서 꽃 데이터 가져오기
const getFlowerDataForDay = (day) => {
  const diary = diaryData.value[day]
  if (!diary) return UNKNOWN_EMOTION

  // flowerDetail이 있으면 우선 사용
  if (diary.flowerDetail) {
    return diary.flowerDetail
  }

  // emotion 코드로 API 데이터에서 찾기
  if (diary.emotion) {
    const emotionData = getEmotionData(allEmotionsData.value, diary.emotion)
    if (emotionData) return emotionData
  }

  return UNKNOWN_EMOTION
}

// 특정 날짜의 꽃 이미지 URL 가져오기
const getFlowerImageUrl = (day) => {
  const flowerData = getFlowerDataForDay(day)
  return get3dImageFromDetail(flowerData.imageFile3d)
}

// 특정 날짜의 꽃 이름 가져오기
const getFlowerName = (day) => {
  const flowerData = getFlowerDataForDay(day)
  return flowerData.flowerNameKr || '알 수 없음'
}

// 특정 날짜의 꽃말 가져오기
const getFlowerMeaning = (day) => {
  const flowerData = getFlowerDataForDay(day)
  return flowerData.flowerMeaning || '감정을 분석할 수 없어요'
}

// 특정 날짜의 감정명 가져오기
const getEmotionNameKr = (day) => {
  const flowerData = getFlowerDataForDay(day)
  return flowerData.emotionNameKr || '알 수 없음'
}

// Computed
const currentDiary = computed(() => {
  // 레터에서 직접 조회한 일기가 있으면 우선 사용 (화단 데이터와 분리)
  if (directDiary.value) {
    return directDiary.value
  }
  // 화단에서 선택한 일기
  return currentDay.value ? diaryData.value[currentDay.value] : null
})

const writeModalDate = computed(() => {
  return currentDay.value ? `${currentMonth.value}월 ${currentDay.value}일` : '오늘의 일기'
})

const yearOptions = computed(() => {
  const currentYearValue = dateUtils.getCurrentDate().year
  const years = []
  for (let i = currentYearValue - YEAR_RANGE_PAST; i <= currentYearValue + YEAR_RANGE_FUTURE; i++) {
    years.push(i)
  }
  return years
})

// 선택된 월의 일 수 계산
const daysInSelectedMonth = computed(() => {
  return dateUtils.getMonthDays(selectedYear.value, selectedMonth.value)
})

// 현재 월의 일 수 계산
const daysInCurrentMonth = computed(() => {
  return dateUtils.getDaysInMonth(currentYear.value, currentMonth.value)
})

// 요일 이름 배열
const weekDays = ['일', '월', '화', '수', '목', '금', '토']

// 현재 월의 1일이 무슨 요일인지 계산 (0: 일요일, 6: 토요일)
const firstDayOfWeek = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value - 1, 1)
  return firstDay.getDay()
})

// 1일 이전 빈 칸 개수
const emptyDaysBeforeFirst = computed(() => {
  return firstDayOfWeek.value
})

// 1일 이후 빈 칸 개수 (7의 배수로 맞추기)
const emptyDaysAfterLast = computed(() => {
  const totalCells = emptyDaysBeforeFirst.value + daysInCurrentMonth.value
  const remainder = totalCells % 7
  return remainder === 0 ? 0 : 7 - remainder
})

// 기존 빈 칸 개수 계산 (그리드 총 칸 수 - 현재 월의 일 수)
// 요일 정렬 방식으로 변경되어 더 이상 사용하지 않음
const emptySlotCount = computed(() => {
  return GARDEN_GRID_SIZE - daysInCurrentMonth.value
})

// 월별 일기 목록 로드
const loadMonthlyDiaries = async () => {
  loadingMessage.value = '일기 목록을 불러오는 중...'
  showLoading.value = true
  try {
    const yearMonth = dateUtils.formatYearMonth(currentYear.value, currentMonth.value)
    const response = await diaryApi.getDiaries(yearMonth)

    console.log('월별 일기 목록:', response)

    // 일기 데이터 초기화 후 새로 채우기
    diaryData.value = {}

    response.diaries.forEach(diary => {
      const day = new Date(diary.date).getDate()
      diaryData.value[day] = {
        id: diary.id,
        date: `${currentMonth.value}월 ${day}일`,
        isAnalyzed: diary.isAnalyzed,
        emotion: diary.coreEmotion,
        content: diary.content,
        summary: diary.summary,
        flower: diary.flower,
        floriography: diary.floriography,
        emotions: diary.emotions || [],
        reason: diary.reason || '',
        flowerDetail: diary.flowerDetail || null
      }
    })
    showLoading.value = false
  } catch (error) {
    console.error('월별 일기 로드 에러:', error)
    showLoading.value = false
    // 에러 시 빈 데이터로 초기화
    diaryData.value = {}
    showCustomAlert('일기 목록을 불러올 수 없습니다.', 'error')
  }
}

// 월 변경
const changeMonth = (delta) => {
  currentMonth.value += delta
  if (currentMonth.value < MIN_MONTH) {
    currentMonth.value = MAX_MONTH
    currentYear.value -= 1
  }
  if (currentMonth.value > MAX_MONTH) {
    currentMonth.value = MIN_MONTH
    currentYear.value += 1
  }

  // 월이 변경되면 일기 목록 다시 로드
  loadMonthlyDiaries()
}

// 날짜 선택 모달
const openDatePicker = () => {
  selectedYear.value = currentYear.value
  selectedMonth.value = currentMonth.value
  showDatePicker.value = true
}

const closeDatePicker = () => {
  showDatePicker.value = false
  isWriteDiaryMode.value = false
}

const selectYear = (year) => {
  selectedYear.value = year
}

const selectMonth = (month) => {
  selectedMonth.value = month
}

const selectDay = (day) => {
  selectedDay.value = day
}

// 선택된 연도 변경
const changeSelectedYear = (delta) => {
  selectedYear.value += delta
  // 연도 범위 제한
  const currentYearValue = dateUtils.getCurrentDate().year
  if (selectedYear.value < currentYearValue - YEAR_LIMIT_PAST) {
    selectedYear.value = currentYearValue - YEAR_LIMIT_PAST
  }
  if (selectedYear.value > currentYearValue + YEAR_LIMIT_FUTURE) {
    selectedYear.value = currentYearValue + YEAR_LIMIT_FUTURE
  }
}

// 선택된 월 변경
const changeSelectedMonth = (delta) => {
  selectedMonth.value += delta
  if (selectedMonth.value < 1) {
    selectedMonth.value = 12
    changeSelectedYear(-1)
  }
  if (selectedMonth.value > 12) {
    selectedMonth.value = 1
    changeSelectedYear(1)
  }
}

const confirmDate = () => {
  if (isWriteDiaryMode.value) {
    // 일기 작성 모드: 선택한 날짜로 일기 작성 또는 조회
    handleWriteDiaryFromDatePicker()
  } else {
    // 일반 모드: 월 변경
    currentYear.value = selectedYear.value
    currentMonth.value = selectedMonth.value
    closeDatePicker()
    loadMonthlyDiaries()
  }
}

// 일기 작성 버튼 클릭
const openWriteDiaryWithDatePicker = () => {
  isWriteDiaryMode.value = true
  selectedYear.value = currentYear.value
  selectedMonth.value = currentMonth.value
  selectedDay.value = new Date().getDate()
  showDatePicker.value = true
}

// 날짜 선택 후 일기 작성/조회 처리
const handleWriteDiaryFromDatePicker = async () => {
  const year = selectedYear.value
  const month = selectedMonth.value
  const day = selectedDay.value

  closeDatePicker()
  isWriteDiaryMode.value = false

  // 선택한 월로 이동 (다른 월 선택 시)
  if (currentYear.value !== year || currentMonth.value !== month) {
    currentYear.value = year
    currentMonth.value = month
    await loadMonthlyDiaries()
  }

  // 해당 날짜에 일기가 있는지 확인
  if (diaryData.value[day]) {
    // 일기가 있으면 조회
    openDiary(day)
  } else {
    // 일기가 없으면 작성
    startPlanting(day)
  }
}

// 심기 시작 (모달 열기)
const startPlanting = (day) => {
  currentDay.value = day
  showWriteModal.value = true
}

// 일기 작성 모달 닫기
const closeWriteModal = () => {
  showWriteModal.value = false
  currentDay.value = null
  diaryContent.value = ''
}

// 일기 저장
const saveDiary = async (isTest = true, area = null) => {
  if (!currentDay.value) return
  if (!diaryContent.value.trim()) {
    showCustomAlert('일기 내용을 입력해주세요!', 'info')
    return
  }

  console.log(`${currentDay.value}일 일기 저장:`, diaryContent.value)
  console.log(`분석 모드: ${isTest ? '테스트(랜덤)' : 'AI LLM'}`)
  if (area) console.log(`선택 영역: ${area}`)

  // 로딩 화면 표시
  showWriteModal.value = false
  loadingMessage.value = 'AI가 당신의 감정을 분석하고 있어요...'
  showLoading.value = true

  try {
    // 1. 일기 작성 API 호출
    const diaryDate = dateUtils.formatFullDate(currentYear.value, currentMonth.value, currentDay.value)

    const createdDiary = await diaryApi.createDiary({
      diaryDate: diaryDate,
      content: diaryContent.value
    })

    // 2. 일기 저장된 데이터로 우선 표시 (분석 후 한번 더 추가)
    diaryData.value[currentDay.value] = {
      id: createdDiary.id,
      date: `${currentMonth.value}월 ${currentDay.value}일`,
      content: createdDiary.content,
      isAnalyzed: false
    }

    console.log('일기 생성 성공:', createdDiary)

    // 3. 감정 분석 API 호출 (테스트 or Claude AI)
    const analyzedDiary = isTest
      ? await diaryApi.analyzeDiaryTest(createdDiary.diaryId, area)
      : await diaryApi.analyzeDiary(createdDiary.diaryId)

    console.log('감정 분석 결과:', analyzedDiary)

    // 4. 화면에 표시
    diaryData.value[currentDay.value] = {
      id: analyzedDiary.id,
      date: `${currentMonth.value}월 ${currentDay.value}일`,
      emotion: analyzedDiary.coreEmotion, // 영어 코드 (JOY, PEACE 등)
      content: analyzedDiary.content,
      isAnalyzed: analyzedDiary.isAnalyzed,
      summary: analyzedDiary.summary,
      flower: analyzedDiary.flower,
      floriography: analyzedDiary.floriography,
      emotions: analyzedDiary.emotions || [],
      reason: analyzedDiary.emotionReason || '',
      flowerDetail: analyzedDiary.flowerDetail || null
    }

    // 5. 감정 조절 팁 체크 및 표시
    if (analyzedDiary.showEmotionControlTip && analyzedDiary.emotionControlTipCode) {
      try {
        // emotionControlTipCode로 활동 조회
        const { getEmotionControlActivities } = await import('@/services/codeApi.js')
        const allActivities = await getEmotionControlActivities()
        const tipData = allActivities.find(activity => activity.code === analyzedDiary.emotionControlTipCode)

        if (!tipData) {
          console.warn('감정 조절 팁을 찾을 수 없음:', analyzedDiary.emotionControlTipCode)
          throw new Error('해당 활동을 찾을 수 없습니다.')
        }

        continuousEmotionData.value = {
          emotionName: AREA_SHORT_NAMES[analyzedDiary.repeatedEmotionArea?.toLowerCase()] || '특정',
          emotionIcon: AREA_EMOJIS[analyzedDiary.repeatedEmotionArea?.toLowerCase()] || '🌸',
          consecutiveDays: analyzedDiary.consecutiveSameAreaDays || 0,
          activityName: tipData.codeName,
          activityIcon: AREA_EMOJIS[analyzedDiary.repeatedEmotionArea?.toLowerCase()] || '🌸',
          emotionArea: analyzedDiary.repeatedEmotionArea?.toLowerCase() || 'red'
        }

        showContinuousToast.value = true
      } catch (error) {
        console.error('감정 조절 팁 로드 실패:', error)
        // 에러 발생 시 토스트 표시 안 함 (조용히 실패)
      }
    }

    showLoading.value = false
    showCustomAlert('일기가 저장되었습니다!', 'success')

    currentDay.value = null
    diaryContent.value = ''
  } catch (error) {
    console.error('일기 저장 에러:', error)
    showLoading.value = false
    showCustomAlert(`일기 저장에 실패했습니다.\n${error.message}`, 'error')
    currentDay.value = null
    diaryContent.value = ''
  }
}

// 일기 읽기 모달 열기
const openDiary = (day) => {
  const diary = diaryData.value[day]
  if (diary) {
    currentDay.value = day
    showDiaryModal.value = true
  }
}

// 일기 읽기 모달 닫기
const closeDiaryModal = () => {
  showDiaryModal.value = false
  currentDay.value = null
  isFlipped.value = false // 뒤집기 상태 초기화
  directDiary.value = null // 레터에서 조회한 일기 데이터 초기화
}

// 일기 모달 뒤집기
const toggleFlip = () => {
  isFlipped.value = !isFlipped.value
  // 뒤집을 때 포스트잇 위치 초기화
  if (isFlipped.value) {
    postitPositions.value = {
      name: {},
      meaning: {}
    }
  }
}

// 포스트잇 드래그 시작
const startDrag = (event, postitType) => {
  event.preventDefault()
  dragState.value.isDragging = true
  dragState.value.currentPostit = postitType
  dragState.value.startX = event.clientX
  dragState.value.startY = event.clientY

  const element = event.currentTarget
  const rect = element.getBoundingClientRect()
  const parent = element.offsetParent.getBoundingClientRect()

  // name은 left 기준, meaning은 right 기준
  if (postitType === 'name') {
    dragState.value.initialLeft = rect.left - parent.left
  } else if (postitType === 'meaning') {
    dragState.value.initialRight = parent.right - rect.right
  }
  dragState.value.initialBottom = parent.bottom - rect.bottom

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

// 드래그 중
const onDrag = (event) => {
  if (!dragState.value.isDragging) return

  const deltaX = event.clientX - dragState.value.startX
  const deltaY = event.clientY - dragState.value.startY

  const newBottom = dragState.value.initialBottom - deltaY

  // name은 left 기준, meaning은 right 기준
  if (dragState.value.currentPostit === 'name') {
    const newLeft = dragState.value.initialLeft + deltaX
    postitPositions.value[dragState.value.currentPostit] = {
      left: `${newLeft}px`,
      bottom: `${newBottom}px`,
      right: 'auto',
      top: 'auto'
    }
  } else if (dragState.value.currentPostit === 'meaning') {
    const newRight = dragState.value.initialRight - deltaX
    postitPositions.value[dragState.value.currentPostit] = {
      right: `${newRight}px`,
      bottom: `${newBottom}px`,
      left: 'auto',
      top: 'auto'
    }
  }
}

// 드래그 종료
const stopDrag = () => {
  dragState.value.isDragging = false
  dragState.value.currentPostit = null
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 모달 배경 클릭 시 닫기
const handleModalBackgroundClick = (type, event) => {
  if (event.target.classList.contains('modal')) {
    if (type === 'diary') {
      closeDiaryModal()
    } else if (type === 'write') {
      closeWriteModal()
    } else if (type === 'date') {
      closeDatePicker()
    } else if (type === 'encyclopedia') {
      closeEncyclopedia()
    }
  }
}

// 커스텀 알럿
const showCustomAlert = (message, type = 'success') => {
  alertMessage.value = message
  alertType.value = type
  showAlert.value = true
}

const closeAlert = () => {
  showAlert.value = false
}

// 꽃 정보를 이미지로 저장 (미리보기) - 리포트 템플릿 캡처
const saveFlowerAsImage = async () => {
  if (!reportCaptureRef.value) {
    showCustomAlert('리포트를 생성할 수 없습니다.', 'error')
    return
  }

  try {
    // iOS 감지
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

    console.log('리포트 생성 시작 (iOS:', isIOS, ')')
    console.log('reportCaptureRef:', reportCaptureRef.value)

    // 로딩 모달 표시
    loadingMessage.value = '리포트를 생성하는 중...'
    showLoading.value = true

    // DOM이 완전히 렌더링될 때까지 대기
    await nextTick()

    // iOS에서는 이미지 로딩을 추가로 대기
    if (isIOS) {
      console.log('#0 iOS 이미지 로딩 대기 시작 (2초)')
      await new Promise(resolve => setTimeout(resolve, 2000)) // iOS는 더 길게 대기 (2초)

      // 모든 이미지가 로드될 때까지 대기
      const images = reportCaptureRef.value.querySelectorAll('img')
      console.log('#0-1 이미지 로드 확인:', images.length, '개')

      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve()
          return new Promise((resolve) => {
            img.onload = resolve
            img.onerror = resolve // 에러가 나도 계속 진행
            // 5초 타임아웃
            setTimeout(resolve, 5000)
          })
        })
      )

      console.log('#0-2 모든 이미지 로드 완료 또는 타임아웃')
    }

    // iOS Safari 호환 설정
    const element = reportCaptureRef.value
    const canvasOptions = {
      backgroundColor: '#FFF9E8',
      scale: isIOS ? 1 : REPORT_CAPTURE.SCALE, // iOS는 scale을 더 낮춤 (메모리 절약)
      useCORS: true,
      allowTaint: false, // Safari에서 CORS 문제 회피 (중요!)
      logging: true, // 디버깅을 위해 항상 로그 활성화
      width: REPORT_CAPTURE.WIDTH,
      windowWidth: REPORT_CAPTURE.WIDTH,
      scrollY: 0, // 명시적으로 0 설정
      scrollX: 0, // 명시적으로 0 설정
      imageTimeout: 30000, // 타임아웃 증가
      foreignObjectRendering: false, // Safari 호환성
      removeContainer: true, // 렌더링 후 임시 컨테이너 제거
      // Safari 전용 콜백
      onclone: (clonedDoc) => {
        console.log('#2 onclone 콜백 실행')
        const clonedElement = clonedDoc.querySelector('.report-capture-container')
        if (clonedElement) {
          // Safari에서 스타일 강제 적용
          clonedElement.style.display = 'block'
          clonedElement.style.position = 'relative'
          clonedElement.style.left = '0'
          clonedElement.style.top = '0'
          clonedElement.style.transform = 'none'

          // 모든 이미지에 대해 로드 완료 보장
          const images = clonedElement.querySelectorAll('img')
          console.log('#3 이미지 개수:', images.length)
          images.forEach((img, index) => {
            if (img.complete) {
              console.log(`#4-${index} 이미지 로드 완료:`, img.src.substring(0, 50))
            } else {
              console.warn(`#4-${index} 이미지 미완료:`, img.src.substring(0, 50))
              // 이미지가 로드되지 않았으면 강제로 빈 이미지 대체
              img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E'
            }
          })
        }
      }
    }

    console.log('html2canvas 옵션:', canvasOptions)

    const canvas = await html2canvas(element, canvasOptions)

    console.log('캔버스 생성 완료:', canvas.width, 'x', canvas.height)

    // 캔버스를 Data URL로 변환하여 미리보기에 표시
    const quality = isIOS ? 0.8 : 0.95 // iOS는 품질을 더 낮춤
    previewImageUrl.value = canvas.toDataURL('image/png', quality)

    console.log('이미지 데이터 생성 완료')

    // 로딩 모달 숨김
    showLoading.value = false

    // 미리보기 모달 표시
    showImagePreview.value = true

    console.log('이미지 생성 성공 (iOS:', isIOS, ')')
  } catch (error) {
    console.error('이미지 저장 에러:', error)
    console.error('에러 타입:', error.name)
    console.error('에러 메시지:', error.message)
    console.error('에러 스택:', error.stack)

    // 로딩 모달 숨김
    showLoading.value = false

    // iOS에서 더 명확한 에러 메시지
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    if (isIOS) {
      showCustomAlert(`iOS에서 이미지 생성 실패했습니다.\n에러: ${error.message}\n\n페이지를 새로고침 후 다시 시도해주세요.`, 'error')
    } else {
      showCustomAlert(`이미지 저장에 실패했습니다.\n에러: ${error.message}`, 'error')
    }
  }
}

// 미리보기 모달 닫기
const closeImagePreview = () => {
  showImagePreview.value = false
  previewImageUrl.value = ''
}

// 이미지 다운로드 (모든 브라우저 지원)
const downloadImage = () => {
  // 파일명 생성 (감정_리포트_날짜.png)
  let emotionName = currentEmotionName.value || '알수없음'
  const date = currentDiary.value?.date?.replace(/\./g, '') || 'unknown'
  const fileName = `${date}_리포트_${emotionName}.png`

  // iOS 감지
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

  if (isIOS) {
    // iOS: 새 탭에서 이미지 열기 (사용자가 길게 눌러서 저장)
    const newWindow = window.open()
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>${fileName}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                margin: 0;
                padding: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                background: #f5f5f5;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              }
              .instructions {
                text-align: center;
                margin-bottom: 20px;
                padding: 15px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .instructions h2 {
                margin: 0 0 10px 0;
                color: #333;
                font-size: 18px;
              }
              .instructions p {
                margin: 5px 0;
                color: #666;
                font-size: 14px;
                line-height: 1.5;
              }
              img {
                max-width: 100%;
                height: auto;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
              }
            </style>
          </head>
          <body>
            <div class="instructions">
              <h2>📥 이미지 저장 방법</h2>
              <p>아래 이미지를 <strong>길게 눌러</strong> "이미지 저장"을 선택하세요</p>
            </div>
            <img src="${previewImageUrl.value}" alt="${fileName}">
          </body>
        </html>
      `)
      newWindow.document.close()
    }
    showCustomAlert('새 창에서 이미지를 길게 눌러 저장하세요', 'success')
  } else {
    // 데스크톱/안드로이드: 일반 다운로드
    const link = document.createElement('a')
    link.download = fileName
    link.href = previewImageUrl.value
    link.click()
    // showCustomAlert('리포트가 저장되었습니다!', 'success')
  }
}

// 일기 재분석 요청 (테스트)
const reanalyzeDiaryTest = async () => {
  if (!currentDiary.value?.id) return

  loadingMessage.value = '일기를 재분석하는 중...'
  showLoading.value = true
  closeDiaryModal()

  try {
    const analyzedDiary = await diaryApi.analyzeDiaryTest(currentDiary.value.id)

    // 화면 업데이트
    if (currentDay.value) {
      diaryData.value[currentDay.value] = {
        id: analyzedDiary.id,
        date: diaryData.value[currentDay.value].date,
        emotion: analyzedDiary.coreEmotion,
        content: analyzedDiary.content,
        summary: analyzedDiary.summary,
        flower: analyzedDiary.flower,
        floriography: analyzedDiary.floriography,
        emotions: analyzedDiary.emotions || [],
        reason: analyzedDiary.reason || '',
        flowerDetail: analyzedDiary.flowerDetail || null
      }
    }

    // 감정 조절 팁 체크 및 표시
    if (analyzedDiary.showEmotionControlTip && analyzedDiary.emotionControlTipCode) {
      try {
        // emotionControlTipCode로 활동 조회
        const { getEmotionControlActivities } = await import('@/services/codeApi.js')
        const allActivities = await getEmotionControlActivities()
        const tipData = allActivities.find(activity => activity.code === analyzedDiary.emotionControlTipCode)

        if (!tipData) {
          console.warn('감정 조절 팁을 찾을 수 없음:', analyzedDiary.emotionControlTipCode)
          throw new Error('해당 활동을 찾을 수 없습니다.')
        }

        continuousEmotionData.value = {
          emotionName: AREA_SHORT_NAMES[analyzedDiary.repeatedEmotionArea?.toLowerCase()] || '특정',
          emotionIcon: AREA_EMOJIS[analyzedDiary.repeatedEmotionArea?.toLowerCase()] || '🌸',
          consecutiveDays: analyzedDiary.consecutiveSameAreaDays || 0,
          activityName: tipData.codeName,
          activityIcon: AREA_EMOJIS[analyzedDiary.repeatedEmotionArea?.toLowerCase()] || '🌸',
          emotionArea: analyzedDiary.repeatedEmotionArea?.toLowerCase() || 'red'
        }

        showContinuousToast.value = true
      } catch (error) {
        console.error('감정 조절 팁 로드 실패:', error)
        // 에러 발생 시 토스트 표시 안 함 (조용히 실패)
      }
    }

    showLoading.value = false
    showCustomAlert('일기가 재분석되었습니다!', 'success')
  } catch (error) {
    console.error('재분석 에러:', error)
    showLoading.value = false
    showCustomAlert(`재분석에 실패했습니다.\n${error.message}`, 'error')
  }
}

// 일기 재분석 요청 (AI)
const reanalyzeDiary = async () => {
  if (!currentDiary.value?.id) return

  loadingMessage.value = 'AI가 일기를 재분석하는 중...'
  showLoading.value = true
  closeDiaryModal()

  try {
    const analyzedDiary = await diaryApi.analyzeDiary(currentDiary.value.id)

    // 화면 업데이트
    if (currentDay.value) {
      diaryData.value[currentDay.value] = {
        id: analyzedDiary.id,
        date: diaryData.value[currentDay.value].date,
        emotion: analyzedDiary.coreEmotion,
        content: analyzedDiary.content,
        summary: analyzedDiary.summary,
        flower: analyzedDiary.flower,
        floriography: analyzedDiary.floriography,
        emotions: analyzedDiary.emotions || [],
        reason: analyzedDiary.reason || '',
        flowerDetail: analyzedDiary.flowerDetail || null
      }
    }

    // 감정 조절 팁 체크 및 표시
    if (analyzedDiary.showEmotionControlTip && analyzedDiary.emotionControlTipCode) {
      try {
        // emotionControlTipCode로 활동 조회
        const { getEmotionControlActivities } = await import('@/services/codeApi.js')
        const allActivities = await getEmotionControlActivities()
        const tipData = allActivities.find(activity => activity.code === analyzedDiary.emotionControlTipCode)

        if (!tipData) {
          console.warn('감정 조절 팁을 찾을 수 없음:', analyzedDiary.emotionControlTipCode)
          throw new Error('해당 활동을 찾을 수 없습니다.')
        }

        continuousEmotionData.value = {
          emotionName: AREA_SHORT_NAMES[analyzedDiary.repeatedEmotionArea?.toLowerCase()] || '특정',
          emotionIcon: AREA_EMOJIS[analyzedDiary.repeatedEmotionArea?.toLowerCase()] || '🌸',
          consecutiveDays: analyzedDiary.consecutiveSameAreaDays || 0,
          activityName: tipData.codeName,
          activityIcon: AREA_EMOJIS[analyzedDiary.repeatedEmotionArea?.toLowerCase()] || '🌸',
          emotionArea: analyzedDiary.repeatedEmotionArea?.toLowerCase() || 'red'
        }

        showContinuousToast.value = true
      } catch (error) {
        console.error('감정 조절 팁 로드 실패:', error)
        // 에러 발생 시 토스트 표시 안 함 (조용히 실패)
      }
    }

    showLoading.value = false
    showCustomAlert('일기가 재분석되었습니다!', 'success')
  } catch (error) {
    console.error('재분석 에러:', error)
    showLoading.value = false
    showCustomAlert(`재분석에 실패했습니다.\n${error.message}`, 'error')
  }
}

// 일기 삭제
const deleteDiaryEntry = async () => {
  if (!currentDiary.value?.id) return

  // 확인 요청
  if (!confirm('정말로 이 일기를 삭제하시겠습니까?')) {
    return
  }

  try {
    await diaryApi.deleteDiary(currentDiary.value.id)

    // 화면에서 제거
    if (currentDay.value) {
      delete diaryData.value[currentDay.value]
    }

    closeDiaryModal()
    showCustomAlert('일기가 삭제되었습니다.', 'delete')
  } catch (error) {
    console.error('삭제 에러:', error)
    showCustomAlert(`일기 삭제에 실패했습니다.\n${error.message}`, 'error')
  }
}

// 전체 감정 데이터 로드
const loadAllEmotions = async () => {
  try {
    const response = await diaryApi.getAllEmotions()
    allEmotionsData.value = response.emotions || []
  } catch (error) {
    console.error('전체 감정 로드 에러:', error)
    allEmotionsData.value = []
    throw error // 상위에서 에러 처리를 위해 다시 throw
  }
}

// 내 감정 데이터 로드
const loadMyEmotions = async () => {
  try {
    const response = await diaryApi.getMyEmotions()
    myEmotionsData.value = response.items || []
    console.log('[내 감정 데이터]', myEmotionsData.value)
    console.log('[획득한 감정 코드]', Array.from(acquiredEmotions.value))
  } catch (error) {
    console.error('내 감정 로드 에러:', error)
    myEmotionsData.value = []
    throw error // 상위에서 에러 처리를 위해 다시 throw
  }
}

// 도감 열기/닫기
const openEncyclopedia = async () => {
  selectedEncyclopediaEmotion.value = null
  loadingMessage.value = '감정 도감을 불러오는 중...'
  showLoading.value = true

  try {
    // 도감 데이터 로드
    await Promise.all([
      loadAllEmotions(),
      loadMyEmotions()
    ])
    showLoading.value = false
    showEncyclopedia.value = true // 데이터 로드 성공 후에만 모달 열기
  } catch (error) {
    console.error('도감 데이터 로드 에러:', error)
    showLoading.value = false
    showCustomAlert('감정 도감 데이터를 불러올 수 없습니다.', 'error')
    // 에러 시 모달을 열지 않음
  }
}

const closeEncyclopedia = () => {
  showEncyclopedia.value = false
  selectedEncyclopediaEmotion.value = null
}

// 무드미터 가이드 열기
const openMoodMeterGuide = () => {
  showMoodMeterGuide.value = true
}

// 감정 가꾸기 가이드 열기
const openEmotionControl = async () => {
  loadingMessage.value = '감정 가꾸기 가이드를 불러오는 중...'
  showLoading.value = true

  try {
    // 활동 목록 로드
    const { getEmotionControlActivities } = await import('@/services/codeApi.js')
    emotionControlActivities.value = await getEmotionControlActivities()

    showLoading.value = false
    showEmotionControl.value = true // 데이터 로드 성공 후에만 모달 열기
  } catch (error) {
    console.error('감정 가꾸기 데이터 로드 에러:', error)
    showLoading.value = false
    showCustomAlert('감정 가꾸기 가이드를 불러올 수 없습니다.', 'error')
    // 에러 시 모달을 열지 않음
  }
}

// 도감에서 감정 선택
const selectEncyclopediaEmotion = (emotionCode) => {
  selectedEncyclopediaEmotion.value = emotionCode

  // 상세 정보로 자동 스크롤
  nextTick(() => {
    const detailElement = document.querySelector('.encyclopedia-detail')
    if (detailElement) {
      detailElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

// 감정 획득 여부 확인
const isEmotionAcquired = (emotionCode) => {
  return acquiredEmotions.value.has(emotionCode)
}

// 사이드바 열기/닫기
const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}

// 메뉴 선택 처리
const handleMenuSelect = (menuId) => {
  switch (menuId) {
    case 'garden':
      // 이미 화단 화면이므로 아무것도 하지 않음
      break
    case 'encyclopedia':
      openEncyclopedia()
      break
    case 'write':
      openWriteDiaryWithDatePicker()
      break
    case 'mood-meter':
      showMoodMeterGuide.value = true
      break
    case 'letter':
      openLetter()
      break
    case 'emotion-care':
      openEmotionControl()
      break
    case 'logout':
      handleLogout()
      break
    default:
      break
  }
}

// 로그아웃 처리
const handleLogout = async () => {
  try {
    await logout()
    // 인증 상태 업데이트 (Landing 페이지로 이동)
    if (window.setAuth) {
      window.setAuth(false)
    }
  } catch (error) {
    console.error('로그아웃 중 오류:', error)
    // 에러가 발생해도 로컬 스토리지는 이미 정리되었으므로 Landing으로 이동
    if (window.setAuth) {
      window.setAuth(false)
    }
  }
}

// 우체통 클릭 - 감정 레터 열기
const openLetter = () => {
  showLetterList.value = true
}

// 레터에서 일기 열기
const handleOpenDiaryFromLetter = async (diaryId) => {
  try {
    showLoading.value = true
    loadingMessage.value = '일기를 불러오는 중...'

    // 일기 상세 조회 API 호출
    const diary = await diaryApi.getDiaryDetail(diaryId)

    // API 응답 데이터를 화면 형식으로 변환하여 directDiary에 저장
    const diaryDate = new Date(diary.diaryDate)
    const day = diaryDate.getDate()
    const month = diaryDate.getMonth() + 1

    directDiary.value = {
      id: diary.id,
      date: `${month}월 ${day}일`,
      emotion: diary.coreEmotion,
      content: diary.content,
      summary: diary.summary,
      flower: diary.flower,
      floriography: diary.floriography,
      emotions: diary.emotions || [],
      reason: diary.reason || '',
      flowerDetail: diary.flowerDetail || null
    }

    currentDay.value = day // 일(DD) 설정 (currentDiary computed에서 사용)

    // 일기 모달 열기
    showDiaryModal.value = true
  } catch (error) {
    console.error('일기 조회 실패:', error)

    // 404 에러 (일기 삭제됨)
    if (error.response?.status === 404) {
      showCustomAlert('삭제된 일기입니다.\n해당 일기는 이미 삭제되었습니다.', 'error')
    } else {
      showCustomAlert('일기를 불러오는 중 문제가 발생했습니다.', 'error')
    }
  } finally {
    showLoading.value = false
    loadingMessage.value = ''
  }
}

const handleSelectLetter = async (letter) => {
  try {
    // 주간 리포트 상세 조회 API 호출
    const reportDetail = await weeklyReportApi.getWeeklyReportDetail(letter.id)

    // API 응답을 UI 형식으로 변환
    selectedLetter.value = weeklyReportApi.transformWeeklyReportData(reportDetail)

    showLetterList.value = false
    showLetterDetail.value = true

    // 읽음 처리 후 hasNew 상태 즉시 업데이트
    weeklyReportApi.markReportAsRead(letter.id)
      .then(async () => {
        // 안 읽은 리포트 존재 여부 다시 확인 (사이드바 배지 즉시 업데이트)
        const unreadResult = await weeklyReportApi.checkUnreadReports()
        hasNewLetter.value = unreadResult.hasUnread || false
      })
      .catch(error => {
        console.error('읽음 처리 실패:', error)
      })
  } catch (error) {
    console.error('레터 상세 조회 실패:', error)
    showAlert.value = true
    alertType.value = 'error'
    alertMessage.value = '레터를 불러오는 중 문제가 발생했습니다.'
  }
}

// 레터 상세에서 목록으로 돌아가기
const handleBackToLetterList = () => {
  showLetterDetail.value = false
  showLetterList.value = true
  directDiary.value = null // 레터에서 조회한 일기 데이터 초기화
}

// ESC 키로 모달 닫기
const handleEscKey = (e) => {
  if (e.key === 'Escape') {
    closeDiaryModal()
    closeWriteModal()
    closeDatePicker()
    closeAlert()
    closeEncyclopedia()
    showSidebar.value = false
    showMoodMeterGuide.value = false
  }
}

// 주간 리포트 상태 체크
const checkWeeklyReports = async () => {
  try {
    // 1. 안 읽은 리포트 존재 여부 확인 (사이드바 N 뱃지용 - 매번 체크)
    const unreadResult = await weeklyReportApi.checkUnreadReports()
    hasNewLetter.value = unreadResult.hasUnread || false

    // 2. 새 리포트 존재 여부 확인 (알림 모달 1회 노출용 - 하루 1회만 체크)
    const today = dateUtils.formatDateToISO(new Date())
    const lastCheck = localStorage.getItem(STORAGE_KEYS.LAST_LETTER_CHECK)

    if (lastCheck !== today) {
      // 오늘 아직 체크 안 했으면 API 호출
      const newResult = await weeklyReportApi.checkNewReports()

      // localStorage 업데이트 (오늘 체크했다고 기록)
      localStorage.setItem(STORAGE_KEYS.LAST_LETTER_CHECK, today)

      if (newResult.hasNew) {
        // 약간의 딜레이를 주고 모달 표시 (자연스러운 효과)
        setTimeout(() => {
          showLetterNotification.value = true
        }, ANIMATION_DELAY.NOTIFICATION)
      }
    }
  } catch (error) {
    console.error('주간 리포트 상태 확인 실패:', error)
    // 에러가 발생해도 화단은 정상 동작하도록 함
  }
}

onMounted(async () => {
  document.addEventListener('keydown', handleEscKey)

  // 페이지 로드 시 현재 월의 일기 목록 로드
  await loadMonthlyDiaries()

  // 감정 화단 데이터 로딩 완료 후, 주간 리포트 상태 확인
  await checkWeeklyReports()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
})
</script> 
