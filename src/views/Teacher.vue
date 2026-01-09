<template>
  <div class="teacher-container" :class="{ 'sidebar-collapsed': isCollapsed }">
    <!-- 모바일 풀페이지 메뉴 -->
    <TeacherMobileMenu
      v-model:isOpen="isMobileMenuOpen"
      v-model:currentView="currentView"
      :teacherInfo="teacherInfo"
      @logout="handleLogout"
    />

    <!-- 사이드바 -->
    <TeacherSidebar
      v-model:isCollapsed="isCollapsed"
      v-model:currentView="currentView"
      v-model:isUserTooltipOpen="isUserTooltipOpen"
      :teacherInfo="teacherInfo"
      @logout="handleLogout"
    />

    <!-- 메인 컨텐츠 -->
    <main class="teacher-main">
      <!-- 위험 신호 경고 바 -->
      <div v-if="dangerStudents.length > 0" class="teacher-danger-alert-bar">
        <div class="teacher-danger-alert-content">
          <div class="teacher-danger-alert-icon"></div>
          <span class="teacher-danger-alert-label">위험 신호 감지:</span>
          <span>심리적 위기 가능성이 있는 학생이 {{ dangerStudents.length }}명 있습니다.</span>
        </div>
          <!-- <button @click="currentView = 'studentMap'" class="teacher-danger-alert-btn">
            확인하기
          </button> -->
      </div>

      <!-- 헤더 -->
      <TeacherHeader
        :viewTitle="viewTitle"
        :todayDate="todayDate"
        @open-mobile-menu="isMobileMenuOpen = true"
        @open-moodmeter-modal="isMoodMeterModalOpen = true"
      />

      <!-- 컨텐츠 영역 -->
      <div class="teacher-content">
        <!-- 오늘의 학급 화단  뷰 -->
        <DashboardView
          v-if="currentView === 'dashboard'"
          v-model:selectedDate="selectedDate"
          :isLoading="isLoading"
          :errorMessage="errorMessage"
          :totalStudents="totalStudents"
          :zoneDistribution="zoneDistribution"
          :students="students"
          :dangerStudents="dangerStudents"
          :attentionStudents="attentionStudents"
          :selectedRiskStudent="selectedRiskStudent"
          :riskHistory="riskHistory"
          :isLoadingHistory="isLoadingHistory"
          @date-change="handleDateChange"
          @select-risk-student="selectRiskStudent"
          @detail-analysis="goToStudentDetailAnalysis"
          @resolve-danger="openResolveDangerModal"
        />

        <!-- 이달의 학급 화단  뷰 -->
        <ClassEmotionMapView v-else-if="currentView === 'classMap'" />

        <!-- 학생별 감정 레터 뷰 -->
        <StudentDetailView
          v-else-if="currentView === 'studentMap'"
          v-model:searchQuery="searchQuery"
          :isLoading="isLoadingLetterStudents"
          :errorMessage="letterErrorMessage"
          :filteredStudents="filteredLetterStudents"
          :selectedStudent="selectedStudent"
          :selectedLetter="selectedLetter"
          :weeklyReports="weeklyReports"
          :isLoadingReports="isLoadingReports"
          @reload="loadStudentsForLetter()"
          @select-student="selectStudent"
          @select-letter="selectLetter"
          @deselect-letter="selectedLetter = null"
        />
      </div>
    </main>

    <!-- 감정 무드미터 안내 모달 -->
    <MoodMeterInfoModal v-model="isMoodMeterModalOpen" />

    <!-- 위험 해지 모달 -->
    <ResolveDangerModal
      v-model="isResolveDangerModalOpen"
      :student-name="selectedRiskStudent?.name || ''"
      @resolve="handleResolveDanger"
    />

    <!-- 위험 히스토리 모바일 모달 -->
    <RiskHistoryMobileModal
      v-model="isRiskHistoryMobileModalOpen"
      :student-name="selectedRiskStudent?.name || ''"
      :risk-level="selectedRiskStudent?.riskLevel || ''"
      :history="riskHistory?.histories || []"
      :is-loading="isLoadingHistory"
      @resolve="openResolveDangerModal"
      @detail-analysis="goToStudentDetailAnalysis(selectedRiskStudent)"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { logout } from '@/services/authApi.js'
import { getDailyEmotionStatus, getAtRiskStudents, getStudentRiskHistory, resolveDanger, getStudents, getStudentWeeklyReports } from '@/services/teacherApi.js'

