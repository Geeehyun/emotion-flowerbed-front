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
            <template v-for="day in 31" :key="day">
              <div class="grid-cell" v-if="diaryData[day]" :data-day="day">
                <div class="flower relative" @click="openDiary(day)">
                  <img
                    :src="getFlowerImage(diaryData[day].emotion)"
                    :alt="getFlowerInfo(diaryData[day].emotion).name"
                    class="flower-image"
                  >
                  <div class="tooltip">
                    <div class="tooltip-card">
                      <div class="tooltip-flower-name">{{ getFlowerInfo(diaryData[day].emotion).name }}</div>
                      <div class="tooltip-meaning">"{{ getFlowerInfo(diaryData[day].emotion).meaning }}"</div>
                      <div class="tooltip-date">{{ diaryData[day].date }}</div>
                      <div class="tooltip-emotion">{{ getEmotionName(diaryData[day].emotion) }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 빈 칸 -->
              <div class="grid-cell" v-else :data-day="day">
                <div class="empty-slot" @click="startPlanting(day)">?</div>
                <img src="../assets/images/trowel.png" alt="모종삽" class="trowel">
              </div>
            </template>

            <!-- 빈 셀들 (달력 채우기용, 35칸 맞추기) -->
            <div class="grid-cell" v-for="i in 4" :key="`fill-${i}`">
              <div class="empty-slot" style="opacity: 0; cursor: default;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 월 선택 바 (하단 고정) -->
      <div class="month-selector-bar">
        <button class="month-nav" @click="changeMonth(-1)">◀</button>
        <div class="month-display" @click="openDatePicker">{{ currentYear }}년 {{ currentMonth }}월</div>
        <button class="month-nav" @click="changeMonth(1)">▶</button>
      </div>
    </div>

    <!-- 일기 읽기 모달 -->
    <div v-if="showDiaryModal" class="modal active" @click="handleModalBackgroundClick('diary', $event)">
      <div class="modal-content">
        <div class="modal-header">
          <div>
            <h2 class="text-2xl font-bold text-gray-800">{{ currentDiary?.date }}</h2>
            <p class="text-sm text-gray-500 mt-1" v-if="currentDiary">
              {{ getFlowerInfo(currentDiary.emotion).name }} · {{ getEmotionName(currentDiary.emotion) }}
            </p>
          </div>
          <button class="close-btn" @click="closeDiaryModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="diary-content">{{ currentDiary?.content }}</div>
        </div>
      </div>
    </div>

    <!-- 일기 작성 모달 -->
    <div v-if="showWriteModal" class="modal active" @click="handleModalBackgroundClick('write', $event)">
      <div class="modal-content">
        <div class="modal-header">
          <div>
            <h2 class="text-2xl font-bold text-gray-800">{{ writeModalDate }}</h2>
            <p class="text-sm text-gray-500 mt-1">오늘 하루를 기록해보세요</p>
          </div>
          <button class="close-btn" @click="closeWriteModal">&times;</button>
        </div>
        <div class="modal-body">
          <form class="diary-form" @submit.prevent>
            <textarea
              v-model="diaryContent"
              placeholder="오늘은 어떤 하루였나요?&#10;당신의 이야기를 들려주세요...&#10;AI가 당신의 감정을 분석하여 어울리는 꽃을 심어드립니다 🌸"
              required
            ></textarea>
            <div class="flex justify-end gap-3 mt-4">
              <button type="button" class="cancel-btn" @click="closeWriteModal">취소</button>
              <button type="button" class="save-btn test-btn" @click="saveDiary(true)">테스트 (랜덤)</button>
              <button type="button" class="save-btn" @click="saveDiary(false)">AI 분석</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- AI 로딩 모달 -->
    <div v-if="showLoading" class="modal active loading-modal">
      <div class="loading-content">
        <div class="loading-flower">🌱</div>
        <div class="loading-text">AI가 당신의 감정을 분석하고 있어요...</div>
        <div class="loading-spinner">
          <div class="flower-grow"></div>
        </div>
      </div>
    </div>

    <!-- 커스텀 알럿 모달 -->
    <div v-if="showAlert" class="modal active alert-modal">
      <div class="alert-content">
        <div class="alert-icon">{{ alertIcon }}</div>
        <div class="alert-message">{{ alertMessage }}</div>
        <button class="alert-button" @click="closeAlert">확인</button>
      </div>
    </div>

    <!-- 날짜 선택 모달 -->
    <div v-if="showDatePicker" class="modal active" @click="handleModalBackgroundClick('date', $event)">
      <div class="date-picker-content">
        <div class="date-picker-header">
          <h2 class="text-xl font-bold text-gray-800">날짜 선택</h2>
          <button class="close-btn" @click="closeDatePicker">&times;</button>
        </div>
        <div class="date-picker-body">
          <!-- 연도 선택 -->
          <div class="date-section">
            <label class="date-label">연도</label>
            <div class="year-grid">
              <button
                v-for="year in yearOptions"
                :key="year"
                type="button"
                class="year-btn"
                :class="{ active: year === selectedYear }"
                @click="selectYear(year)"
              >
                {{ year }}
              </button>
            </div>
          </div>

          <!-- 월 선택 -->
          <div class="date-section">
            <label class="date-label">월</label>
            <div class="month-grid">
              <button
                v-for="month in 12"
                :key="month"
                type="button"
                class="month-btn"
                :class="{ active: month === selectedMonth }"
                @click="selectMonth(month)"
              >
                {{ month }}월
              </button>
            </div>
          </div>

          <!-- 확인 버튼 -->
          <button class="confirm-date-btn" @click="confirmDate">
            확인
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getFlowerImage, getFlowerInfo, getEmotionName, EMOTION_KR_MAP } from '../utils/flowerMapper.js'
import * as diaryApi from '../services/diaryApi.js'

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

