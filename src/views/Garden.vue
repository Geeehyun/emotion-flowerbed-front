<template>
  <div class="relative min-h-screen flex flex-col overflow-hidden">
    <!-- 움직이는 물방울 배경 -->
    <div class="polka-dot-bg">
      <div class="dots-layer dots-layer-1"></div>
      <div class="dots-layer dots-layer-2"></div>
      <div class="dots-layer dots-layer-3"></div>
      <div class="dots-layer dots-layer-4"></div>
    </div>

    <div class="main-container">
      <!-- 상단 타이틀 -->
      <div class="header-section">
        <!-- 햄버거 메뉴 버튼 (좌측) -->
        <button
          class="hamburger-btn"
          @click="toggleSidebar"
          title="메뉴"
        >
          <Bars3Icon class="w-8 h-8" />
        </button>
        <h1 class="page-title">나의 감정 화단</h1>
      </div>

      <!-- 화단 영역 -->
      <div class="garden-section">
        <div class="garden-wrapper">
          <!-- 화단 배경 이미지 -->
          <img src="../assets/images/garden-bg-rectangle.png" alt="화단" class="garden-bg-image">

          <!-- 격자 그리드로 꽃 배치 -->
          <div class="flower-grid">
            <!-- 일기가 있는 날들 -->
            <template v-for="day in daysInCurrentMonth" :key="day">
              <div class="grid-cell" v-if="diaryData[day]" :data-day="day">
                <div class="flower relative" @click="openDiary(day)">
                  <img
                    :src="getFlowerImageUrl(day)"
                    :alt="getFlowerName(day)"
                    class="flower-image"
                  >
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

            <!-- 빈 셀들 (달력 채우기용, 35칸 맞추기) -->
            <div class="grid-cell" v-for="i in emptySlotCount" :key="`fill-${i}`">
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
          <img src="../assets/images/trowel.png" alt="일기 작성" class="trowel-icon" />
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
      :get-emotion-color="getEmotionColor"
      :all-emotions-data="allEmotionsData"
      @close="closeDiaryModal"
      @toggle-flip="toggleFlip"
      @save-image="saveFlowerAsImage"
      @reanalyze="reanalyzeDiary"
      @reanalyze-test="reanalyzeDiaryTest"
      @delete="deleteDiaryEntry"
      @highlight-emotion="highlightEmotion"
      @unhighlight-emotion="unhighlightEmotion"
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
    <LoadingModal v-model="showLoading" />

    <!-- 커스텀 알럿 모달 -->
    <AlertModal
      v-model="showAlert"
      :message="alertMessage"
      :icon="alertIcon"
      @close="closeAlert"
    />

    <!-- 감정 도감 모달 -->
    <EncyclopediaModal
      v-model="showEncyclopedia"
      :acquired-emotions="acquiredEmotions"
      :all-emotions="allEmotionsData"
      :selected-emotion="selectedEncyclopediaEmotion"
      :get3d-image="get3dImageFromDetail"
      :get-realistic-image="getRealisticImageFromDetail"
      @close="closeEncyclopedia"
      @select-emotion="selectEncyclopediaEmotion"
    />


    <!-- 이미지 미리보기 모달 -->
    <ImagePreviewModal
      v-model="showImagePreview"
      :image-url="previewImageUrl"
      v-model:include-details="includeDetailsInCapture"
      @close="closeImagePreview"
      @download="downloadImage"
      @update:include-details="recaptureImage"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { get3dImageFromDetail, getRealisticImageFromDetail, getEmotionData, UNKNOWN_EMOTION } from '../utils/flowerMapper.js'
import * as diaryApi from '../services/diaryApi.js'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
import { ArrowPathIcon, XMarkIcon, PlusCircleIcon, ArrowDownTrayIcon, BookOpenIcon, Bars3Icon } from '@heroicons/vue/24/outline'
import html2canvas from 'html2canvas'

// 컴포넌트 import
import SidebarMenu from '@/components/SidebarMenu.vue'