// Layout 컴포넌트
import TeacherSidebar from '@/components/teacher/layout/TeacherSidebar.vue'
import TeacherMobileMenu from '@/components/teacher/layout/TeacherMobileMenu.vue'
import TeacherHeader from '@/components/teacher/layout/TeacherHeader.vue'

// View 컴포넌트
import DashboardView from '@/components/teacher/views/DashboardView.vue'
import ClassEmotionMapView from '@/components/teacher/views/ClassEmotionMapView.vue'
import StudentDetailView from '@/components/teacher/views/StudentDetailView.vue'

// Modal 컴포넌트
import MoodMeterInfoModal from '@/components/teacher/modals/MoodMeterInfoModal.vue'
import ResolveDangerModal from '@/components/teacher/modals/ResolveDangerModal.vue'
import RiskHistoryMobileModal from '@/components/teacher/modals/RiskHistoryMobileModal.vue'

// 선생님 정보 로드
const getUserInfo = () => {
  try {
    const userInfoStr = localStorage.getItem('userInfo')
    return userInfoStr ? JSON.parse(userInfoStr) : {}
  } catch (error) {
    console.error('사용자 정보 로드 실패:', error)
    return {}
  }
}

const teacherInfo = ref(getUserInfo())

// 상태
const currentView = ref('dashboard')
const isCollapsed = ref(false)
const isMobileMenuOpen = ref(false)
const isUserTooltipOpen = ref(false)
const isMoodMeterModalOpen = ref(false)
const isResolveDangerModalOpen = ref(false)
const isRiskHistoryMobileModalOpen = ref(false)
const selectedStudent = ref(null)
const selectedLetter = ref(null)
const searchQuery = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

// 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
const getTodayDateString = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 날짜 선택
const selectedDate = ref(getTodayDateString())

// 감정 현황 데이터
const currentDate = ref(null) // 현재 조회 중인 날짜
const emotionData = ref(null) // 전체 감정 현황 데이터
const students = ref([])

// 학생 목록 데이터 (감정 레터용)
const letterStudents = ref([])
const isLoadingLetterStudents = ref(false)
const letterErrorMessage = ref('')

// 주간 리포트 데이터
const weeklyReports = ref([])
const isLoadingReports = ref(false)
const reportsErrorMessage = ref('')

// 위험 학생 데이터
const atRiskData = ref(null) // 위험 학생 리스트 데이터
const atRiskStudents = ref([]) // 위험 학생 목록
const selectedRiskStudent = ref(null) // 선택된 위험 학생
const riskHistory = ref(null) // 선택된 학생의 위험 히스토리
const isLoadingRisk = ref(false) // 위험 학생 로딩 상태
const isLoadingHistory = ref(false) // 히스토리 로딩 상태
const riskErrorMessage = ref('') // 위험 학생 에러 메시지

// area 값 기반으로 학생 상태 결정
const determineStatus = (area) => {
  if (area === 'red') {
    return 'danger'
  } else if (area === 'yellow' || area === 'unanalyzed') {
    return 'attention'
  } else {
    // green, blue, none
    return 'normal'
  }
}

// 감정 영역별 위험 신호/주의 사유 설정
const getDangerSignal = (student) => {
  if (student.area === 'red') {
    return `핵심 감정: ${student.coreEmotion || '분석 중'}`
  }
  return ''
}

const getAttentionReason = (student) => {
  if (student.area === 'yellow') {
    return `핵심 감정: ${student.coreEmotion || '분석 중'}`
  } else if (student.area === 'unanalyzed') {
    return '감정 분석 대기 중'
  }
  return ''
}

// API에서 받은 학생 데이터를 화면용 데이터로 변환
const mapStudentData = (apiStudent) => {
  return {
    id: apiStudent.userSn,
    name: apiStudent.name,
    area: apiStudent.area,
    coreEmotion: apiStudent.coreEmotion,
    coreEmotionNameKr: apiStudent.coreEmotionNameKr,
    isAnalyzed: apiStudent.isAnalyzed,
    status: determineStatus(apiStudent.area),
    dangerSignal: getDangerSignal(apiStudent),
    attentionReason: getAttentionReason(apiStudent),
    lastLetterDate: '-', // TODO: 추후 레터 API 추가 시 업데이트
    letters: [] // TODO: 추후 레터 API 추가 시 업데이트
  }
}