// 일기 데이터 - API에서 로드됨
const diaryData = ref({})

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
        floriography: diary.floriography
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
}

const selectYear = (year) => {
  selectedYear.value = year
}

const selectMonth = (month) => {
  selectedMonth.value = month
}

const confirmDate = () => {
  currentYear.value = selectedYear.value
  currentMonth.value = selectedMonth.value
  closeDatePicker()

  // 날짜가 변경되면 일기 목록 다시 로드
  loadMonthlyDiaries()
}

// 심기 시작 (애니메이션 + 모달)
const startPlanting = (day) => {
  const cell = document.querySelector(`[data-day="${day}"]`)
  const trowel = cell?.querySelector('.trowel')

  if (trowel) {
    // 모종삽 애니메이션
    trowel.classList.add('planting')

    // 애니메이션 끝나면 모달 열기
    setTimeout(() => {
      currentDay.value = day
      showWriteModal.value = true
      trowel.classList.remove('planting')
    }, 600)
  }
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
      floriography: analyzedDiary.floriography
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

// ESC 키로 모달 닫기
const handleEscKey = (e) => {
  if (e.key === 'Escape') {
    closeDiaryModal()
    closeWriteModal()
    closeDatePicker()
    closeAlert()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscKey)

  // 페이지 로드 시 현재 월의 일기 목록 로드
  loadMonthlyDiaries()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
})
</script>

<style scoped>
@font-face {
  font-family: 'Cafe24Ssurround';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2105_2@1.0/Cafe24Ssurround.woff') format('woff');
  font-weight: normal;
  font-display: swap;
}

@font-face {
  font-family: 'LeeSeoyun';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2202-2@1.0/LeeSeoyun.woff') format('woff');
  font-weight: normal;
  font-display: swap;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 움직이는 물방울 배경 */
.polka-dot-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background-color: #F4E4C1;
  overflow: hidden;
}

.dots-layer {
  position: absolute;
  top: -50px;
  left: -50px;
  width: calc(100% + 100px);
  height: calc(100% + 100px);
  background-size: 50px 50px;
}