// 모달 컴포넌트 import
import LoadingModal from '@/components/modals/LoadingModal.vue'
import AlertModal from '@/components/modals/AlertModal.vue'
import ImagePreviewModal from '@/components/modals/ImagePreviewModal.vue'
import DiaryWriteModal from '@/components/modals/DiaryWriteModal.vue'
import DatePickerModal from '@/components/modals/DatePickerModal.vue'
import DiaryReadModal from '@/components/modals/DiaryReadModal.vue'
import EncyclopediaModal from '@/components/modals/EncyclopediaModal.vue'
import LetterNotificationModal from '@/components/modals/LetterNotificationModal.vue'

// Chart.js 요소 등록
Chart.register(ArcElement, Tooltip, Legend)

// 상태 관리
const currentDay = ref(null)
const showDiaryModal = ref(false)
const showWriteModal = ref(false)
const diaryContent = ref('')
const showLoading = ref(false)
const showAlert = ref(false)
const alertMessage = ref('')
const alertIcon = ref('🌸')
// const selectedEmotion = ref('기쁨') // AI 감정 분석으로 대체됨
const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(12)
const showDatePicker = ref(false)
const selectedYear = ref(new Date().getFullYear())
const selectedMonth = ref(12)
const selectedDay = ref(new Date().getDate())
const isFlipped = ref(false) // 일기 모달 뒤집기 상태
const isWriteDiaryMode = ref(false) // 일기 작성 버튼으로 날짜 선택 모드
const showEncyclopedia = ref(false) // 도감 모달 표시 상태
const selectedEncyclopediaEmotion = ref(null) // 도감에서 선택한 감정
const allEmotionsData = ref([]) // 전체 감정 데이터 (API에서 로드)
const myEmotionsData = ref([]) // 내가 획득한 감정 데이터
const showImagePreview = ref(false) // 이미지 미리보기 모달
const previewImageUrl = ref('') // 미리보기 이미지 URL
const includeDetailsInCapture = ref(false) // 포스트잇과 상세설명 포함 여부
const showSidebar = ref(false) // 사이드바 메뉴 표시 상태

// TODO: API 연동 - 새로운 감정 레터 확인 API 호출 필요
// GET /letters/has-new 같은 엔드포인트로 새 레터 여부 확인
const hasNewLetter = ref(true) // 임시로 true 설정, 나중에 API로 확인
const showLetterNotification = ref(false) // 레터 알림 모달 표시 상태

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

