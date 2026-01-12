<template>
  <BaseTeacherModal
    v-model="isOpen"
    :title="`${studentName} 학생`"
    subtitle="위험도 변화 이력"
    max-width="1200px"
    @close="handleClose"
  >
    <!-- 액션 버튼들 -->
    <div v-if="showDetailAnalysis || riskLevel === 'DANGER'" class="teacher-modal-action-section">
      <button
        v-if="showDetailAnalysis"
        @click="handleDetailAnalysisClick"
        class="teacher-detail-analysis-btn-mobile"
      >
        상세 분석 보기
      </button>
      <button
        v-if="riskLevel === 'DANGER'"
        @click="handleResolveClick"
        class="teacher-resolve-danger-btn"
      >
        위험 해지
      </button>
    </div>

    <!-- 로딩 중 -->
    <div v-if="isLoading" class="teacher-history-loading">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="teacher-loading-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
      <p>히스토리를 불러오는 중...</p>
    </div>

    <!-- 히스토리 테이블 -->
    <div v-else-if="history && history.length > 0" class="teacher-history-table-wrapper">
      <table class="teacher-history-table">
        <thead>
          <tr>
            <th>날짜/시각</th>
            <th>상태 변화</th>
            <th>사유</th>
            <th>키워드</th>
            <th>메모</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in history"
            :key="item.historyId"
            class="teacher-history-row"
          >
            <td class="teacher-history-date-cell">
              {{ formatDate(item.createdAt) }}
            </td>
            <td class="teacher-history-level-cell">
              <div class="teacher-history-level-change">
                <span v-if="item.previousLevel" :class="`teacher-level-badge teacher-level-${item.previousLevel.toLowerCase()}`">
                  {{ formatLevel(item.previousLevel) }}
                </span>
                <span v-else class="teacher-level-badge teacher-level-none">-</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="teacher-arrow-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
                <span :class="`teacher-level-badge teacher-level-${item.newLevel.toLowerCase()}`">
                  {{ formatLevel(item.newLevel) }}
                </span>
              </div>
            </td>
            <td class="teacher-history-reason-cell">
              <p v-if="item.riskReason">{{ item.riskReason }}</p>
              <p v-else class="teacher-empty-cell">-</p>
            </td>
            <td class="teacher-history-keywords-cell">
              <div v-if="item.concernKeywords && item.concernKeywords.length > 0" class="teacher-history-keywords">
                <span
                  v-for="keyword in item.concernKeywords"
                  :key="keyword"
                  class="teacher-keyword-tag"
                >
                  {{ keyword }}
                </span>
              </div>
              <p v-else class="teacher-empty-cell">-</p>
            </td>
            <td class="teacher-history-memo-cell">
              <div v-if="item.teacherMemo" class="teacher-history-memo">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                <p>{{ item.teacherMemo }}</p>
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
  </BaseTeacherModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseTeacherModal from './BaseTeacherModal.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  riskLevel: {
    type: String,
    default: ''
  },
  history: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  showDetailAnalysis: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'resolve', 'detail-analysis'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleClose = () => {
  emit('update:modelValue', false)
}

const handleResolveClick = () => {
  emit('resolve')
}

const handleDetailAnalysisClick = () => {
  emit('detail-analysis')
}

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

<style scoped>
/* 액션 버튼 섹션 */
.teacher-modal-action-section {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #D4C4B0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.teacher-detail-analysis-btn-mobile {
  width: 100%;
  padding: 12px;
  background: #C4915C;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.teacher-detail-analysis-btn-mobile:hover {
  background: #A67B4A;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(196, 145, 92, 0.3);
}

.teacher-resolve-danger-btn {
  width: 100%;
  padding: 12px;
  background: #D32F2F;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.teacher-resolve-danger-btn:hover {
  background: #B71C1C;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
}

/* 로딩 상태 */
.teacher-history-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 12px;
}