/* 레이어 1 - 노란 베이지 */
.dots-layer-1 {
  background-image:
    radial-gradient(circle at center, rgba(232, 205, 142, 0.4) 6px, transparent 6px);
  background-position: 0 0, 25px 25px;
  animation: moveDots1 20s linear infinite;
}

/* 레이어 2 - 연한 핑크 */
.dots-layer-2 {
  background-image:
    radial-gradient(circle at center, rgba(255, 182, 193, 0.3) 5px, transparent 5px);
  background-size: 60px 60px;
  background-position: 15px 30px;
  animation: moveDots2 15s linear infinite;
}

/* 레이어 3 - 연한 퍼플 */
.dots-layer-3 {
  background-image:
    radial-gradient(circle at center, rgba(184, 168, 216, 0.25) 7px, transparent 7px);
  background-size: 70px 70px;
  background-position: 35px 15px;
  animation: moveDots3 25s linear infinite;
}

/* 레이어 4 - 연한 오렌지 */
.dots-layer-4 {
  background-image:
    radial-gradient(circle at center, rgba(255, 218, 185, 0.35) 4px, transparent 4px);
  background-size: 45px 45px;
  background-position: 20px 10px;
  animation: moveDots4 18s linear infinite;
}

@keyframes moveDots1 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}

@keyframes moveDots2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-60px, 60px);
  }
}

@keyframes moveDots3 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(70px, -70px);
  }
}

@keyframes moveDots4 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-45px, -45px);
  }
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  max-width: 480px;
  margin: 0 auto;
  width: 100%;
}

/* 상단 타이틀 */
.header-section {
  padding: 20px 20px 10px;
  text-align: center;
  position: relative;
  /* z-index 제거: 툴팁이 타이틀 위에 표시되도록 */
}

.page-title {
  font-family: 'Cafe24Ssurround', sans-serif;
  font-size: 48px;
  font-weight: 900;
  color: white;
  text-shadow:
    1px 1px 0px #E8CD8E,
    2px 2px 0px #E8CD8E,
    3px 3px 0px #D4B87A,
    4px 4px 0px #D4B87A,
    5px 5px 0px #C0A466,
    6px 6px 0px #C0A466,
    7px 7px 0px #AC9052,
    8px 8px 10px rgba(0, 0, 0, 0.4),
    10px 10px 20px rgba(0, 0, 0, 0.3);
  letter-spacing: 3px;
  animation: titleBounce 2s ease-in-out infinite;
  transform-style: preserve-3d;
}

@keyframes titleBounce {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

.flower {
  transition: transform 0.3s ease;
  cursor: pointer;
}

.flower:hover {
  transform: scale(1.15);
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  margin-bottom: 10px;
  opacity: 0;
  pointer-events: none;
  z-index: 1000; /* 타이틀보다 위에 표시 */
  transition: all 0.3s ease;
}

.flower:hover .tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.tooltip-card {
  background: linear-gradient(135deg, #FFFBF0 0%, #FFF4E0 100%);
  border: 3px solid #E8CD8E;
  border-radius: 16px;
  padding: 10px 14px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  text-align: center;
  white-space: nowrap;
  font-family: 'LeeSeoyun', cursive;
  min-width: 140px;
  position: relative;
}

.tooltip-card::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #E8CD8E;
}

.tooltip-flower-name {
  font-size: 18px;
  font-weight: bold;
  color: #5D4E37;
  margin-bottom: 6px;
}

.tooltip-meaning {
  font-size: 13px;
  color: #8B7355;
  margin-bottom: 6px;
  line-height: 1.4;
}

.tooltip-date {
  font-size: 13px;
  color: #A68B6A;
  margin-bottom: 3px;
}

.tooltip-emotion {
  font-size: 12px;
  color: #5D4E37;
  background: rgba(232, 205, 142, 0.3);
  padding: 2px 10px;
  border-radius: 10px;
  display: inline-block;
  margin-top: 4px;
}

.garden-section {
  flex: 1;
  padding: 10px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10vh; /* 하단 스테이터스에 겹치지 않도록 */
}

.garden-wrapper {
  position: relative;
  width: 100%;
  max-width: 100%;
}

.garden-bg-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 12px;
}