// 분석 안된 일기인지 확인
const isUnanalyzed = computed(() => {
  return currentDiary.value && !currentDiary.value.emotion
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

// Chart.js 관련
const emotionChart = ref(null)
let chartInstance = null

// 감정별 색상 맵 (감정에 어울리는 색상)
const EMOTION_COLOR_MAP = {
  'JOY': '#FFD700',           // 금색
  'HAPPINESS': '#FFB6C1',     // 연분홍
  'GRATITUDE': '#FF69B4',     // 핫핑크
  'EXCITEMENT': '#FFA07A',    // 라이트 새먼
  'PEACE': '#98FB98',         // 연두색
  'ACHIEVEMENT': '#FFD700',   // 노란색
  'LOVE': '#FF0000',          // 빨간색
  'HOPE': '#87CEEB',          // 스카이블루
  'VITALITY': '#FF6347',      // 토마토
  'FUN': '#FF69B4',           // 핑크
  'SADNESS': '#4169E1',       // 로얄블루
  'LONELINESS': '#6495ED',    // 콘플라워블루
  'ANXIETY': '#9370DB',       // 미디엄퍼플
  'ANGER': '#FFD700',         // 노란색
  'FATIGUE': '#98D8C8',       // 민트
  'REGRET': '#9370DB',        // 보라색
  'LETHARGY': '#F8F8FF',      // 고스트화이트
  'CONFUSION': '#FFC0CB',     // 연핑크
  'DISAPPOINTMENT': '#FFD700', // 노란색
  'BOREDOM': '#F0E68C'        // 카키
}

// 감정 색상 가져오기
const getEmotionColor = (emotionCode) => {
  return EMOTION_COLOR_MAP[emotionCode] || '#CCCCCC'
}

// 이미지 경로 생성 함수들은 flowerMapper.js에서 import하여 사용

// 도넛 차트 생성
const createEmotionChart = () => {
  if (!emotionChart.value || !currentDiary.value?.emotions) return

  // 이전 차트 인스턴스 제거
  if (chartInstance) {
    chartInstance.destroy()
  }

  // const ctx = emotionChart.value.getContext('2d')
  const ctx = document.getElementById('myChart');
  const emotions = currentDiary.value.emotions

  chartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: emotions.map(e => {
        const emotionData = getEmotionData(allEmotionsData.value, e.emotion)
        return emotionData?.emotionNameKr || e.emotion
      }),
      datasets: [{
        data: emotions.map(e => e.percent),
        backgroundColor: emotions.map(e => getEmotionColor(e.emotion)),
        borderColor: '#FFFFFF',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false // 커스텀 레전드 사용
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.parsed}%`
            }
          },
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#FFFFFF',
          bodyColor: '#FFFFFF',
          padding: 12,
          cornerRadius: 8,
          displayColors: true
        }
      }
    }
  })
}

// 감정 하이라이트
const highlightEmotion = (emotionCode) => {
  if (!chartInstance) return
  // 차트 세그먼트에 호버 효과 추가 가능
}

const unhighlightEmotion = () => {
  if (!chartInstance) return
  // 차트 호버 효과 제거
}

// Computed
const currentDiary = computed(() => {
  return currentDay.value ? diaryData.value[currentDay.value] : null
})

const writeModalDate = computed(() => {
  return currentDay.value ? `${currentMonth.value}월 ${currentDay.value}일` : '오늘의 일기'
})

const yearOptions = computed(() => {
  const currentYearValue = new Date().getFullYear()
  const years = []
  for (let i = currentYearValue - 5; i <= currentYearValue + 5; i++) {
    years.push(i)
  }
  return years
})

// 선택된 월의 일 수 계산
const daysInSelectedMonth = computed(() => {
  const days = new Date(selectedYear.value, selectedMonth.value, 0).getDate()
  return Array.from({ length: days }, (_, i) => i + 1)
})

// 현재 월의 일 수 계산
const daysInCurrentMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 0).getDate()
})

// 빈 칸 개수 계산 (35칸 중 남은 칸)
const emptySlotCount = computed(() => {
  return 35 - daysInCurrentMonth.value
})

// 월별 일기 목록 로드
const loadMonthlyDiaries = async () => {
  try {
    const yearMonth = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}`
    const response = await diaryApi.getDiaries(yearMonth)

    console.log('월별 일기 목록:', response)

    // 일기 데이터 초기화 후 새로 채우기
    diaryData.value = {}

    response.diaries.forEach(diary => {
      const day = new Date(diary.date).getDate()
      diaryData.value[day] = {
        id: diary.id,
        date: `${currentMonth.value}월 ${day}일`,
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
  } catch (error) {
    console.error('월별 일기 로드 에러:', error)
    // 에러 시 빈 데이터로 초기화
    diaryData.value = {}
  }
}

// 월 변경
const changeMonth = (delta) => {
  currentMonth.value += delta
  if (currentMonth.value < 1) {
    currentMonth.value = 12
    currentYear.value -= 1
  }
  if (currentMonth.value > 12) {
    currentMonth.value = 1
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
  // 연도 범위 제한 (현재 연도 기준 ±10년)
  const currentYearValue = new Date().getFullYear()
  if (selectedYear.value < currentYearValue - 10) {
    selectedYear.value = currentYearValue - 10
  }
  if (selectedYear.value > currentYearValue + 10) {
    selectedYear.value = currentYearValue + 10
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
const saveDiary = async (isTest = true) => {
  if (!currentDay.value) return
  if (!diaryContent.value.trim()) {
    showCustomAlert('일기 내용을 입력해주세요!', '📝')
    return
  }

  console.log(`${currentDay.value}일 일기 저장:`, diaryContent.value)
  console.log(`분석 모드: ${isTest ? '테스트(랜덤)' : 'Claude AI'}`)

  // 로딩 화면 표시
  showWriteModal.value = false
  showLoading.value = true

  try {
    // 1. 일기 작성 API 호출
    const diaryDate = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${String(currentDay.value).padStart(2, '0')}`

    const createdDiary = await diaryApi.createDiary({
      diaryDate: diaryDate,
      content: diaryContent.value
    })

    console.log('일기 생성 성공:', createdDiary)

    // 2. 감정 분석 API 호출 (테스트 or Claude AI)
    const analyzedDiary = isTest
      ? await diaryApi.analyzeDiaryTest(createdDiary.diaryId)
      : await diaryApi.analyzeDiary(createdDiary.diaryId)

    console.log('감정 분석 결과:', analyzedDiary)

    // 3. 화면에 표시
    diaryData.value[currentDay.value] = {
      id: analyzedDiary.id,
      date: `${currentMonth.value}월 ${currentDay.value}일`,
      emotion: analyzedDiary.coreEmotion, // 영어 코드 (JOY, PEACE 등)
      content: analyzedDiary.content,
      summary: analyzedDiary.summary,
      flower: analyzedDiary.flower,
      floriography: analyzedDiary.floriography,
      emotions: analyzedDiary.emotions || [],
      reason: analyzedDiary.reason || '',
      flowerDetail: analyzedDiary.flowerDetail || null
    }

    showLoading.value = false
    showCustomAlert('일기가 저장되었습니다!', '🌸')
    currentDay.value = null
    diaryContent.value = ''
  } catch (error) {
    console.error('일기 저장 에러:', error)
    showLoading.value = false
    showCustomAlert(`일기 저장에 실패했습니다.\n${error.message}`, '😢')
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
const showCustomAlert = (message, icon = '🌸') => {
  alertMessage.value = message
  alertIcon.value = icon
  showAlert.value = true
}

const closeAlert = () => {
  showAlert.value = false
}

// 꽃 정보를 이미지로 저장 (미리보기)
const saveFlowerAsImage = async (includeDetails = false) => {
  // includeDetails가 false면 꽃 이미지만, true면 포스트잇과 상세설명까지 포함
  const targetElement = includeDetails
    ? document.querySelector('.flower-catalog')
    : document.querySelector('.flower-catalog-image')

  if (!targetElement) return

  try {
    const canvas = await html2canvas(targetElement, {
      backgroundColor: null, // 투명 배경
      scale: 2, // 고해상도
      useCORS: true,
      logging: false
    })

    // 캔버스를 Data URL로 변환하여 미리보기에 표시
    previewImageUrl.value = canvas.toDataURL('image/png')
    showImagePreview.value = true
  } catch (error) {
    console.error('이미지 저장 에러:', error)
    showCustomAlert('이미지 저장에 실패했습니다.', '😢')
  }
}

// 미리보기 모달 닫기
const closeImagePreview = () => {
  showImagePreview.value = false
  previewImageUrl.value = ''
  includeDetailsInCapture.value = false // 초기화
}

// 옵션 변경 후 재캡쳐
const recaptureImage = async () => {
  showImagePreview.value = false // 일단 모달 닫기
  await saveFlowerAsImage(includeDetailsInCapture.value)
}

// 이미지 다운로드 (데스크톱/안드로이드용)
const downloadImage = () => {
  const link = document.createElement('a')

  // 파일명 생성
  let flowerName = '알 수 없음'
  if (currentFlowerDetail.value) {
    flowerName = currentFlowerDetail.value.flowerNameKr
  } else if (currentDiary.value.emotion) {
    const emotionData = getEmotionData(allEmotionsData.value, currentDiary.value.emotion)
    flowerName = emotionData?.flowerNameKr || '알 수 없음'
  }

  const fileName = `${flowerName}_${currentDiary.value.date}.png`
  link.download = fileName
  link.href = previewImageUrl.value
  link.click()
  showCustomAlert('이미지가 저장되었습니다!', '📸')
}

// 일기 재분석 요청 (테스트)
const reanalyzeDiaryTest = async () => {
  if (!currentDiary.value?.id) return

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

    showLoading.value = false
    showCustomAlert('일기가 재분석되었습니다!', '🌸')
  } catch (error) {
    console.error('재분석 에러:', error)
    showLoading.value = false
    showCustomAlert(`재분석에 실패했습니다.\n${error.message}`, '😢')
  }
}

// 일기 재분석 요청 (AI)
const reanalyzeDiary = async () => {
  if (!currentDiary.value?.id) return

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

    showLoading.value = false
    showCustomAlert('일기가 재분석되었습니다!', '🌸')
  } catch (error) {
    console.error('재분석 에러:', error)
    showLoading.value = false
    showCustomAlert(`재분석에 실패했습니다.\n${error.message}`, '😢')
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
    showCustomAlert('일기가 삭제되었습니다.', '🗑️')
  } catch (error) {
    console.error('삭제 에러:', error)
    showCustomAlert(`일기 삭제에 실패했습니다.\n${error.message}`, '😢')
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
  }
}

// 내 감정 데이터 로드
const loadMyEmotions = async () => {
  try {
    const response = await diaryApi.getMyEmotions()
    myEmotionsData.value = response.items || []
    console.log('📊 내가 획득한 감정 데이터:', myEmotionsData.value)
    console.log('📊 획득한 감정 코드:', Array.from(acquiredEmotions.value))
  } catch (error) {
    console.error('내 감정 로드 에러:', error)
    myEmotionsData.value = []
  }
}

// 도감 열기/닫기
const openEncyclopedia = async () => {
  showEncyclopedia.value = true
  selectedEncyclopediaEmotion.value = null

  // 도감 데이터 로드
  await Promise.all([
    loadAllEmotions(),
    loadMyEmotions()
  ])
}

const closeEncyclopedia = () => {
  showEncyclopedia.value = false
  selectedEncyclopediaEmotion.value = null
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
  console.log('메뉴 선택:', menuId)

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
      showCustomAlert('감정 무드미터 기능은 준비 중입니다!', '🎨')
      break
    case 'training':
      showCustomAlert('감정 관리 훈련 기능은 준비 중입니다!', '💪')
      break
    case 'letter':
      openLetter()
      break
    default:
      break
  }
}

// 우체통 클릭 - 감정 레터 열기
const openLetter = () => {
  // TODO: API 연동 - 감정 레터 모달 구현 필요
  // 1. 레터 목록 API 호출: GET /letters
  // 2. 레터 상세 모달 표시
  // 3. 읽음 처리: POST /letters/{letterId}/read
  showCustomAlert('감정 레터 기능은 준비 중입니다!', '✉️')
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
  }
}

// 모달이 열릴 때 차트 생성
watch(showDiaryModal, async (isOpen) => {
  if (isOpen && currentDiary.value?.emotions) {
    await nextTick()
    // createEmotionChart()
  } else if (!isOpen && chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleEscKey)

  // 페이지 로드 시 현재 월의 일기 목록 로드
  loadMonthlyDiaries()

  // 새 레터가 있으면 알림 모달 표시
  console.log('hasNewLetter:', hasNewLetter.value)
  if (hasNewLetter.value) {
    // 약간의 딜레이를 주고 모달 표시 (자연스러운 효과)
    setTimeout(() => {
      console.log('레터 모달 표시:', showLetterNotification.value)
      showLetterNotification.value = true
      console.log('레터 모달 표시 후:', showLetterNotification.value)
    }, 500)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)

  // 차트 인스턴스 정리
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script> 
