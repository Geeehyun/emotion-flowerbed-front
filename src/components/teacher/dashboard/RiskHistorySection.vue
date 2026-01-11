<template>
  <section v-if="selectedRiskStudent" class="teacher-risk-history-section teacher-risk-history-desktop">
    <div class="teacher-risk-history-content">
      <div class="teacher-risk-history-header">
        <div>
          <h3 class="teacher-risk-history-title">{{ selectedRiskStudent.name }} 학생</h3>
          <p class="teacher-risk-history-subtitle">위험도 변화 이력</p>
        </div>
        <div class="teacher-history-actions">
          <button
            @click="emit('detail-analysis', selectedRiskStudent)"
            class="teacher-detail-analysis-btn"
          >
            상세 분석 보기
          </button>
          <button
            v-if="selectedRiskStudent.riskLevel === 'DANGER'"
            @click="emit('resolve-danger')"
            class="teacher-resolve-danger-btn"
          >
            위험 해지
          </button>
        </div>
      </div>

      <!-- 로딩 중 -->
      <div v-if="isLoadingHistory" class="teacher-history-loading">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="teacher-loading-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        <p>히스토리를 불러오는 중...</p>
      </div>

      <!-- 히스토리 테이블 -->
      <div v-else-if="riskHistory && riskHistory.histories.length > 0" class="teacher-history-table-wrapper">
        <table class="teacher-history-table">
          <thead>
            <tr>
              <th>날짜/시각</th>
              <th>상태 변화</th>
              <th>사유</th>
              <th>키워드</th>
              <th>선생님 메모</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="history in riskHistory.histories"
              :key="history.historyId"
              class="teacher-history-row"
            >
              <td class="teacher-history-date-cell">
                {{ formatDate(history.createdAt) }}
              </td>
              <td class="teacher-history-level-cell">
                <div class="teacher-history-level-change">
                  <span v-if="history.previousLevel" :class="`teacher-level-badge teacher-level-${history.previousLevel.toLowerCase()}`">
                    {{ formatLevel(history.previousLevel) }}
                  </span>
                  <span v-else class="teacher-level-badge teacher-level-none">-</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="teacher-arrow-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                  <span :class="`teacher-level-badge teacher-level-${history.newLevel.toLowerCase()}`">
                    {{ formatLevel(history.newLevel) }}
                  </span>
                </div>
              </td>
              <td class="teacher-history-reason-cell">
                <p v-if="history.riskReason">{{ history.riskReason }}</p>
                <p v-else class="teacher-empty-cell">-</p>
              </td>
              <td class="teacher-history-keywords-cell">
                <div v-if="history.concernKeywords && history.concernKeywords.length > 0" class="teacher-history-keywords">
                  <span
                    v-for="keyword in history.concernKeywords"
                    :key="keyword"
                    class="teacher-keyword-tag"
                  >
                    {{ keyword }}
                  </span>
                </div>
                <p v-else class="teacher-empty-cell">-</p>
              </td>
              <td class="teacher-history-memo-cell">
                <div v-if="history.teacherMemo" class="teacher-history-memo">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  <p>{{ history.teacherMemo }}</p>
                </div>
                <p v-else class="teacher-empty-cell">-</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 히스토리 없음 -->
      <div v-else class="teacher-history-empty">
        <p>위험도 변화 이력이 없습니다</p>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  selectedRiskStudent: {
    type: Object,
    default: null
  },
  riskHistory: {
    type: Object,
    default: null
  },
  isLoadingHistory: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['detail-analysis', 'resolve-danger'])

// 날짜 포맷 헬퍼 함수
const formatDate = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 위험도 레벨 포맷 헬퍼 함수
const formatLevel = (level) => {
  const levelMap = {
    'NORMAL': '정상',
    'CAUTION': '주의',
    'DANGER': '위험'
  }
  return levelMap[level] || level
}
</script>
