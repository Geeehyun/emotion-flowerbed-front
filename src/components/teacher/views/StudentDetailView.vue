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
            <div class="teacher-student-item-info">
              <div class="teacher-student-avatar" :class="getStudentStatusClass(student)">
                {{ student.name[0] }}
              </div>
              <div>
                <p class="teacher-student-item-name">{{ student.name }}</p>
                <p class="teacher-student-item-meta">최근 레터: {{ student.lastLetterDate }}</p>
              </div>
            </div>
            <span v-if="student.status !== 'normal'" class="teacher-student-status-dot" :class="student.status"></span>
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
            <p>주간 감정 분석 리포트입니다</p>
          </div>
          <div class="teacher-letter-list-body">
            <div
              v-for="letter in selectedStudent.letters"
              :key="letter.id"
              @click="emit('select-letter', letter)"
              class="teacher-letter-list-item"
            >
              <div class="teacher-letter-item-icon">📬</div>
              <div class="teacher-letter-item-info">
                <h3 class="teacher-letter-item-title">{{ letter.title }}</h3>
                <p class="teacher-letter-item-period">{{ letter.period }}</p>
                <div class="teacher-letter-item-emotions">
                  <span v-for="emotion in letter.emotions" :key="emotion.name" class="teacher-emotion-badge" :style="{ backgroundColor: emotion.color }">
                    {{ emotion.name }}
                  </span>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="teacher-letter-item-arrow">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
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
  }
})

const emit = defineEmits(['update:searchQuery', 'reload', 'select-student', 'select-letter', 'deselect-letter'])

const getStudentStatusClass = (student) => {
  const statusMap = {
    danger: 'status-danger',
    attention: 'status-attention',
    normal: 'status-normal'
  }
  return statusMap[student.status] || 'status-normal'
}
</script>