// 일별 감정 현황 로드
const loadDailyEmotionStatus = async (date = null) => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    const data = await getDailyEmotionStatus(date)

    emotionData.value = data
    currentDate.value = data.date
    students.value = data.students.map(mapStudentData)
  } catch (error) {
    console.error('감정 현황 로드 실패:', error)
    errorMessage.value = error.message || '감정 현황을 불러오는데 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

// 위험 학생 리스트 로드
const loadAtRiskStudents = async (level = 'ALL') => {
  try {
    isLoadingRisk.value = true
    riskErrorMessage.value = ''

    const data = await getAtRiskStudents(level)

    atRiskData.value = data
    atRiskStudents.value = data.students
  } catch (error) {
    console.error('위험 학생 리스트 로드 실패:', error)
    riskErrorMessage.value = error.message || '위험 학생 목록을 불러오는데 실패했습니다.'
  } finally {
    isLoadingRisk.value = false
  }
}

// API 응답을 학생 레터용 데이터로 변환
const mapLetterStudentData = (apiStudent) => {
  return {
    id: apiStudent.userSn,
    name: apiStudent.name,
    userId: apiStudent.userId,
    schoolCode: apiStudent.schoolCode,
    schoolNm: apiStudent.schoolNm,
    classCode: apiStudent.classCode,
    riskLevel: apiStudent.riskLevel,
    riskReason: apiStudent.riskReason,
    riskContinuousArea: apiStudent.riskContinuousArea,
    riskContinuousDays: apiStudent.riskContinuousDays,
    recentEmotionArea: apiStudent.recentEmotionArea,
    recentCoreEmotionCd: apiStudent.recentCoreEmotionCd,
    recentCoreEmotionNameKr: apiStudent.recentCoreEmotionNameKr,
    recentCoreEmotionImage: apiStudent.recentCoreEmotionImage,
    // UI용 상태 값
    status: apiStudent.riskLevel === 'DANGER' ? 'danger' : apiStudent.riskLevel === 'CAUTION' ? 'attention' : 'normal',
    lastLetterDate: '-', // TODO: 추후 레터 API 추가 시 업데이트
    letters: [] // TODO: 추후 레터 API 추가 시 업데이트
  }
}

// 학생 목록 로드 (감정 레터용)
const loadStudentsForLetter = async () => {
  try {
    isLoadingLetterStudents.value = true
    letterErrorMessage.value = ''

    const data = await getStudents()
    letterStudents.value = data.map(mapLetterStudentData)
  } catch (error) {
    console.error('학생 목록 로드 실패:', error)
    letterErrorMessage.value = error.message || '학생 목록을 불러오는데 실패했습니다.'
  } finally {
    isLoadingLetterStudents.value = false
  }
}

// 학생 위험 히스토리 로드
const loadStudentRiskHistory = async (studentUserSn) => {
  try {
    isLoadingHistory.value = true

    const data = await getStudentRiskHistory(studentUserSn)
    riskHistory.value = data
  } catch (error) {
    console.error('위험 히스토리 로드 실패:', error)
    riskHistory.value = null
  } finally {
    isLoadingHistory.value = false
  }
}

// 주간 리포트 로드
const loadWeeklyReports = async (studentUserSn) => {
  try {
    isLoadingReports.value = true
    reportsErrorMessage.value = ''

    const data = await getStudentWeeklyReports(studentUserSn)
    weeklyReports.value = data
  } catch (error) {
    console.error('주간 리포트 로드 실패:', error)
    reportsErrorMessage.value = error.message || '주간 리포트를 불러오는데 실패했습니다.'
    weeklyReports.value = []
  } finally {
    isLoadingReports.value = false
  }
}

// 화면 크기 확인 (모바일 여부)
const isMobile = () => {
  return window.innerWidth <= 768
}

// 위험 학생 선택 핸들러
const selectRiskStudent = async (student) => {
  selectedRiskStudent.value = student
  await loadStudentRiskHistory(student.userSn)

  // 모바일에서는 모달 열기
  if (isMobile()) {
    isRiskHistoryMobileModalOpen.value = true
  }
}

// 위험 해지 모달 열기
const openResolveDangerModal = () => {
  isResolveDangerModalOpen.value = true
}

// 위험 해지 핸들러
const handleResolveDanger = async (memo) => {
  try {
    if (!selectedRiskStudent.value) return

    await resolveDanger(selectedRiskStudent.value.userSn, memo)

    // 모달 닫기
    isResolveDangerModalOpen.value = false

    // 성공 시 리스트 다시 로드
    await loadAtRiskStudents()

    // 선택된 학생 초기화
    selectedRiskStudent.value = null
    riskHistory.value = null

    alert('위험 상태가 해지되었습니다.')
  } catch (error) {
    console.error('위험 해지 실패:', error)
    alert('위험 상태 해지에 실패했습니다.')
    // 모달은 열어둠 (재시도 가능)
  }
}

// 날짜 선택 변경 핸들러
const handleDateChange = () => {
  loadDailyEmotionStatus(selectedDate.value)
}

// 오늘의 학급 화단  통계 데이터 (API에서 받은 데이터 사용)
const totalStudents = computed(() => {
  return emotionData.value?.totalCount || 0
})

const zoneDistribution = computed(() => {
  if (!emotionData.value?.area) {
    return {
      red: 0,
      yellow: 0,
      blue: 0,
      green: 0,
      none: 0,
      unanalyzed: 0
    }
  }

  return {
    red: emotionData.value.area.red || 0,
    yellow: emotionData.value.area.yellow || 0,
    blue: emotionData.value.area.blue || 0,
    green: emotionData.value.area.green || 0,
    none: emotionData.value.area.none || 0,
    unanalyzed: emotionData.value.area.unanalyzed || 0
  }
})

// 컴포넌트 마운트 시 선택된 날짜(오늘)의 감정 현황 로드
onMounted(async () => {
  await loadDailyEmotionStatus(selectedDate.value)
  await loadAtRiskStudents() // 위험 학생 리스트 로드
})

// 뷰 변경 감지
watch(currentView, async (newView, oldView) => {
  // 다른 뷰에서 오늘의 학급 화단 로 돌아올 때만
  if (newView === 'dashboard' && oldView !== 'dashboard') {
    // 날짜를 오늘로 초기화
    selectedDate.value = getTodayDateString()

    // 선택된 위험 학생 초기화
    selectedRiskStudent.value = null
    riskHistory.value = null

    // 오늘 날짜 데이터 다시 로드
    await loadDailyEmotionStatus(selectedDate.value)
  }

  // 학생별 감정 레터 뷰로 진입할 때
  if (newView === 'studentMap' && oldView !== 'studentMap') {
    // 선택된 학생 및 레터 초기화
    selectedStudent.value = null
    selectedLetter.value = null
    searchQuery.value = ''

    // 학생 목록 로드
    await loadStudentsForLetter()
  }
})

// 오늘 날짜
const todayDate = new Date().toLocaleDateString('ko-KR', {
  month: 'long',
  day: 'numeric',
  weekday: 'long'
})

// Computed
const viewTitle = computed(() => {
  switch (currentView.value) {
    case 'dashboard':
      return '오늘의 학급 현황'
    case 'classMap':
      return '이달의 학급 화단 '
    case 'studentMap':
      return '학생별 감정 레터'
    default:
      return ''
  }
})

const dangerStudents = computed(() => {
  return atRiskStudents.value.filter(s => s.riskLevel === 'DANGER')
})

const attentionStudents = computed(() => {
  return atRiskStudents.value.filter(s => s.riskLevel === 'CAUTION')
})

const filteredStudents = computed(() => {
  if (!searchQuery.value) return students.value
  return students.value.filter(s => s.name.includes(searchQuery.value))
})

const filteredLetterStudents = computed(() => {
  if (!searchQuery.value) return letterStudents.value
  return letterStudents.value.filter(s => s.name.includes(searchQuery.value))
})

// 메서드
const selectStudent = async (student) => {
  selectedStudent.value = student
  selectedLetter.value = null

  // 학생의 주간 리포트 로드
  if (student) {
    await loadWeeklyReports(student.id)
  }
}

const selectLetter = (letter) => {
  selectedLetter.value = letter
}

// 위험 학생 -> 상세 분석 이동
const goToStudentDetailAnalysis = (riskStudent) => {
  if (!riskStudent) return

  // students 배열에서 해당 학생 찾기 (userSn으로 매칭)
  const student = students.value.find(s => s.id === riskStudent.userSn)

  if (student) {
    selectedStudent.value = student
  }

  // 학생별 감정 레터 뷰로 이동
  currentView.value = 'studentMap'

  // 모바일 모달이 열려있다면 닫기
  isRiskHistoryMobileModalOpen.value = false
}

const handleLogout = async () => {
  try {
    await logout()
    localStorage.removeItem('userType')
    window.setAuth(false)
  } catch (error) {
    console.error('로그아웃 실패:', error)
  }
}
</script>

<style>
@import '@/assets/styles/teacher.css';
</style>