/* 격자 그리드 */
.flower-grid {
  position: absolute;
  top: 18%;
  left: 8%;
  width: 84%;
  height: 62%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 1%;
  padding: 2% 4%;
  align-items: end;
  z-index: 10; /* 툴팁이 타이틀 위에 표시되도록 */
}

.grid-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* 꽃 이미지 */
.flower-image {
  width: 100%;
  height: 100%;
  max-width: 60px;
  object-fit: contain;
  filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3));
}

/* 빈 칸 */
.empty-slot {
  width: 100%;
  height: 100%;
  max-width: 45px;
  max-height: 45px;
  border-radius: 50%;
  background: linear-gradient(145deg, rgba(139, 111, 71, 0.25), rgba(107, 84, 57, 0.25));
  border: 2px dashed rgba(139, 111, 71, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: rgba(139, 111, 71, 0.5);
  font-weight: bold;
  box-shadow:
    inset 0 2px 4px rgba(0,0,0,0.15),
    0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.empty-slot:hover {
  background: linear-gradient(145deg, rgba(139, 111, 71, 0.35), rgba(107, 84, 57, 0.35));
  border-color: rgba(139, 111, 71, 0.6);
}

/* 모종삽 - 오른쪽에서 시작 */
.trowel {
  position: absolute;
  width: 45px;
  height: 45px;
  object-fit: contain;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 50;
  transform: translate(20%, -120%) rotate(-25deg) scaleX(-1);
  filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3));
}

.empty-slot:hover + .trowel {
  opacity: 1;
}

/* 꽂히는 애니메이션 - 오른쪽에서 */
@keyframes plantTrowel {
  0% {
    transform: translate(20%, -120%) rotate(-25deg) scaleX(-1);
    opacity: 1;
  }
  50% {
    transform: translate(0%, -20%) rotate(-15deg) scaleX(-1);
    opacity: 1;
  }
  70% {
    transform: translate(0%, -10%) rotate(-10deg) scaleX(-1);
    opacity: 1;
  }
  100% {
    transform: translate(0%, -20%) rotate(-15deg) scaleX(-1);
    opacity: 0;
  }
}

.trowel.planting {
  animation: plantTrowel 0.6s ease-out forwards;
}

/* 월 선택 바 (하단 고정) */
.month-selector-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(139, 111, 71, 0.95);
  backdrop-filter: blur(10px);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
  border-top: 3px solid #E8CD8E;
}

.month-nav {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  font-weight: bold;
}

.month-nav:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.month-display {
  font-size: 20px;
  font-weight: 800;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  min-width: 160px;
  text-align: center;
  flex-shrink: 0;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 10px;
  transition: background 0.2s ease;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.month-display:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

/* 모달 스타일 */
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal.active {
  display: flex;
}

.modal-content {
  background-image: url('../assets/images/note.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 16px;
  max-width: 500px;
  width: 90%;
  height: 600px; /* 고정 높이 */
  max-height: 85vh;
  overflow: hidden; /* 외부 스크롤 숨김 */
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  animation: modalSlideIn 0.3s ease-out;
  padding: 20px 40px 40px 75px; /* 왼쪽 구멍 피하기 */
  display: flex;
  flex-direction: column;
}

@keyframes modalSlideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  padding: 0 0 20px 0;
  border-bottom: none;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0; /* 헤더 크기 고정 */
}

.modal-header h2 {
  font-family: 'LeeSeoyun', cursive;
  font-size: 28px;
  color: #5D4E37;
  text-shadow: none;
}

.modal-header p {
  font-family: 'LeeSeoyun', cursive;
  color: #8B7355;
}

.modal-body {
  padding: 20px 0 0 0;
  font-family: 'LeeSeoyun', cursive;
  line-height: 2.2;
  flex: 1;
  overflow-y: auto; /* 내부 스크롤 */
  overflow-x: hidden;
  min-height: 0; /* flex 스크롤을 위해 필요 */
}

/* 스크롤바 스타일링 */
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: rgba(232, 205, 142, 0.2);
  border-radius: 10px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: rgba(139, 111, 71, 0.5);
  border-radius: 10px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 111, 71, 0.7);
}

