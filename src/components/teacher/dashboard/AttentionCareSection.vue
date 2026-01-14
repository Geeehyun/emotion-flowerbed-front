<template>
  <section class="teacher-attention-section">
    <h3 class="teacher-attention-title">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
        <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clip-rule="evenodd" />
      </svg>
      집중 케어 필요
    </h3>

    <!-- 로딩 상태 -->
    <AttentionCareSkeleton v-if="isLoading" />

    <!-- 오류 상태 -->
    <div v-else-if="errorMessage" class="teacher-attention-empty-state">
      <div class="teacher-empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <p class="teacher-empty-message teacher-error-message">{{ errorMessage }}</p>
      <button @click="emit('retry')" class="teacher-retry-btn">다시 시도</button>
    </div>

    <!-- 케어 필요 학생 없음 (정상 상태) -->
    <div v-else-if="dangerStudents.length === 0 && attentionStudents.length === 0" class="teacher-attention-empty-state teacher-no-care-needed">
      <div class="teacher-empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="teacher-empty-message">집중 케어 필요 학생이 없습니다</p>
    </div>

    <!-- 학생 목록 -->
    <template v-else>
      <!-- 위험 학생 -->
      <div
        v-for="student in dangerStudents"
        :key="student.userSn"
        @click="emit('select-student', student)"
        :class="{ active: selectedRiskStudent?.userSn === student.userSn }"
        class="teacher-attention-card teacher-danger-card"
      >
        <div class="teacher-attention-card-content">
          <div class="teacher-attention-header">
            <span class="teacher-student-name">{{ student.name }}</span>
            <span class="teacher-danger-badge">위험</span>
          </div>
          <p class="teacher-danger-signal">{{ student.riskReason }}</p>
          <div v-if="student.riskContinuousArea" class="teacher-risk-meta">
            <span class="teacher-risk-continuous">{{ student.riskContinuousDays }}일 연속 {{ student.riskContinuousArea }} 영역</span>
          </div>
        </div>
      </div>

      <!-- 주의 학생 -->
      <div
        v-for="student in attentionStudents"
        :key="student.userSn"
        @click="emit('select-student', student)"
        :class="{ active: selectedRiskStudent?.userSn === student.userSn }"
        class="teacher-attention-card teacher-attention-card-warning"
      >
        <div class="teacher-attention-card-content">
          <div class="teacher-attention-header">
            <span class="teacher-student-name">{{ student.name }}</span>
            <span class="teacher-attention-badge">주의</span>
          </div>
          <p class="teacher-attention-reason">{{ student.riskReason }}</p>
          <div v-if="student.riskContinuousArea" class="teacher-risk-meta">
            <span class="teacher-risk-continuous">{{ student.riskContinuousDays }}일 연속 {{ student.riskContinuousArea }} 영역</span>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup>
import AttentionCareSkeleton from './AttentionCareSkeleton.vue'

const props = defineProps({
  dangerStudents: {
    type: Array,
    default: () => []
  },
  attentionStudents: {
    type: Array,
    default: () => []
  },
  selectedRiskStudent: {
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

const emit = defineEmits(['select-student', 'retry'])
</script>
