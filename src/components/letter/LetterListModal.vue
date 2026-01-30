<template>
  <BaseModal
    v-model="isOpen"
    max-width="800px"
    @close="handleClose"
  >
    <template #header>
      <div class="letter-list-header">
        <div class="letter-title-wrapper">
          <h2 v-if="!showGenerateView" class="letter-list-title">감정 레터함</h2>
          <h2 v-else class="letter-list-title">레터 발행 신청</h2>
          <button
            v-if="!showGenerateView"
            class="header-generate-btn"
            @click="openGenerateView"
            title="레터 발행 신청"
          >
            <EnvelopeIcon class="header-btn-icon" />
            <span class="header-btn-plus">+</span>
          </button>
        </div>
      </div>
    </template>

    <template #default>
      <!-- 발행 신청 뷰 -->
      <div v-if="showGenerateView" class="generate-view">
        <button class="back-to-list-btn" @click="closeGenerateView">
          ← 레터 목록
        </button>

        <div class="generate-guide">
          <p class="generate-guide-text">
            아래 목록에서 발행받고 싶은 주를 선택해주세요.<br>
            일기가 3개 이상 작성된 주만 신청할 수 있어요.
          </p>
          <div class="generate-limit-info">
            <span class="limit-label">오늘 발행 가능 횟수</span>
            <span class="limit-value" :class="{ 'no-remaining': generableLimitInfo.remainingCount === 0 }">
              {{ generableLimitInfo.remainingCount }} / {{ generableLimitInfo.dailyLimit }}
            </span>
          </div>
        </div>

        <!-- 로딩 중 -->
        <div v-if="isLoadingGenerableWeeks" class="generate-loading">
          발행 가능한 주를 확인하는 중...
        </div>

        <!-- 발행 횟수 소진 안내 -->
        <div v-else-if="generableLimitInfo.remainingCount === 0" class="generate-limit-exceeded">
          <p class="limit-exceeded-message">오늘은 더 이상 감정레터를 발행할 수 없어요</p>
          <p class="limit-exceeded-sub">내일 다시 시도해볼까요?</p>
        </div>

        <!-- 신청 가능한 주 목록 -->
        <div v-else-if="generableWeeks.length > 0" class="generate-week-list">
          <div
            v-for="week in generableWeeks"
            :key="`${week.startDate}-${week.endDate}`"
            class="generate-week-item"
          >
            <div class="week-info">
              <span class="week-period">
                {{ formatDate(week.startDate) }} ~ {{ formatDate(week.endDate) }}
              </span>
              <span class="week-diary-count">일기 {{ week.diaryCount }}개</span>
            </div>
            <button
              class="week-generate-btn"
              :disabled="isGenerating || generableLimitInfo.remainingCount === 0"
              @click="handleGenerate(week)"
            >
              {{ isGenerating ? '신청 중...' : '신청' }}
            </button>
          </div>
        </div>

        <!-- 신청 가능한 주가 없을 때 -->
        <div v-else class="generate-empty">
          <div class="empty-icon">📝</div>
          <p class="empty-message">발행 가능한 주가 없어요</p>
          <p class="empty-sub">일기를 3개 이상 작성한 주가 있어야 신청할 수 있어요.</p>
        </div>
      </div>

      <!-- 기존 레터 목록 뷰 -->
      <div v-else>
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
              src="/icons/letterbox.png"
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

      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { EnvelopeIcon } from '@heroicons/vue/24/outline'
import BaseModal from '@/components/common/modals/BaseModal.vue'
import * as weeklyReportApi from '@/services/weeklyReportApi.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'select-letter', 'generate-success', 'show-loading', 'hide-loading'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleClose = () => {
  emit('close')
}

// 필터
const filters = [
  { label: '최근 3개월', value: 'recent' },
  { label: '읽지 않음', value: 'unread' },
  { label: '읽음', value: 'read' },
  { label: '전체', value: 'all' }
]

const selectedFilter = ref('recent')
const letters = ref([])
const isLoading = ref(false)

// 발행 신청 관련 상태
const showGenerateView = ref(false)
const generableWeeks = ref([])
const generableLimitInfo = ref({ dailyLimit: 1, usedCount: 0, remainingCount: 1 })
const isLoadingGenerableWeeks = ref(false)
const isGenerating = ref(false)

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

// 발행 신청 뷰 열기
const openGenerateView = async () => {
  showGenerateView.value = true
  await loadGenerableWeeks()
}

// 발행 신청 뷰 닫기
const closeGenerateView = () => {
  showGenerateView.value = false
  generableWeeks.value = []
}

// 발행 가능 주 목록 조회
const loadGenerableWeeks = async () => {
  isLoadingGenerableWeeks.value = true
  try {
    const response = await weeklyReportApi.getGenerableWeeks()
    generableWeeks.value = response.weeks || []
    generableLimitInfo.value = {
      dailyLimit: response.dailyLimit || 1,
      usedCount: response.usedCount || 0,
      remainingCount: response.remainingCount || 0
    }
  } catch (error) {
    console.error('발행 가능 주 조회 실패:', error)
    generableWeeks.value = []
  } finally {
    isLoadingGenerableWeeks.value = false
  }
}

// 발행 신청 처리
const handleGenerate = async (week) => {
  isGenerating.value = true
  emit('show-loading', '감정 레터를 발행하고 있어요...')
  try {
    await weeklyReportApi.generateWeeklyReport(week.startDate, week.endDate)
    emit('hide-loading')
    closeGenerateView()
    await loadLetterList()
    emit('generate-success')
  } catch (error) {
    emit('hide-loading')
    console.error('발행 신청 실패:', error)
    alert(error.message || '발행 신청에 실패했습니다.')
  } finally {
    isGenerating.value = false
  }
}

// 날짜 포맷 (YYYY-MM-DD → YYYY.MM.DD)
const formatDate = (dateStr) => {
  return dateStr.replace(/-/g, '.')
}

// 모달 닫힐 때 상태 초기화
watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    showGenerateView.value = false
    generableWeeks.value = []
  }
})
</script>