.diary-content {
  font-size: 20px;
  color: #5D4E37;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: keep-all;
  min-height: 350px; /* 최소 높이로 일기 작성 화면과 맞춤 */
}

.close-btn {
  background: none;
  border: none;
  font-size: 32px;
  cursor: pointer;
  color: #8B7355;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
  font-weight: bold;
}

.close-btn:hover {
  background: rgba(139, 115, 85, 0.1);
  transform: scale(1.1);
}

/* 감정 선택기 */
.emotion-selector {
  margin-bottom: 20px;
}

.emotion-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  max-height: 280px;
  overflow-y: auto;
  padding: 4px;
}

.emotion-btn {
  padding: 10px 6px;
  border: 2px solid #E8CD8E;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.emotion-btn:hover {
  background: #FFF9E6;
  border-color: #D4B87A;
  transform: scale(1.05);
}

.emotion-btn.active {
  background: #E8CD8E;
  border-color: #C0A466;
  color: white;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  transform: scale(1.05);
}

.emotion-icon {
  font-size: 24px;
  line-height: 1;
}

.emotion-name {
  font-size: 12px;
  font-weight: 600;
  color: #8B6F47;
  text-align: center;
}

.emotion-btn.active .emotion-name {
  color: white;
}

/* 일기 작성 폼 */
.diary-form textarea {
  width: 100%;
  min-height: 300px;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 20px;
  line-height: 1.5;
  resize: none;
  font-family: 'LeeSeoyun', cursive;
  color: #5D4E37;
}

.diary-form textarea::placeholder {
  color: #B8A89A;
  opacity: 0.8;
}

.diary-form textarea:focus {
  outline: none;
}

.diary-form button {
  font-family: 'LeeSeoyun', cursive;
  font-size: 18px;
}

.cancel-btn {
  font-family: 'LeeSeoyun', cursive;
  background: transparent;
  color: #8B7355;
  padding: 8px 16px;
  border: 2px solid #E8CD8E;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: #FFF9E6;
  border-color: #D4B87A;
  transform: translateY(-1px);
}

.save-btn {
  background: #8B6F47;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.save-btn:hover {
  background: #6F5835;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.25);
}

.test-btn {
  background: #A68B6A;
  border: 2px dashed #8B6F47;
}

.test-btn:hover {
  background: #8B7355;
}

/* 날짜 선택 모달 */
.date-picker-content {
  background: white;
  border-radius: 20px;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  animation: modalSlideIn 0.3s ease-out;
}

.date-picker-header {
  padding: 20px;
  border-bottom: 2px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #F4E4C1;
  border-radius: 20px 20px 0 0;
}

.date-picker-header h2 {
  color: #8B6F47;
  font-weight: 800;
}

.date-picker-body {
  padding: 20px;
}

.date-section {
  margin-bottom: 25px;
}

.date-label {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: #8B6F47;
  margin-bottom: 12px;
}

.year-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.year-btn {
  padding: 12px;
  border: 2px solid #E8CD8E;
  background: white;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #8B6F47;
  cursor: pointer;
  transition: all 0.2s ease;
}

.year-btn:hover {
  background: #FFF9E6;
  border-color: #D4B87A;
  transform: scale(1.05);
}

