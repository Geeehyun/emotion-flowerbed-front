<template>
  <div class="teacher-studentmap-view">
    <div class="teacher-student-analysis-container">
      <!-- 학생 목록 (좌측) -->
      <div class="teacher-student-list-panel">
        <div class="teacher-student-list-header">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="teacher-search-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            :value="searchQuery"
            @input="emit('update:searchQuery', $event.target.value)"
            type="text"
            placeholder="학생 이름 검색..."
            class="teacher-student-search-input"
          >
        </div>
        <div class="teacher-student-list-body">
          <!-- 로딩 상태 -->
          <div v-if="isLoading" class="teacher-empty-state">
            <p>학생 목록을 불러오는 중...</p>
          </div>

          <!-- 에러 상태 -->
          <div v-else-if="errorMessage" class="teacher-empty-state">
            <p style="color: #D32F2F;">{{ errorMessage }}</p>
            <button @click="emit('reload')" style="margin-top: 12px; padding: 8px 16px; border-radius: 8px; background: #F8F3E8; border: 1px solid #D4C4B0; cursor: pointer;">
              다시 시도
            </button>
          </div>

          <!-- 학생 목록 -->
          <div
            v-else
            v-for="student in filteredStudents"
            :key="student.id"
            @click="emit('select-student', student)"
            :class="{ active: selectedStudent?.id === student.id }"
            class="teacher-student-list-item"
          >
            <div class="teacher-student-item-main">
              <div class="teacher-student-item-left">
                <!-- 꽃 이미지 아바타 -->
                <div class="teacher-student-avatar" :class="getEmotionAreaClass(student)">
                  <img
                    :src="`/flowers/3d_pot/${student.recentCoreEmotionImage || 'unknown.png'}`"
                    :alt="student.recentCoreEmotionNameKr || '알 수 없음'"
                    class="teacher-avatar-flower-image"
                    @error="(e) => e.target.src = '/flowers/3d_pot/unknown.png'"
                  >
                </div>
                <div class="teacher-student-item-text">
                  <div class="teacher-student-name-row">
                    <p class="teacher-student-item-name">{{ student.name }}</p>
                    <span v-if="student.riskLevel === 'DANGER'" class="teacher-risk-badge danger">위험</span>
                    <span v-else-if="student.riskLevel === 'CAUTION'" class="teacher-risk-badge caution">주의</span>
                  </div>
                  <div v-if="student.recentEmotionArea" class="teacher-student-emotion-info">
                    <span class="teacher-emotion-label">최근 감정:</span>
                    <span class="teacher-emotion-name">
                      {{ student.recentCoreEmotionNameKr || '분석 중' }}
                      <span class="teacher-emotion-area">({{ getEmotionAreaName(student.recentEmotionArea) }})</span>
                    </span>
                  </div>
                  <p v-else class="teacher-student-no-emotion">일기 미작성</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 레터 리스트 또는 상세 (우측) -->
      <div class="teacher-student-detail-panel">
        <!-- 학생 미선택 상태 -->
        <div v-if="!selectedStudent" class="teacher-empty-state">
          <div class="teacher-empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <h3>학생을 선택하세요</h3>
          <p>좌측 목록에서 학생을 선택하면 감정 레터를 확인할 수 있습니다</p>
        </div>

        <!-- 레터 리스트 (학생 선택됨, 레터 미선택) -->
        <div v-else-if="!selectedLetter" class="teacher-letter-list-view">
          <div class="teacher-letter-list-header">
            <h2>{{ selectedStudent.name }} 학생의 감정 레터</h2>
            <p>주간 감정 분석 레터입니다</p>
          </div>

          <!-- 로딩 상태 -->
          <div v-if="isLoadingReports" class="teacher-letter-list-body">
            <div class="teacher-empty-state">
              <p>감정 레터를 불러오는 중...</p>
            </div>
          </div>

          <!-- 리포트 없음 -->
          <div v-else-if="weeklyReports.length === 0" class="teacher-letter-list-body">
            <div class="teacher-empty-state">
              <h3>감정 레터가 없습니다</h3>
              <p>아직 생성된 감정 레터가 없습니다</p>
            </div>
          </div>

          <!-- 리포트 테이블 -->
          <div v-else class="teacher-letter-list-body">
            <table class="teacher-letter-table">
              <thead>
                <tr>
                  <th>기간</th>
                  <th>일기</th>
                  <th>상태</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="report in weeklyReports"
                  :key="report.reportId"
                  @click="emit('select-letter', report)"
                  class="teacher-letter-table-row"
                  :class="{ 'unread': !report.readYn }"
                >
                  <td class="teacher-letter-period-cell">
                    <div class="teacher-letter-period-text">
                      <span class="teacher-letter-week">{{ formatPeriodShort(report.startDate, report.endDate) }}</span>
                      <span class="teacher-letter-dates">{{ formatDateRange(report.startDate, report.endDate) }}</span>
                    </div>
                  </td>
                  <td class="teacher-letter-count-cell">{{ report.diaryCount }}개</td>
                  <td class="teacher-letter-status-cell">
                    <span v-if="!report.isAnalyzed" class="teacher-analysis-status analyzing">분석 중</span>
                    <span v-else class="teacher-analysis-status analyzed">분석 완료</span>
                  </td>
                  <td class="teacher-letter-arrow-cell">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="teacher-letter-arrow-icon">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 레터 상세 + TIP (레터 선택됨) -->
        <div v-else class="teacher-letter-detail-view">
          <button @click="emit('deselect-letter')" class="teacher-back-to-list-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            목록으로
          </button>
          <div class="teacher-letter-detail-content">
            <h2>{{ selectedLetter.title }}</h2>
            <p class="teacher-letter-detail-period">{{ selectedLetter.period }}</p>
            <p class="teacher-dev-note">📝 레터 상세 내용 개발 중...</p>

            <div class="teacher-tip-section">
              <h3>💡 선생님을 위한 TIP</h3>
              <p class="teacher-dev-note">📝 개발 중...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  },
  filteredStudents: {
    type: Array,
    default: () => []
  },
  selectedStudent: {
    type: Object,
    default: null
  },
  selectedLetter: {
    type: Object,
    default: null
  },
  weeklyReports: {
    type: Array,
    default: () => []
  },
  isLoadingReports: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:searchQuery', 'reload', 'select-student', 'select-letter', 'deselect-letter'])

