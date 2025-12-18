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
      <div class="letter-list">
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
      <div v-if="filteredLetters.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <p class="empty-message">아직 받은 레터가 없어요</p>
        <p class="empty-sub">일기를 꾸준히 작성하면 매주 감정 레터를 받을 수 있어요!</p>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseModal from '@/components/common/modals/BaseModal.vue'

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

// TODO: API 연동 시 실제 데이터로 교체
const mockLetters = [
  {
    id: 1,
    title: '2024년 1월 1주차 감정 레터',
    date: '2024.01.07',
    period: '2024.01.01 - 01.07',
    preview: '이번 주는 행복한 감정이 많았던 한 주였어요! 특히 기쁨과 평온함이 주를 이뤘습니다...',
    emotionCount: 7,
    isRead: false
  },
  {
    id: 2,
    title: '2023년 12월 4주차 감정 레터',
    date: '2023.12.31',
    period: '2023.12.25 - 12.31',
    preview: '한 해를 마무리하는 한 주, 다양한 감정들이 교차했어요. 설렘과 아쉬움이 공존했습니다...',
    emotionCount: 6,
    isRead: true
  },
  {
    id: 3,
    title: '2023년 12월 3주차 감정 레터',
    date: '2023.12.24',
    period: '2023.12.18 - 12.24',
    preview: '크리스마스를 앞둔 한 주, 들뜬 마음과 함께 여유로운 시간을 보냈어요...',
    emotionCount: 5,
    isRead: true
  }
]

const filteredLetters = computed(() => {
  switch (selectedFilter.value) {
    case 'unread':
      return mockLetters.filter(letter => !letter.isRead)
    case 'read':
      return mockLetters.filter(letter => letter.isRead)
    case 'recent':
      // 최근 3개월 필터링 로직 (실제로는 날짜 비교 필요)
      return mockLetters.slice(0, 3)
    default:
      return mockLetters
  }
})
</script>