.year-btn.active {
  background: #E8CD8E;
  border-color: #D4B87A;
  color: white;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.month-btn {
  padding: 12px 8px;
  border: 2px solid #E8CD8E;
  background: white;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #8B6F47;
  cursor: pointer;
  transition: all 0.2s ease;
}

.month-btn:hover {
  background: #FFF9E6;
  border-color: #D4B87A;
  transform: scale(1.05);
}

.month-btn.active {
  background: #E8CD8E;
  border-color: #D4B87A;
  color: white;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.confirm-date-btn {
  width: 100%;
  padding: 14px;
  background: #8B6F47;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  margin-top: 10px;
}

.confirm-date-btn:hover {
  background: #6F5835;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.3);
}

/* 커스텀 알럿 */
.alert-modal {
  background: rgba(0, 0, 0, 0.6);
}

.alert-content {
  background: linear-gradient(135deg, #FFFBF0 0%, #FFF4E0 100%);
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 15px 40px rgba(0,0,0,0.4);
  animation: modalSlideIn 0.3s ease-out;
  border: 3px solid #E8CD8E;
  max-width: 320px;
  width: 90%;
}

.alert-icon {
  font-size: 60px;
  margin-bottom: 20px;
  animation: alertBounce 0.6s ease-out;
}

@keyframes alertBounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.alert-message {
  font-family: 'LeeSeoyun', cursive;
  font-size: 22px;
  color: #5D4E37;
  margin-bottom: 30px;
  line-height: 1.6;
  font-weight: bold;
}

.alert-button {
  background: #8B6F47;
  color: white;
  padding: 12px 40px;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  font-family: 'LeeSeoyun', cursive;
}

.alert-button:hover {
  background: #6F5835;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.25);
}

/* AI 로딩 화면 */
.loading-modal {
  background: rgba(0, 0, 0, 0.8);
}

.loading-content {
  background: linear-gradient(135deg, #F4E4C1 0%, #E8D5B5 100%);
  border-radius: 24px;
  padding: 50px 40px;
  text-align: center;
  box-shadow: 0 15px 40px rgba(0,0,0,0.4);
  animation: modalSlideIn 0.3s ease-out;
}

.loading-flower {
  font-size: 80px;
  animation: flowerBounce 1.5s ease-in-out infinite;
  margin-bottom: 20px;
}

@keyframes flowerBounce {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.1);
  }
}

.loading-text {
  font-family: 'LeeSeoyun', cursive;
  font-size: 24px;
  color: #5D4E37;
  margin-bottom: 30px;
  font-weight: bold;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.flower-grow {
  width: 60px;
  height: 60px;
  border: 5px solid #E8CD8E;
  border-top-color: #8B6F47;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 모바일 최적화 */
@media (max-width: 480px) {
  .page-title {
    font-size: 36px;
  }

  .flower-image {
    max-width: 50px;
  }

  .empty-slot {
    max-width: 40px;
    max-height: 40px;
    font-size: 20px;
  }

  .trowel {
    width: 40px;
    height: 40px;
    transform: translate(15%, -120%) rotate(-25deg) scaleX(-1);
  }

  .stats-title {
    font-size: 18px;
  }

  .stat-icon {
    font-size: 32px;
  }

  .stat-name {
    font-size: 14px;
  }

  /* 모바일에서 일기장 크기 조정 */
  .modal-content {
    height: 550px;
    padding: 30px 35px 30px 45px;
  }

  .modal-header h2 {
    font-size: 24px;
  }

  .diary-content {
    font-size: 18px;
    min-height: 300px;
  }

  .diary-form textarea {
    font-size: 18px;
    min-height: 250px;
  }

  .loading-text {
    font-size: 20px;
  }

  .alert-message {
    font-size: 20px;
  }

  /* 모바일 툴팁 크기 조정 */
  .tooltip-card {
    min-width: 120px;
    padding: 8px 10px;
  }

  .tooltip-flower-name {
    font-size: 16px;
    margin-bottom: 4px;
  }

  .tooltip-meaning {
    font-size: 11px;
    margin-bottom: 4px;
  }

  .tooltip-date {
    font-size: 11px;
  }

  .tooltip-emotion {
    font-size: 10px;
    padding: 2px 6px;
  }
}
</style>