// 감정 영역에 따른 아바타 색상 클래스
const getEmotionAreaClass = (student) => {
  if (!student.recentEmotionArea) {
    return 'emotion-none'
  }

  const areaMap = {
    red: 'emotion-red',
    yellow: 'emotion-yellow',
    blue: 'emotion-blue',
    green: 'emotion-green',
    none: 'emotion-none'
  }
  return areaMap[student.recentEmotionArea] || 'emotion-none'
}

// 감정 영역명 한글 변환
const getEmotionAreaName = (area) => {
  const areaNames = {
    red: '빨강',
    yellow: '노랑',
    blue: '파랑',
    green: '초록',
    none: '없음'
  }
  return areaNames[area] || area
}

// 리포트 제목 포맷
const formatReportTitle = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const startMonth = start.getMonth() + 1
  const endMonth = end.getMonth() + 1

  if (startMonth === endMonth) {
    return `${startMonth}월 ${start.getDate()}일 ~ ${end.getDate()}일 감정 레터`
  } else {
    return `${startMonth}월 ${start.getDate()}일 ~ ${endMonth}월 ${end.getDate()}일 감정 레터`
  }
}

// 날짜 범위 포맷
const formatDateRange = (startDate, endDate) => {
  return `${startDate} ~ ${endDate}`
}

// 기간 짧은 포맷 (테이블용)
const formatPeriodShort = (startDate, endDate) => {
  const start = new Date(startDate)
  const year = start.getFullYear()
  const month = start.getMonth() + 1
  const date = start.getDate()

  // 해당 월의 몇 번째 주인지 계산
  const weekNumber = Math.ceil(date / 7)

  const weekNames = ['첫째', '둘째', '셋째', '넷째', '다섯째']
  const weekName = weekNames[weekNumber - 1] || `${weekNumber}번째`

  return `${year}년 ${month}월 ${weekName}주`
}
</script>