.teacher-loading-icon {
  width: 40px;
  height: 40px;
  color: #C4915C;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.teacher-history-loading p {
  font-size: 14px;
  color: #8B7355;
}

/* 히스토리 테이블 */
.teacher-history-table-wrapper {
  max-height: 60vh;
  overflow-y: auto;
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #D4C4B0;
}

.teacher-history-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  min-width: 600px;
}

.teacher-history-table thead {
  background: #F0E8D8;
  position: sticky;
  top: 0;
  z-index: 10;
}

.teacher-history-table th {
  padding: 10px 8px;
  text-align: left;
  font-weight: 600;
  color: #5D4E37;
  border-bottom: 2px solid #D4C4B0;
  white-space: nowrap;
}

.teacher-history-table td {
  padding: 10px 8px;
  border-bottom: 1px solid #E8DCC8;
  color: #5D4E37;
}

.teacher-history-row {
  transition: background-color 0.2s;
}

.teacher-history-row:hover {
  background: #F0E8D8;
}

/* 날짜 셀 */
.teacher-history-date-cell {
  white-space: nowrap;
  font-size: 11px;
  color: #8B7355;
}

/* 레벨 변화 셀 */
.teacher-history-level-cell {
  min-width: 150px;
}

.teacher-history-level-change {
  display: flex;
  align-items: center;
  gap: 6px;
}

.teacher-level-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.teacher-level-normal {
  background: #E8F5E9;
  color: #2E7D32;
}

.teacher-level-caution {
  background: #FFF3E0;
  color: #E65100;
}

.teacher-level-danger {
  background: #FFEBEE;
  color: #C62828;
}

.teacher-level-none {
  background: #F5F5F5;
  color: #9E9E9E;
}

.teacher-arrow-icon {
  width: 14px;
  height: 14px;
  color: #A68B6A;
  flex-shrink: 0;
}

/* 사유 셀 */
.teacher-history-reason-cell {
  max-width: 150px;
}

.teacher-history-reason-cell p {
  font-size: 11px;
  line-height: 1.4;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 키워드 셀 */
.teacher-history-keywords-cell {
  max-width: 120px;
}

.teacher-history-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.teacher-keyword-tag {
  padding: 3px 6px;
  background: #FFE0B2;
  color: #E65100;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  white-space: nowrap;
}

/* 메모 셀 */
.teacher-history-memo-cell {
  max-width: 150px;
}

.teacher-history-memo {
  display: flex;
  align-items: flex-start;
  gap: 6px;
}

.teacher-history-memo svg {
  width: 14px;
  height: 14px;
  color: #C4915C;
  flex-shrink: 0;
  margin-top: 2px;
}

.teacher-history-memo p {
  font-size: 11px;
  line-height: 1.4;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.teacher-empty-cell {
  color: #A68B6A;
  font-size: 11px;
  margin: 0;
}

/* 히스토리 없음 */
.teacher-history-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.teacher-history-empty p {
  font-size: 14px;
  color: #8B7355;
}

/* 데스크톱 스타일 개선 */
@media (min-width: 769px) {
  .teacher-history-table {
    font-size: 14px;
    min-width: 800px;
  }

  .teacher-history-table th {
    padding: 14px 12px;
    font-size: 15px;
  }

  .teacher-history-table td {
    padding: 14px 12px;
  }

  .teacher-history-date-cell {
    font-size: 13px;
  }

  .teacher-level-badge {
    padding: 5px 10px;
    font-size: 12px;
  }

  .teacher-arrow-icon {
    width: 16px;
    height: 16px;
  }

  .teacher-history-memo svg {
    width: 18px;
    height: 18px;
  }

  .teacher-history-reason-cell p,
  .teacher-history-memo p {
    font-size: 13px;
  }

  .teacher-modal-action-section {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 12px;
  }

  .teacher-detail-analysis-btn-mobile,
  .teacher-resolve-danger-btn {
    padding: 12px 24px;
    font-size: 15px;
    width: auto;
  }
}
</style>
