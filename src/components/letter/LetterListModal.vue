<template>
  <BaseModal
    v-model="isOpen"
    title="감정 레터함"
    max-width="800px"
    @close="handleClose"
  >
    <template #default>
      <!-- 필터 -->
      <div class="letter-filter">
        <button
          v-for="filter in filters"
          :key="filter.value"
          class="filter-btn"
          :class="{ active: selectedFilter === filter.value }"
          @click="selectedFilter = filter.value"
        >
          {{ filter.label }}
        </button>
      </div>

      <!-- 레터 목록 -->
      <div v-if="filteredLetters.length > 0" class="letter-list">
        <div
          v-for="letter in filteredLetters"
          :key="letter.id"
          class="letter-item"
          :class="{ unread: !letter.isRead }"
          @click="$emit('select-letter', letter)"
        >
          <div class="letter-icon">
            <img
              src="@/assets/images/letterbox.png"
              alt="편지"
              class="letterbox-icon"
              loading="lazy"
            />
            <span v-if="!letter.isRead" class="unread-badge">NEW</span>
          </div>
          <div class="letter-info">
            <div class="letter-header">
              <h3 class="letter-title">{{ letter.title }}</h3>
              <span class="letter-date">{{ letter.date }}</span>
            </div>
            <p class="letter-preview">{{ letter.preview }}</p>
            <div class="letter-meta">
              <span class="letter-period">{{ letter.period }}</span>
              <span class="letter-emotion-count">{{ letter.emotionCount }}개 감정 기록</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 레터가 없을 때 -->
      <div v-else class="empty-state">
        <div class="empty-icon">📭</div>
        <p class="empty-message">표시할 레터가 없어요</p>
        <p class="empty-sub">일기를 꾸준히 작성하면 매주 감정 레터를 받을 수 있어요!</p>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/common/modals/BaseModal.vue'
import * as weeklyReportApi from '@/services/weeklyReportApi.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'select-letter'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleClose = () => {
  emit('close')
}

// 필터
const filters = [
  { label: '전체', value: 'all' },
  { label: '읽지 않음', value: 'unread' },
  { label: '읽음', value: 'read' },
  { label: '최근 3개월', value: 'recent' }
]

const selectedFilter = ref('all')
const letters = ref([])
const isLoading = ref(false)

// 주간 리포트 목록 조회
const loadLetterList = async () => {
  isLoading.value = true
  try {
    const reportList = await weeklyReportApi.getWeeklyReportList(selectedFilter.value)

    // API 응답을 UI 형식으로 변환
    letters.value = reportList.map(report => {
      const startDate = new Date(report.startDate)
      const endDate = new Date(report.endDate)

      return {
        id: report.reportId,
        title: `${startDate.getFullYear()}년 ${startDate.getMonth() + 1}월 ${Math.ceil(startDate.getDate() / 7)}주차 감정 레터`,
        date: report.createdAt.split('T')[0].replace(/-/g, '.'),
        period: `${report.startDate.replace(/-/g, '.')} - ${report.endDate.replace(/-/g, '.')}`,
        preview: '이번 주 감정 여정을 담은 특별한 레터입니다. 클릭해서 자세히 확인해보세요!',
        emotionCount: report.diaryCount,
        isRead: report.readYn
      }
    })
  } catch (error) {
    console.error('레터 목록 조회 실패:', error)
    letters.value = []
  } finally {
    isLoading.value = false
  }
}

const filteredLetters = computed(() => {
  if (letters.value.length === 0) return []

  switch (selectedFilter.value) {
    case 'unread':
      return letters.value.filter(letter => !letter.isRead)
    case 'read':
      return letters.value.filter(letter => letter.isRead)
    case 'recent':
      // 최근 3개월 필터링 로직 (실제로는 날짜 비교 필요)
      return letters.value.slice(0, 3)
    default:
      return letters.value
  }
})

// 모달이 열릴 때마다 목록 새로고침
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    loadLetterList()
  }
})

// 필터 변경 시 목록 새로고침
watch(selectedFilter, () => {
  loadLetterList()
})
</script>
