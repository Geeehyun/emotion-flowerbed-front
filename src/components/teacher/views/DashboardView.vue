<template>
  <div class="teacher-dashboard-view">
    <!-- 학급 감정 분포 -->
    <EmotionDistributionSection
      :selectedDate="selectedDate"
      @update:selectedDate="emit('update:selectedDate', $event)"
      :isLoading="isLoading"
      :errorMessage="errorMessage"
      :totalStudents="totalStudents"
      :zoneDistribution="zoneDistribution"
      :students="students"
      @date-change="emit('date-change')"
    />

    <div class="teacher-dashboard-grid" :class="{ 'has-history': selectedRiskStudent }">
      <!-- 집중 케어 필요 -->
      <AttentionCareSection
        :dangerStudents="dangerStudents"
        :attentionStudents="attentionStudents"
        :selectedRiskStudent="selectedRiskStudent"
        :isLoading="isLoadingRisk"
        :errorMessage="riskErrorMessage"
        @select-student="emit('select-risk-student', $event)"
        @retry="emit('retry-risk-students')"
      />

      <!-- 위험 히스토리 패널 -->
      <RiskHistorySection
        v-if="selectedRiskStudent && !isRiskHistoryMobileModalOpen"
        :selectedRiskStudent="selectedRiskStudent"
        :riskHistory="riskHistory"
        :isLoadingHistory="isLoadingHistory"
        @detail-analysis="emit('detail-analysis', $event)"
        @resolve-danger="emit('resolve-danger')"
      />
    </div>
  </div>
</template>

<script setup>
import EmotionDistributionSection from '../dashboard/EmotionDistributionSection.vue'
import AttentionCareSection from '../dashboard/AttentionCareSection.vue'
import RiskHistorySection from '../dashboard/RiskHistorySection.vue'

const props = defineProps({
  selectedDate: {
    type: String,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  },
  totalStudents: {
    type: Number,
    default: 0
  },
  zoneDistribution: {
    type: Object,
    required: true
  },
  students: {
    type: Array,
    default: () => []
  },
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
  riskHistory: {
    type: Object,
    default: null
  },
  isLoadingHistory: {
    type: Boolean,
    default: false
  },
  isRiskHistoryMobileModalOpen: {
    type: Boolean,
    default: false
  },
  isLoadingRisk: {
    type: Boolean,
    default: false
  },
  riskErrorMessage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:selectedDate', 'date-change', 'select-risk-student', 'detail-analysis', 'resolve-danger', 'retry-risk-students'])
</script>
